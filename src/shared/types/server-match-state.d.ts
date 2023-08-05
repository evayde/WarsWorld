import { LeagueType, MatchStatus, Player, WWMap } from "@prisma/client";
import { Army } from "server/schemas/army";
import { CO } from "server/schemas/co";
import { PlayerSlot } from "server/schemas/player-slot";
import { Position } from "server/schemas/position";
import { CreatableUnit } from "server/schemas/unit";
import { PropertyTileType, UnusedSiloTileType } from "server/schemas/tile";

interface WithPosition {
  position: Position;
}

interface CapturableTile extends WithPosition {
  type: PropertyTileType;
  hp: number;
  ownerSlot: PlayerSlot;
}

interface LaunchableSiloTile extends WithPosition {
  type: UnusedSiloTileType;
  fired: boolean;
}

export type ChangeableTile = CapturableTile | LaunchableSiloTile;

//TODO: Add player name to this, it would make things easier rather than
// having to always look up players id to get their username
export interface PlayerInMatch {
  playerSlot: PlayerSlot;
  hasCurrentTurn?: boolean;
  playerId: Player["id"];
  ready?: boolean;
  co: CO;
  eliminated?: boolean;
  funds: number;
  powerMeter: number;
  army: Army;
}

//TODO: Add favorites, possibly spectators, also a timer
export interface BackendMatchState {
  id: string;
  rules: {
    fogOfWar?: boolean;
    fundsMultiplier?: number;
    leagueType: LeagueType;
  };
  status: MatchStatus;
  map: WWMap;
  changeableTiles: ChangeableTile[];
  units: CreatableUnit[];
  turn: number;
  players: PlayerInMatch[];
}


