// @ts-ignore
import fs from "node:fs";
// @ts-ignore
import path from "node:path";

import * as XLSX from "xlsx";
import { z } from "zod";

import INPUT_FILE from "../../../../apps/mlb/mesbg-list-builder-v2024/src/assets/data/profile_data.json";
const OUTPUT_DIR = "./raw/profiles";

const PROFILES_FILE = path.join(OUTPUT_DIR, "profiles.xlsx");
const TRANSLATIONS_FILE = path.join(OUTPUT_DIR, "translations.xlsx");

// -----------------------------------------------------------------------------
// Input schema
// -----------------------------------------------------------------------------

const ProfileRuleSchema = z
    .object({
        name: z.string(),
        type: z.string(),
        description: z.string(),
        option_dependency: z.string().optional(),
    })
    .strict();

const MagicPowerSchema = z
    .object({
        name: z.string(),
        range: z.string(),
        cast: z.string(),
    })
    .strict();

const AdditionalProfileSchema = z
    .object({
        name: z.string(),

        Range: z.string().optional(),
        Mv: z.string(),
        Fv: z.string(),
        Sv: z.string(),
        S: z.string(),
        D: z.string(),
        A: z.string(),
        W: z.string(),
        C: z.string(),
        I: z.string(),

        active_or_passive_rules: z.array(ProfileRuleSchema).default([]),
        magic_powers: z.array(MagicPowerSchema).default([]),
        heroic_actions: z.array(z.string()).default([]),
        special_rules: z.array(z.string()).default([]),
        wargear: z.array(z.string()).default([]),
    })
    .strict();

const ProfileSchema = z
    .object({
        Range: z.string().optional(),
        Mv: z.string(),
        Fv: z.string(),
        Sv: z.string(),
        S: z.string(),
        D: z.string(),
        A: z.string(),
        W: z.string(),
        C: z.string(),
        I: z.string(),

        active_or_passive_rules: z.array(ProfileRuleSchema).default([]),
        magic_powers: z.array(MagicPowerSchema).default([]),
        heroic_actions: z.array(z.string()).default([]),
        special_rules: z.array(z.string()).default([]),
        wargear: z.array(z.string()).default([]),

        additional_stats: z.array(AdditionalProfileSchema).default([]),
        additional_text: z.array(z.string()).default([]),
        overflow_cards: z.array(z.string()).default([]),
    })
    .strict();

const ProfileDataSchema = z.record(
    z.string(),
    z.record(z.string(), ProfileSchema),
);

type SourceProfile = z.infer<typeof ProfileSchema>;
type SourceAdditionalProfile = z.infer<typeof AdditionalProfileSchema>;
type SourceProfileRule = z.infer<typeof ProfileRuleSchema>;
type SourceMagicPower = z.infer<typeof MagicPowerSchema>;

// -----------------------------------------------------------------------------
// Output models
// -----------------------------------------------------------------------------

interface ProfileRow {
    profile: string;
    origin: string;
    type: "primary" | "composite" | "subprofile";
    parent_profile: string;
    display_stat_row: boolean;
    selectable: boolean;
    heroic_actions: string;
    special_rules: string;
    wargear: string;
}

interface StatsRow {
    profile: string;
    mv: string;
    fv: string;
    sv: string;
    s: string;
    d: string;
    a: string;
    w: string;
    c: string;
    i: string;
    hm: string;
    hw: string;
    hf: string;
    range: string;
}

interface ProfileRuleRow {
    profile: string;
    rule: string;
    type: string;
    option_dependency: string;
    order: number;
}

interface MagicPowerRow {
    profile: string;
    power: string;
    range: string;
    cast: string;
    order: number;
}

interface AdditionalTextRow {
    profile: string;
    text: string;
    order: number;
}

interface ProfileRelationRow {
    profile: string;
    related_profile: string;
    type: string;
    order: number;
}

interface TranslationRow {
    key: string;
    en: string;
}

interface MigrationResult {
    profiles: ProfileRow[];
    stats: StatsRow[];
    profileRules: ProfileRuleRow[];
    magicPowers: MagicPowerRow[];
    additionalText: AdditionalTextRow[];
    profileRelations: ProfileRelationRow[];
    translations: TranslationRow[];
}

// -----------------------------------------------------------------------------
// Slugs
// -----------------------------------------------------------------------------

