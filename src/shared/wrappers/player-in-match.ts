import { isSamePosition, type Position } from "shared/schemas/position";
import { unitPropertiesMap } from "shared/match-logic/buildable-unit";
import { COPropertiesMap } from "shared/match-logic/co";
import type {
  COHookAllowReturnUndefined,
  COHookPlayerProps,
  COHookWithDefenderAllowReturnUndefined,
  COHooks,
} from "shared/match-logic/co-hooks";
import type { PlayerInMatch } from "shared/types/server-match-state";
import type { MatchWrapper } from "./match";
import type { WWUnit } from "shared/schemas/unit";
import { isHiddenTile } from "shared/match-logic/tiles";

export class PlayerInMatchWrapper {
  constructor(public data: PlayerInMatch, public match: MatchWrapper) {}

  getCOHookPlayerProps(unitPosition: Position): COHookPlayerProps {
    const attackingUnit = this.match.units.getUnitOrThrow(unitPosition);

    return {
      player: this,
      unitFacility: unitPropertiesMap[attackingUnit.data.type].facility,
      tileType:
        this.match.map.data.tiles[unitPosition[0]][unitPosition[1]].type,
      unitType: attackingUnit.data.type,
    };
  }

  getCommtowerAttackBoost() {
    return this.match.changeableTiles.reduce(
      (prev, cur) =>
        cur.type === "commtower" && cur.ownerSlot === this.data.slot
          ? prev + 1
          : prev,
      0
    );
  }

  getUnits() {
    return this.match.units.getPlayerUnits(this.data.slot);
  }

  /**
   * TODO Teams!
   */
  getEnemyUnits() {
    return this.match.units.getEnemyUnits(this.data.slot);
  }

  isTilePassable(position: Position) {
    // if tile has pipe seam or something?
    // what other obstructions are there?
    return !this.getEnemyUnits().hasUnit(position);
  }

  private getMergedCOHooks() {
    const COProperties = COPropertiesMap[this.data.co];

    const d2dHooks = COProperties.dayToDay?.hooks ?? {};
    const COPHooks = COProperties.powers.COPower?.hooks ?? {};
    const SCOPHooks = COProperties.powers.superCOPower?.hooks ?? {};

    switch (this.data.COPowerState) {
      case "no-power":
        return d2dHooks;
      case "co-power":
        return { ...d2dHooks, ...COPHooks };
      case "super-co-power":
        return { ...d2dHooks, ...SCOPHooks };
    }
  }

  /**
   * The CO definitions use `COHooksAllowReturnUndefined`
   * which is a Partial and also allows returning... well `undefined`.
   * This function will both "fill up" all the gaps for undefined hooks
   * as well as return the input value when the hook returned `undefined` (= no changes).
   */
  getCOHooksWithUnit(unitPosition: Position) {
    const COHooks = this.getMergedCOHooks();
    const props = this.match.getCOHookPropsWithUnit(unitPosition);

    const withDefaults = (hook?: COHookAllowReturnUndefined) => {
      return (val: number) => hook?.(val, props) ?? val;
    };

    return {
      onMovementRange: withDefaults(COHooks.onMovementRange),
      onMovementCost: withDefaults(COHooks.onMovementCost),
      onBuildCost: withDefaults(COHooks.onBuildCost),
      onFuelDrain: withDefaults(COHooks.onFuelDrain),
      onFuelCost: withDefaults(COHooks.onFuelCost),
      onCapture: withDefaults(COHooks.onCapture),
      onVision: withDefaults(COHooks.onVision),
    };
  }

  getCOHooksWithDefender(
    attackerPosition: Position,
    defenderPosition: Position /** TODO maybe pass players or slots instead instead of positions */
  ) {
    const COHooks = this.getMergedCOHooks();
    const props = this.match.getCOHookPropsWithDefender(
      attackerPosition,
      defenderPosition
    );

    const withDefaults = (hook?: COHookWithDefenderAllowReturnUndefined) => {
      return (val: number) => hook?.(val, props) ?? val;
    };

    return {
      ...this.getCOHooksWithUnit(attackerPosition),
      onAttackModifier: withDefaults(COHooks.onAttackModifier),
      onDefenseModifier: withDefaults(COHooks.onDefenseModifier),
      onGoodLuck: withDefaults(COHooks.onGoodLuck),
      onBadLuck: withDefaults(COHooks.onBadLuck),
      onTerrainStars: withDefaults(COHooks.onTerrainStars),
      onAttackRange: withDefaults(COHooks.onAttackRange),
    };
  }

  getMovementPoints(unit: WWUnit) {
    const unitProperties = unitPropertiesMap[unit.type];
    const baseMovement = unitProperties.moveRange;

    const movement = this.getCOHooksWithUnit(unit.position).onMovementRange(
      baseMovement
    );

    return Math.min(movement, unit.stats.fuel); /** TODO checking fuel twice? */
  }

  getNextAlivePlayer() {
    const nextSlot = (n: number) =>
      (n + 1) % this.match.map.data.numberOfPlayers;

    for (
      let i = nextSlot(this.data.slot);
      i !== this.data.slot;
      i = nextSlot(i)
    ) {
      const player = this.match.players.getBySlot(i);

      if (player?.data.eliminated === true) {
        return player;
      }
    }
  }

  getVision(): Position[] {
    const playerVisionPositions: Position[] = [];

    /** a bit ugly and idk if this can be made faster */
    for (const unit of this.getUnits().data) {
      for (const unitVisionPosition of unit.getVision()) {
        for (const existingVisionPosition of playerVisionPositions) {
          if (!isSamePosition(existingVisionPosition, unitVisionPosition)) {
            playerVisionPositions.push(unitVisionPosition);
          }
        }
      }
    }

    return playerVisionPositions;
  }

  /**
   * This might be suboptimal - especially considering clear-weather matches,
   * but it should cover discovering hidden units as well as fog of war
   * without too much complexity.
   */
  getEnemyUnitsInVision() {
    const vision = this.match.rules.fogOfWar ? this.getVision() : null;

    return this.getEnemyUnits().data.filter((enemy) => {
      if (enemy.isHiddenFromPlayerThroughHiddenPropertyOrTile(this)) {
        return false;
      }

      if (vision === null) {
        return true;
      }

      return vision.some((p) => enemy.isAtPosition(p));
    });
  }

  gainFunds() {
    // TODO get all owned properties + check if high funds mode + ?
  }
}
