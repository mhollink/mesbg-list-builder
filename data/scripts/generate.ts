// @ts-ignore
import { mkdir } from "node:fs/promises";
// @ts-ignore
import { fileURLToPath } from "node:url";

import { generateProfiles } from "./generators/profiles";
import { generateRules } from "./generators/rules";
import { generateTranslations } from "./generators/translations";
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
  const translations = generateTranslations(
    loadTranslations(`${rawDirectory}/translations.xlsx`),
  );

  await mkdir(`${generatedDirectory}/game-data`, { recursive: true });
  await writeJson(`${generatedDirectory}/game-data/rules.json`, rules);
  await writeJson(`${generatedDirectory}/game-data/profiles.json`, profiles);

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
}

generate().catch((error: unknown) => {
  console.error(error);
  // @ts-ignore
  process.exitCode = 1;
});