function slugify(value: string): string {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/&/g, " and ")
        .replace(/[’']/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function slugList(values: string[]): string {
    return values.map(slugify).join(";");
}

// -----------------------------------------------------------------------------
// Translation collection
// -----------------------------------------------------------------------------

class TranslationRegistry {
    private readonly translations = new Map<string, string>();

    add(key: string, english: string): void {
        const existing = this.translations.get(key);

        if (existing === undefined) {
            this.translations.set(key, english);
            return;
        }

        if (existing === english) {
            return;
        }

        // The current source has inconsistent capitalization in places,
        // e.g. "Hand weapon" vs "hand weapon".
        if (existing.toLowerCase() === english.toLowerCase()) {
            return;
        }

        throw new Error(
            `Translation collision for "${key}": "${existing}" vs "${english}"`,
        );
    }

    rows(): TranslationRow[] {
        return [...this.translations.entries()]
            .map(([key, en]) => ({ key, en }))
            .sort((a, b) => a.key.localeCompare(b.key));
    }
}

// -----------------------------------------------------------------------------
// Profile identity
// -----------------------------------------------------------------------------

interface ProfileCandidate {
    originName: string;
    name: string;
    parentName?: string;
}

function buildProfileIds(
    candidates: ProfileCandidate[],
): Map<ProfileCandidate, string> {
    const baseCounts = new Map<string, number>();

    for (const candidate of candidates) {
        const base = slugify(candidate.name);
        baseCounts.set(base, (baseCounts.get(base) ?? 0) + 1);
    }

    const result = new Map<ProfileCandidate, string>();
    const used = new Set<string>();

    for (const candidate of candidates) {
        const base = slugify(candidate.name);

        let id =
            baseCounts.get(base) === 1
                ? base
                : createScopedProfileId(candidate, base);

        if (used.has(id)) {
            id = [
                slugify(candidate.originName),
                candidate.parentName ? slugify(candidate.parentName) : undefined,
                base,
            ]
                .filter(Boolean)
                .join("-");
        }

        if (used.has(id)) {
            throw new Error(`Unable to generate unique profile id for "${candidate.name}"`);
        }

        used.add(id);
        result.set(candidate, id);
    }

    return result;
}

function createScopedProfileId(
    candidate: ProfileCandidate,
    base: string,
): string {
    if (candidate.parentName) {
        return `${slugify(candidate.parentName)}-${base}`;
    }

    return `${slugify(candidate.originName)}-${base}`;
}

// -----------------------------------------------------------------------------
// Migration
// -----------------------------------------------------------------------------

function migrate(
    source: z.infer<typeof ProfileDataSchema>,
): MigrationResult {
    const profiles: ProfileRow[] = [];
    const stats: StatsRow[] = [];
    const profileRules: ProfileRuleRow[] = [];
    const magicPowers: MagicPowerRow[] = [];
    const additionalText: AdditionalTextRow[] = [];
    const profileRelations: ProfileRelationRow[] = [];

    const translations = new TranslationRegistry();

    const candidates: ProfileCandidate[] = [];

    for (const [originName, sourceProfiles] of Object.entries(source)) {
        for (const [profileName, profile] of Object.entries(sourceProfiles)) {
            candidates.push({
                originName,
                name: profileName,
            });

            for (const child of profile.additional_stats) {
                candidates.push({
                    originName,
                    name: child.name,
                    parentName: profileName,
                });
            }
        }
    }

    const profileIds = buildProfileIds(candidates);

    let candidateIndex = 0;

    for (const [originName, sourceProfiles] of Object.entries(source)) {
        const origin = slugify(originName);

        translations.add(`origin.${origin}.name`, originName);

        for (const [profileName, profile] of Object.entries(sourceProfiles)) {
            const candidate = candidates[candidateIndex++];
            const profileId = requireProfileId(profileIds, candidate);

            migrateProfile({
                source: profile,
                profileId,
                profileName,
                origin,
                parentProfile: "",
                isSubprofile: false,
                profiles,
                stats,
                profileRules,
                magicPowers,
                additionalText,
                profileRelations,
                translations,
            });

            for (const child of profile.additional_stats) {
                const childCandidate = candidates[candidateIndex++];
                const childId = requireProfileId(profileIds, childCandidate);

                migrateProfile({
                    source: child,
                    profileId: childId,
                    profileName: child.name,
                    origin,
                    parentProfile: profileId,
                    isSubprofile: true,
                    profiles,
                    stats,
                    profileRules,
                    magicPowers,
                    additionalText,
                    profileRelations,
                    translations,
                });
            }

            profile.overflow_cards.forEach((relatedName, index) => {
                const parsed = parseOverflowRelation(relatedName);

                profileRelations.push({
                    profile: profileId,
                    related_profile: slugify(parsed.name),
                    type: parsed.type,
                    order: index + 1,
                });
            });
        }
    }

    return {
        profiles,
        stats,
        profileRules,
        magicPowers,
        additionalText,
        profileRelations,
        translations: translations.rows(),
    };
}

interface MigrateProfileOptions {
    source: SourceProfile | SourceAdditionalProfile;
    profileId: string;
    profileName: string;
    origin: string;
    parentProfile: string;
    isSubprofile: boolean;

    profiles: ProfileRow[];
    stats: StatsRow[];
    profileRules: ProfileRuleRow[];
    magicPowers: MagicPowerRow[];
    additionalText: AdditionalTextRow[];
    profileRelations: ProfileRelationRow[];
    translations: TranslationRegistry;
}

function migrateProfile({
                            source,
                            profileId,
                            profileName,
                            origin,
                            parentProfile,
                            isSubprofile,
                            profiles,
                            stats,
                            profileRules,
                            magicPowers,
                            additionalText,
                            translations,
                        }: MigrateProfileOptions): void {
    const isComposite =
        !isSubprofile &&
        "additional_stats" in source &&
        source.additional_stats.length > 0 &&
        hasEmptyStats(source);

    profiles.push({
        profile: profileId,
        origin,
        type: isSubprofile
            ? "subprofile"
            : isComposite
                ? "composite"
                : "primary",
        parent_profile: parentProfile,
        display_stat_row: !isComposite,
        selectable: !isSubprofile,
        heroic_actions: slugList(source.heroic_actions),
        special_rules: slugList(source.special_rules),
        wargear: slugList(source.wargear),
    });

    stats.push(createStatsRow(profileId, source));

    translations.add(`profile.${profileId}.name`, profileName);

    registerListTranslations(
        translations,
        "heroic-action",
        source.heroic_actions,
    );

    registerListTranslations(
        translations,
        "special-rule",
        source.special_rules,
    );

    registerListTranslations(
        translations,
        "wargear",
        source.wargear,
    );

    source.active_or_passive_rules.forEach((rule, index) => {
        migrateProfileRule(
            profileId,
            rule,
            index,
            profileRules,
            translations,
        );
    });

    source.magic_powers.forEach((power, index) => {
        migrateMagicPower(
            profileId,
            power,
            index,
            magicPowers,
            translations,
        );
    });

    if ("additional_text" in source) {
        source.additional_text.forEach((text, index) => {
            const textId = `text-${index + 1}`;

            additionalText.push({
                profile: profileId,
                text: textId,
                order: index + 1,
            });

            translations.add(
                `profile.${profileId}.text.${textId}`,
                text,
            );
        });
    }
}

function createStatsRow(
    profile: string,
    source: SourceProfile | SourceAdditionalProfile,
): StatsRow {
    return {
        profile,
        mv: source.Mv,
        fv: source.Fv,
        sv: source.Sv,
        s: source.S,
        d: source.D,
        a: source.A,
        w: source.W,
        c: source.C,
        i: source.I,

        // These do not exist in the current source file yet.
        hm: "",
        hw: "",
        hf: "",

        range: source.Range ?? "",
    };
}

function migrateProfileRule(
    profile: string,
    rule: SourceProfileRule,
    index: number,
    rows: ProfileRuleRow[],
    translations: TranslationRegistry,
): void {
    const ruleId = slugify(rule.name);

    rows.push({
        profile,
        rule: ruleId,
        type: slugify(rule.type),
        option_dependency: rule.option_dependency
            ? slugify(rule.option_dependency)
            : "",
        order: index + 1,
    });

    translations.add(
        `profile.${profile}.rule.${ruleId}.name`,
        rule.name,
    );

    translations.add(
        `profile.${profile}.rule.${ruleId}.description`,
        rule.description,
    );
}

function migrateMagicPower(
    profile: string,
    power: SourceMagicPower,
    index: number,
    rows: MagicPowerRow[],
    translations: TranslationRegistry,
): void {
    const powerId = slugify(power.name);

    rows.push({
        profile,
        power: powerId,
        range: normalizeMagicRange(power.range, translations),
        cast: power.cast,
        order: index + 1,
    });

    translations.add(
        `magic-power.${powerId}.name`,
        power.name,
    );
}

function normalizeMagicRange(
    range: string,
    translations: TranslationRegistry,
): string {
    if (/^\d/.test(range)) {
        return range;
    }

    const rangeId = slugify(range);

    translations.add(
        `magic-range.${rangeId}.name`,
        range,
    );

    return rangeId;
}

function registerListTranslations(
    translations: TranslationRegistry,
    namespace: string,
    values: string[],
): void {
    for (const value of values) {
        const id = slugify(value);

        translations.add(
            `${namespace}.${id}.name`,
            value,
        );
    }
}

// -----------------------------------------------------------------------------
// Composite detection
// -----------------------------------------------------------------------------

function hasEmptyStats(
    profile: SourceProfile,
): boolean {
    const statValues = [
        profile.Mv,
        profile.Fv,
        profile.Sv,
        profile.S,
        profile.D,
        profile.A,
        profile.W,
        profile.C,
        profile.I,
    ];

    return statValues.every((value) => value === "-");
}

// -----------------------------------------------------------------------------
// Relations
// -----------------------------------------------------------------------------

function parseOverflowRelation(value: string): {
    name: string;
    type: string;
} {
    const detailMatch = value.match(/^(.*?)\s*\[DETAIL]$/i);

    if (detailMatch) {
        return {
            name: detailMatch[1].trim(),
            type: "detail",
        };
    }

    return {
        name: value,
        type: "overflow",
    };
}

// -----------------------------------------------------------------------------
// Workbook creation
// -----------------------------------------------------------------------------

function createProfilesWorkbook(
    result: MigrationResult,
): XLSX.WorkBook {
    const workbook = XLSX.utils.book_new();

    appendSheet(workbook, "Profiles", result.profiles, [
        "profile",
        "origin",
        "type",
        "parent_profile",
        "display_stat_row",
        "selectable",
        "heroic_actions",
        "special_rules",
        "wargear",
    ]);

    appendSheet(workbook, "Stats", result.stats, [
        "profile",
        "mv",
        "fv",
        "sv",
        "s",
        "d",
        "a",
        "w",
        "c",
        "i",
        "hm",
        "hw",
        "hf",
        "range",
    ]);

    appendSheet(workbook, "ProfileRules", result.profileRules, [
        "profile",
        "rule",
        "type",
        "option_dependency",
        "order",
    ]);

    appendSheet(workbook, "MagicPowers", result.magicPowers, [
        "profile",
        "power",
        "range",
        "cast",
        "order",
    ]);

    appendSheet(workbook, "AdditionalText", result.additionalText, [
        "profile",
        "text",
        "order",
    ]);

    appendSheet(workbook, "ProfileRelations", result.profileRelations, [
        "profile",
        "related_profile",
        "type",
        "order",
    ]);

    return workbook;
}

function createTranslationsWorkbook(
    translations: TranslationRow[],
): XLSX.WorkBook {
    const workbook = XLSX.utils.book_new();

    appendSheet(workbook, "Translations", translations, [
        "key",
        "en",
    ]);

    return workbook;
}

function appendSheet<T extends object>(
    workbook: XLSX.WorkBook,
    name: string,
    rows: T[],
    headers: string[],
): void {
    const normalizedRows = rows.map((row) =>
        Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
                key,
                typeof value === "boolean"
                    ? value.toString()
                    : value,
            ]),
        ),
    );

    const worksheet = XLSX.utils.json_to_sheet(normalizedRows, {
        header: headers,
    });

    worksheet["!autofilter"] = {
        ref: worksheet["!ref"] ?? `A1:${columnName(headers.length)}1`,
    };

    worksheet["!cols"] = headers.map((header) => ({
        wch: getColumnWidth(header),
    }));

    XLSX.utils.book_append_sheet(workbook, worksheet, name);
}

