import { useTranslation } from "react-i18next";

import {
  DebugSection,
  DebugValue,
} from "~/features/admin-data-checker/DebugSection.tsx";
import type { ProfileRule } from "~/features/reference/profiles/profiles.types.ts";

interface DebugProfileRulesProps {
  value?: ProfileRule[];
  profile: string;
}

export function DebugProfileRules({ value, profile }: DebugProfileRulesProps) {
  const { t } = useTranslation("game-data", { keyPrefix: "profiles" });

  if (!value) return null;

  const options = value.map((o) => ({
    name: t(`profiles.${profile}.rules.${o.id}.name`),
    type: o.type,
    description: t(`profiles.${profile}.rules.${o.id}.description`),
    ...(o.option ? { option: o.option } : {}),
  }));

  return (
    <DebugSection title="Profile rules">
      <DebugValue value={options} />
    </DebugSection>
  );
}
