import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";

import { ArmyListFinderResults } from "./components/ArmyListFinderResults.tsx";
import { ProfileAutocomplete } from "./components/ProfileAutocomplete.tsx";
import { SelectedProfiles } from "./components/SelectedProfiles.tsx";
import { useArmyListFinder } from "./hooks/useArmyListFinder.ts";
import { ReferencePageHeader } from "~/features/reference/shared/components/ReferencePageHeader.tsx";

export function ArmyListFinderPage() {
  const { t } = useTranslation("army-list-finder");
  const {
    selectableProfiles,
    selectedProfiles,
    selectedProfileIds,
    matches,
    canAddProfiles,
    maximumProfiles,
    addProfile,
    removeProfile,
    clearProfiles,
    openArmyList,
  } = useArmyListFinder();

  return (
    <Stack spacing={4}>
      <ReferencePageHeader title={t("title")} description={t("description")} />

      <Stack spacing={2}>
        <ProfileAutocomplete
          profiles={selectableProfiles}
          selectedProfileIds={selectedProfileIds}
          disabled={!canAddProfiles}
          onSelect={addProfile}
        />

        <SelectedProfiles
          profiles={selectedProfiles}
          maximumProfiles={maximumProfiles}
          onRemove={removeProfile}
          onClear={clearProfiles}
        />
      </Stack>

      <ArmyListFinderResults
        matches={matches}
        selectedProfiles={selectedProfiles}
        onOpenArmyList={openArmyList}
      />
    </Stack>
  );
}
