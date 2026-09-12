// @ts-expect-error
import { mkdir } from "node:fs/promises";
// @ts-expect-error
import { fileURLToPath } from "node:url";

import { generateArmyList } from "./generators/army-lists";
import { generateProfiles } from "./generators/profiles";
import { generateRules } from "./generators/rules";
import { generateTranslations } from "./generators/translations";
import { loadArmyLists } from "./loader/loadArmyLists";
import { loadOptions } from "./loader/loadOptions";
import { loadProfiles } from "./loader/loadProfiles";
import { loadTranslations } from "./loader/loadTranslations";
import { writeJson } from "./output/write-json";
import { SUPPORTED_LOCALES } from "./types/locales";

const rawDirectory = fileURLToPath(new URL("../raw", import.meta.url));
const generatedDirectory = fileURLToPath(
  new URL("../generated", import.meta.url),
);

async function generate(): Promise<void> {
  console.log("Generating game data...");

  const rules = generateRules(`${rawDirectory}/rules.xlsx`);
  const profiles = generateProfiles(
    loadProfiles(`${rawDirectory}/profiles.xlsx`),
    loadOptions(`${rawDirectory}/options.xlsx`),
  );
  const armyLists = generateArmyList(
    loadArmyLists(`${rawDirectory}/army-lists.xlsx`),
  );
  const translations = generateTranslations(
    loadTranslations(`${rawDirectory}/translations.xlsx`),
  );

  await mkdir(`${generatedDirectory}/game-data`, { recursive: true });
  await writeJson(`${generatedDirectory}/game-data/rules.json`, rules);
  await writeJson(`${generatedDirectory}/game-data/profiles.json`, profiles);
  await writeJson(`${generatedDirectory}/game-data/army-lists.json`, armyLists);

  for (const locale of SUPPORTED_LOCALES) {
    const localeDirectory = `${generatedDirectory}/i18n/${locale}`;

    await mkdir(localeDirectory, { recursive: true });
    await writeJson(
      `${localeDirectory}/game-data.json`,
      translations.get(locale),
    );
  }

  console.log(`Generated ${rules.length} rules.`);
  console.log(`Generated ${profiles.length} profiles.`);
  console.log(`Generated ${armyLists.length} army lists.`);
}

generate().catch((error: unknown) => {
  console.error(error);
  // @ts-expect-error
  process.exitCode = 1;
});
