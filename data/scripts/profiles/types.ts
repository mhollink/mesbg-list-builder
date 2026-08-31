import { z } from "zod";

import {
    additionalTextRowSchema,
    magicPowerRowSchema,
    profileRowSchema,
    profileRuleRowSchema,
    profileTypeSchema,
    statsRowSchema,
} from "./schemas";

export type ProfileType = z.infer<typeof profileTypeSchema>;

export type ProfileRow = z.infer<typeof profileRowSchema>;
export type StatsRow = z.infer<typeof statsRowSchema>;
export type ProfileRuleRow = z.infer<typeof profileRuleRowSchema>;
export type MagicPowerRow = z.infer<typeof magicPowerRowSchema>;
export type AdditionalTextRow = z.infer<typeof additionalTextRowSchema>;

export interface Stats {
    mv: string;
    fv: string;
    sv: string;
    s: string;
    d: string;
    a: string;
    w: string;
    c: string;
    i: string;

    hm?: string;
    hw?: string;
    hf?: string;

    range?: string;
}

export interface ProfileRule {
    rule: string;
    type?: string;
    optionDependency?: string;
}

export interface MagicPower {
    power: string;
    range: string;
    cast: string;
    target?: string;
}

export interface Profile {
    profile: string;
    origin: string;
    type: ProfileType;

    parentProfile?: string;

    displayStatRow: boolean;
    selectable: boolean;

    stats: Stats;

    heroicActions: string[];
    specialRules: string[];
    wargear: string[];

    profileRules: ProfileRule[];
    magicPowers: MagicPower[];
    additionalText: string[];
}