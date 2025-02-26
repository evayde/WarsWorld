import { z } from "zod";
import { unitTypeSchema } from "./unit";
import { weatherSettingSchema } from "./weather";
import { gameVersionSchema } from "./game-version";

export const matchRulesSchema = z.object({
  unitCapPerPlayer: z.number().int().positive(),
  fogOfWar: z.boolean(),
  /**
   * If no game version is specified, each CO will use its own
   */
  gameVersion: gameVersionSchema.optional(),
  fundsPerProperty: z.number().int(),
  /**
   * Allowed unit types only if a lab is owned
   */
  labUnitTypes: unitTypeSchema.array(),
  bannedUnitTypes: unitTypeSchema.array(),
  captureLimit: z.number().int().positive(),
  dayLimit: z.number().int().positive(),
  weatherSetting: weatherSettingSchema,
  /**
   * indexes are playerSlots of the map, values are the team
   * the slot is assigned to.
   * 
   * team indexes start at 0, playerSlots as well but -1 is special value for neutral properties
   * so teamMapping[0] would tell us the team for playerSlot 0 (which is the first player)
   */
  teamMapping: z.array(z.number().int().nonnegative())
});

export type MatchRules = z.infer<typeof matchRulesSchema>;
