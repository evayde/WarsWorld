import type { Player } from "@prisma/client";
import type { Army } from "shared/schemas/army";
import type { COID } from "shared/schemas/co";
import type { PlayerSlot } from "shared/schemas/player-slot";
import type { Position } from "shared/schemas/position";
import type { PropertyTileType, UnusedSiloTileType } from "shared/schemas/tile";
import type { COPowerState } from "shared/match-logic/co";

type WithPosition = {
  position: Position;
};

export type CapturableTile = WithPosition & {
  type: PropertyTileType;
  ownerSlot: PlayerSlot; // TODO i think i mixed up "playerSlot" and "ownerSlot" in places. needs to be made consistent.
  // capture points are stored in unit
};

type LaunchableSiloTile = WithPosition & {
  type: UnusedSiloTileType;
  fired: boolean;
};

export type ChangeableTile = CapturableTile | LaunchableSiloTile;

export type PlayerInMatch = {
  slot: PlayerSlot;
  hasCurrentTurn?: boolean;
  id: Player["id"];
  name: Player["name"];
  ready?: boolean;
  coId: COID;
  eliminated?: boolean;
  funds: number;
  powerMeter: number;
  timesPowerUsed: number;
  army: Army;
  COPowerState: COPowerState;
};
