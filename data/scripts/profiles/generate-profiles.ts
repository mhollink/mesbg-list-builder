
// @ts-expect-error
import { mkdir } from "node:fs/promises";
// @ts-expect-error
import { fileURLToPath } from "node:url";

import { z } from "zod";

import { readFile, readSheet } from "../excel/readSheet";
import { SUPPORTED_LOCALES, type SupportedLocale } from "../locales";
import { writeJson } from "../output/write-json";
import type {
    NestedTranslations,
    TranslationMap,
    TranslationRow,
} from "../types";
import {
    additionalTextRowSchema,
    magicPowerRowSchema,
    profileRowSchema,
    profileRuleRowSchema,
    statsRowSchema,
} from "./schemas";
import type {
    AdditionalTextRow,
    MagicPower,
    MagicPowerRow,
    Profile,
    ProfileRow,
    ProfileRule,
    ProfileRuleRow,
    Stats,
    StatsRow,
} from "./types";
import {translationRowSchema} from "../rules/schemas";

const profilesWorkbookPath = fileURLToPath(
    new URL("../../raw/profiles/profiles.xlsx", import.meta.url),
);

const translationsWorkbookPath = fileURLToPath(
    new URL("../../raw/profiles/translations.xlsx", import.meta.url),
);

const generatedProfilesDirectory = fileURLToPath(
    new URL("../../generated/game-data", import.meta.url),
);

const generatedTranslationsDirectory = fileURLToPath(
    new URL("../../generated/i18n", import.meta.url),
);

interface ProfileWorkbook {
    profiles: ProfileRow[];
    stats: StatsRow[];
    profileRules: ProfileRuleRow[];
    magicPowers: MagicPowerRow[];
    additionalText: AdditionalTextRow[];
}

function readProfilesWorkbook(): ProfileWorkbook {
    const workbook = readFile(profilesWorkbookPath);

    const profiles = parseRows(
        readSheet(workbook, "Profiles"),
        profileRowSchema,
        "profile",
    );

    const stats = parseRows(
        readSheet(workbook, "Stats"),
        statsRowSchema,
        "stats",
    );

    const profileRules = parseRows(
        readSheet(workbook, "ProfileRules"),
        profileRuleRowSchema,
        "profile rule",
    );

    const magicPowers = parseRows(
        readSheet(workbook, "MagicPowers"),
        magicPowerRowSchema,
        "magic power",
    );

    const additionalText = parseRows(
        readSheet(workbook, "AdditionalText"),
        additionalTextRowSchema,
        "additional text",
    );

    validateProfileWorkbook({
        profiles,
        stats,
        profileRules,
        magicPowers,
        additionalText,
    });

    return {
        profiles,
        stats,
        profileRules,
        magicPowers,
        additionalText,
    };
}

function parseRows<T>(
    rows: unknown[],
    schema: z.ZodType<T>,
    description: string,
): T[] {
    return rows.map((row, index) => {
        const result = schema.safeParse(row);

        if (!result.success) {
            throw new Error(
                [
                    `Invalid ${description} at Excel row ${index + 2}:`,
                    z.prettifyError(result.error),
                ].join("\n"),
            );
        }

        return result.data;
    });
}

function validateProfileWorkbook(data: ProfileWorkbook): void {
    ensureUnique(
        data.profiles.map((profile) => profile.profile),
        "profile",
    );

    ensureUnique(
        data.stats.map((stats) => stats.profile),
        "stats profile",
    );

    const profiles = new Set(data.profiles.map((profile) => profile.profile));

    for (const profile of data.profiles) {
        if (
            profile.parent_profile &&
            !profiles.has(profile.parent_profile)
        ) {
            throw new Error(
                `Unknown parent profile '${profile.parent_profile}' referenced by '${profile.profile}'`,
            );
        }
    }

    const statsProfiles = new Set(data.stats.map((stats) => stats.profile));

    for (const profile of data.profiles) {
        if (!statsProfiles.has(profile.profile)) {
            throw new Error(
                `Missing stats for profile '${profile.profile}'`,
            );
        }
    }

    validateProfileReferences(
        data.profileRules,
        profiles,
        (row) => row.profile,
        "profile rule",
    );

    validateProfileReferences(
        data.magicPowers,
        profiles,
        (row) => row.profile,
        "magic power",
    );

    validateProfileReferences(
        data.additionalText,
        profiles,
        (row) => row.profile,
        "additional text",
    );
}

