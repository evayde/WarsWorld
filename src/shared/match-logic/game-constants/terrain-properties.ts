import type { MovementType } from "shared/match-logic/game-constants/unit-properties";
import type { TileType } from "shared/schemas/tile";

/**
 * A nonzero integer (or null for impassible)
 * for every possible "movement type".
 */
type TileMovementCosts = Record<MovementType, number | null>;

type TileProperties = {
  movementCosts: TileMovementCosts;
  /**
   * An integer from 0 to 4 which modifies the amount of damage
   * a unit on this tile takes from attacks.
   */
  defenseStars: number;
};

/** All ocean tiles are impassible for land units. */
const commonOceanMovementCosts = {
  foot: null,
  boots: null,
  treads: null,
  tires: null,
  air: 1,
  pipe: null
} satisfies Partial<TileMovementCosts>;

/**
 * Some movement costs are shared by all ground-based map tiles
 * like forests, rivers and cities.
 * Specifically, if a map tile is passable for infantry,
 * we consider it to be a "land" tile.
 */
const commonLandMovementCosts = {
  boots: 1,
  air: 1,
  pipe: null,
  sea: null,
  lander: null
} satisfies Partial<TileMovementCosts>;

/**
 * All man-made structures (roads, buildings) have the same movement costs,
 * with two exceptions:
 * - Pipes are impassible except by piperunners.
 * - Any building which *could have* produced a unit
 * has a movement cost of 1 for that unit.
 *   - For example, ships can move through ports
 *     and piperunners can move through bases.
 */
const manMadeMovementCosts: TileMovementCosts = {
  ...commonLandMovementCosts,
  foot: 1,
  treads: 1,
  tires: 1
};

const buildingTileProperties: TileProperties = {
  /** All buildings provide 3 defense, except for the HQ which provides 4. */
  defenseStars: 3,
  movementCosts: manMadeMovementCosts
};

/** Pipes and (unbroken) pipe seams are exactly the same */
const pipeTileProperties: TileProperties = {
  defenseStars: 0,
  movementCosts: {
    foot: null,
    boots: null,
    treads: null,
    tires: null,
    air: null,
    pipe: 1,
    sea: null,
    lander: null
  }
};

/**
 * The "normal" defense and movement costs for all tiles types,
 * before any modifications from weather and/or COs.
 *
 * Every unit has exactly one "movement type",
 * for example tanks have type "treads".
 * This object shows the amount of movement points which must be spent
 * to *enter* each type of tile, for each "movement type".
 * `null` means impassible terrain.
 */
export const terrainProperties: Record<TileType, TileProperties> = {
  plain: {
    defenseStars: 1,
    movementCosts: {
      ...commonLandMovementCosts,
      foot: 1,
      treads: 1,
      tires: 2
    }
  },
  forest: {
    defenseStars: 2,
    movementCosts: {
      ...commonLandMovementCosts,
      foot: 1,
      treads: 2,
      tires: 3
    }
  },
  mountain: {
    defenseStars: 4,
    movementCosts: {
      ...commonLandMovementCosts,
      foot: 2,
      treads: null,
      tires: null
    }
  },
  river: {
    defenseStars: 0,
    movementCosts: {
      ...commonLandMovementCosts,
      foot: 2,
      treads: null,
      tires: null
    }
  },
  road: {
    defenseStars: 0,
    movementCosts: manMadeMovementCosts
  },
  sea: {
    defenseStars: 0,
    movementCosts: {
      ...commonOceanMovementCosts,
      sea: 1,
      lander: 1
    }
  },
  shoal: {
    defenseStars: 0,
    movementCosts: {
      ...commonLandMovementCosts,
      foot: 1,
      treads: 1,
      tires: 1,
      // This is a beach, so navy *transports* can go here
      // but no other navy units!
      lander: 1
    }
  },
  reef: {
    defenseStars: 1,
    movementCosts: {
      ...commonOceanMovementCosts,
      sea: 2,
      lander: 2
    }
  },
  pipe: pipeTileProperties,
  pipeSeam: pipeTileProperties,
  base: {
    defenseStars: buildingTileProperties.defenseStars,
    movementCosts: {
      ...manMadeMovementCosts,
      // Any building which *could have* produced a unit has
      // a movement cost of 1 for that unit.
      // Bases build piperunners.
      pipe: 1
    }
  },
  port: {
    defenseStars: buildingTileProperties.defenseStars,
    movementCosts: {
      ...manMadeMovementCosts,
      // Any building which *could have* produced a unit has
      // a movement cost of 1 for that unit.
      // Ports build ships.
      sea: 1,
      lander: 1
    }
  },
  airport: buildingTileProperties,
  city: buildingTileProperties,
  hq: {
    defenseStars: 4,
    movementCosts: manMadeMovementCosts
  },
  bridge: {
    defenseStars: 0,
    movementCosts: manMadeMovementCosts
  },
  lab: buildingTileProperties,
  commtower: buildingTileProperties,
  unusedSilo: buildingTileProperties,
  usedSilo: buildingTileProperties
};

/**
 * Every type of map tile has some number of "defense stars",
 * an integer between 0 and 4 which modifies the amount of damage
 * a unit on that tile takes from attacks.
 */
export const getTerrainDefenseStars = (tileType: TileType) => terrainProperties[tileType].defenseStars;
