type TranslationResource = Record<string, unknown>;

const appResources = import.meta.glob<TranslationResource>(
  "./locales/*/*.json",
  {
    import: "default",
  },
);

const generatedResources = import.meta.glob<TranslationResource>(
  "~/generated/i18n/*/*.json",
  {
    import: "default",
  },
);

export async function loadTranslationResource(
  language: string,
  namespace: string,
): Promise<TranslationResource> {
  const resources = namespace.startsWith("game-")
    ? generatedResources
    : appResources;

  const expectedSuffix = `/i18n/${language}/${namespace}.json`;

  const entry = Object.entries(resources).find(
    ([path]) =>
      path.endsWith(expectedSuffix) ||
      path.endsWith(`/locales/${language}/${namespace}.json`),
  );

  if (!entry) {
    throw new Error(
      `Could not find translation resource '${language}/${namespace}'`,
    );
  }

  const [, loader] = entry;

  return loader();
}