function validateProfileReferences<T>(
    rows: T[],
    profiles: Set<string>,
    getProfile: (row: T) => string,
    description: string,
): void {
    for (const row of rows) {
        const profile = getProfile(row);

        if (!profiles.has(profile)) {
            throw new Error(
                `Unknown profile '${profile}' referenced by ${description}`,
            );
        }
    }
}

function buildProfiles(data: ProfileWorkbook): Profile[] {
    const statsByProfile = new Map(
        data.stats.map((row) => [row.profile, row]),
    );

    const rulesByProfile = groupByProfile(data.profileRules);
    const powersByProfile = groupByProfile(data.magicPowers);
    const textByProfile = groupByProfile(data.additionalText);

    return data.profiles.map((row) => {
        const stats = statsByProfile.get(row.profile);

        if (!stats) {
            throw new Error(
                `Missing stats for profile '${row.profile}'`,
            );
        }

        return {
            profile: row.profile,
            origin: row.origin,
            type: row.type,

            ...(row.parent_profile
                ? { parentProfile: row.parent_profile }
                : {}),

            displayStatRow: row.display_stat_row,
            selectable: row.selectable,

            stats: mapStats(stats),

            heroicActions: splitList(row.heroic_actions),
            specialRules: splitList(row.special_rules),
            wargear: splitList(row.wargear),

            profileRules: (rulesByProfile.get(row.profile) ?? [])
                .sort(byOrder)
                .map(mapProfileRule),

            magicPowers: (powersByProfile.get(row.profile) ?? [])
                .sort(byOrder)
                .map(mapMagicPower),

            additionalText: (textByProfile.get(row.profile) ?? [])
                .sort(byOrder)
                .map((text) => text.text),
        };
    });
}

function mapStats(row: StatsRow): Stats {
    return {
        mv: row.mv,
        fv: row.fv,
        sv: row.sv,
        s: row.s,
        d: row.d,
        a: row.a,
        w: row.w,
        c: row.c,
        i: row.i,

        ...(row.hm ? { hm: row.hm } : {}),
        ...(row.hw ? { hw: row.hw } : {}),
        ...(row.hf ? { hf: row.hf } : {}),
        ...(row.range ? { range: row.range } : {}),
    };
}

function mapProfileRule(row: ProfileRuleRow): ProfileRule {
    return {
        rule: row.rule,
        ...(row.type ? { type: row.type } : {}),
        ...(row.option_dependency
            ? { optionDependency: row.option_dependency }
            : {}),
    };
}

function mapMagicPower(row: MagicPowerRow): MagicPower {
    return {
        power: row.power,
        range: row.range,
        cast: row.cast,
        target: row.target,
    };
}

function splitList(value: string): string[] {
    if (!value.trim()) {
        return [];
    }

    return value
        .split(";")
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function groupByProfile<T extends { profile: string }>(
    rows: T[],
): Map<string, T[]> {
    const result = new Map<string, T[]>();

    for (const row of rows) {
        const existing = result.get(row.profile);

        if (existing) {
            existing.push(row);
        } else {
            result.set(row.profile, [row]);
        }
    }

    return result;
}

function byOrder(
    a: { order: number },
    b: { order: number },
): number {
    return a.order - b.order;
}

function ensureUnique(
    values: string[],
    description: string,
): void {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const value of values) {
        if (seen.has(value)) {
            duplicates.add(value);
        }

        seen.add(value);
    }

    if (duplicates.size > 0) {
        throw new Error(
            `Duplicate ${description}(s): ${[...duplicates].join(", ")}`,
        );
    }
}

// -----------------------------------------------------------------------------
// Translations
// -----------------------------------------------------------------------------

function createTranslationMap(
    rows: TranslationRow[],
    locale: SupportedLocale,
): TranslationMap {
    return Object.fromEntries(
        rows.flatMap((row) => {
            const translation = row[locale]?.trim();

            if (!translation) {
                return [];
            }

            return [[row.key, translation]];
        }),
    );
}

function readTranslations(): Record<
    SupportedLocale,
    TranslationMap
> {
    const workbook = readFile(translationsWorkbookPath);
    const rows = readSheet(workbook, "Translations");

    const parsedRows = rows.map((row, index) => {
        const result = translationRowSchema.safeParse(row);

        if (!result.success) {
            throw new Error(
                [
                    `Invalid translation at Excel row ${index + 2}:`,
                    z.prettifyError(result.error),
                ].join("\n"),
            );
        }

        return result.data;
    });

    ensureUnique(
        parsedRows.map((row) => row.key),
        "translation key",
    );

    return Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
            locale,
            createTranslationMap(parsedRows, locale),
        ]),
    ) as Record<SupportedLocale, TranslationMap>;
}