function getColumnWidth(header: string): number {
    if (header === "en") {
        return 80;
    }

    if (
        header === "heroic_actions" ||
        header === "special_rules" ||
        header === "wargear"
    ) {
        return 45;
    }

    return 22;
}

function columnName(columnCount: number): string {
    return XLSX.utils.encode_col(columnCount - 1);
}

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

function requireProfileId(
    ids: Map<ProfileCandidate, string>,
    candidate: ProfileCandidate,
): string {
    const id = ids.get(candidate);

    if (!id) {
        throw new Error(
            `Missing generated profile id for "${candidate.name}"`,
        );
    }

    return id;
}

// -----------------------------------------------------------------------------
// Entrypoint
// -----------------------------------------------------------------------------

function main(): void {

    const source = ProfileDataSchema.parse(INPUT_FILE);
    const result = migrate(source);

    fs.mkdirSync(OUTPUT_DIR, {
        recursive: true,
    });

    XLSX.writeFile(
        createProfilesWorkbook(result),
        PROFILES_FILE,
    );

    XLSX.writeFile(
        createTranslationsWorkbook(result.translations),
        TRANSLATIONS_FILE,
    );

    console.log(`Created ${PROFILES_FILE}`);
    console.log(`Created ${TRANSLATIONS_FILE}`);

    console.log(`Profiles: ${result.profiles.length}`);
    console.log(`Stats: ${result.stats.length}`);
    console.log(`Profile rules: ${result.profileRules.length}`);
    console.log(`Magic powers: ${result.magicPowers.length}`);
    console.log(`Additional texts: ${result.additionalText.length}`);
    console.log(`Relations: ${result.profileRelations.length}`);
    console.log(`Translations: ${result.translations.length}`);
}

main();