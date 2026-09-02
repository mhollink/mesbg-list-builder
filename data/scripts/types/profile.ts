import {z} from "zod";
import {profileMagicPowerRowSchema, profileRowSchema, profileRuleRowSchema, profileStatsRowSchema} from "../schemas";

export type Profile = z.infer<typeof profileRowSchema>;
export type Stats = z.infer<typeof profileStatsRowSchema>
export type ProfileRule = z.infer<typeof profileRuleRowSchema>
export type MagicalPower = z.infer<typeof profileMagicPowerRowSchema>