function getRequiredTranslationKeys(
    profiles: Profile[],
): Set<string> {
    const keys = new Set<string>();

    for (const profile of profiles) {
        keys.add(`profile.${profile.profile}.name`);
        keys.add(`origin.${profile.origin}`);


        for (const rule of profile.specialRules) {
            keys.add(`special-rule.${rule}.name`);
        }

        for (const wargear of profile.wargear) {
            keys.add(`wargear.${wargear}.name`);
        }

        for (const rule of profile.profileRules) {
            keys.add(
                `profile.${profile.profile}.rule.${rule.rule}.name`,
            );
            keys.add(
                `profile.${profile.profile}.rule.${rule.rule}.description`,
            );
        }

        for (const power of profile.magicPowers) {
            if (power.target) {
                keys.add(`magic-power.target.${power.target}`);
            }

            if (isTranslatedMagicRange(power.range)) {
                keys.add(`magic-power.range.${power.range}`);
            }
        }

        for (const text of profile.additionalText) {
            keys.add(
                `profile.${profile.profile}.text.${text}`,
            );
        }
    }

    return keys;
}

function isTranslatedMagicRange(range: string): boolean {
    return /^[a-z][a-z0-9-]*$/.test(range);
}

function validateTranslationCoverage(
    profiles: Profile[],
    translations: Record<SupportedLocale, TranslationMap>,
): void {
    const requiredKeys = getRequiredTranslationKeys(profiles);
    const english = translations.en;

    for (const key of requiredKeys) {
        if (!english[key]) {
            throw new Error(
                `Missing required English translation: '${key}'`,
            );
        }
    }

    for (const locale of SUPPORTED_LOCALES) {
        if (locale === "en") {
            continue;
        }

        const missing = [...requiredKeys].filter(
            (key) => !translations[locale][key],
        );

        if (missing.length > 0) {
            console.warn(
                `Missing ${missing.length} ${locale} profile translations.`,
            );
        }
    }
}

function filterTranslations(
    profiles: Profile[],
    translations: TranslationMap,
): TranslationMap {
    const required = getRequiredTranslationKeys(profiles);

    return Object.fromEntries(
        Object.entries(translations).filter(([key]) =>
            required.has(key),
        ),
    );
}

function nestTranslations(
    translations: TranslationMap,
): NestedTranslations {
    const output: NestedTranslations = {};

    for (const [key, value] of Object.entries(translations)) {
        const segments = key.split(".");

        let current: Record<string, unknown> = output;

        for (
            let index = 0;
            index < segments.length;
            index++
        ) {
            const segment = segments[index];
            const isLast = index === segments.length - 1;

            if (isLast) {
                current[segment] = value;
                continue;
            }

            const existing = current[segment];

            if (
                existing !== undefined &&
                (typeof existing !== "object" ||
                    existing === null ||
                    Array.isArray(existing))
            ) {
                throw new Error(
                    `Translation key collision at '${key}'`,
                );
            }

            if (!existing) {
                current[segment] = {};
            }

            current = current[segment] as Record<
                string,
                unknown
            >;
        }
    }

    return output;
}

// -----------------------------------------------------------------------------
// Generation
// -----------------------------------------------------------------------------

async function generateProfiles(): Promise<void> {
    console.log("Generating profiles...");

    const workbook = readProfilesWorkbook();
    const profiles = buildProfiles(workbook);

    const translations = readTranslations();

    validateTranslationCoverage(
        profiles,
        translations,
    );

    await mkdir(generatedProfilesDirectory, {
        recursive: true,
    });

    await writeJson(
        `${generatedProfilesDirectory}/profiles.json`,
        profiles,
    );

    for (const locale of SUPPORTED_LOCALES) {
        const localeDirectory =
            `${generatedTranslationsDirectory}/${locale}`;

        const usedTranslations = filterTranslations(
            profiles,
            translations[locale],
        );

        await mkdir(localeDirectory, {
            recursive: true,
        });

        await writeJson(
            `${localeDirectory}/profiles.json`,
            nestTranslations(usedTranslations),
        );
    }

    console.log(
        `Generated ${profiles.length} profiles.`,
    );
}

generateProfiles().catch((error: unknown) => {
    console.error(error);

    // @ts-expect-error
    process.exitCode = 1;
});