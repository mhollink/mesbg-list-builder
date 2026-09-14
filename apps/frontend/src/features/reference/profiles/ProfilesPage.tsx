import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";

import { ProfilesToolbar } from "./components/ProfilesToolbar";
import { ProfileList } from "./components/profile-list/ProfileList";
import { useProfilesPage } from "./hooks/useProfilesPage";
import { ReferencePageHeader } from "~/features/reference/shared/components/ReferencePageHeader.tsx";
import { ReferenceResultCount } from "~/features/reference/shared/components/ReferenceResultCount.tsx";

export function ProfilesPage() {
  const { t } = useTranslation("profiles");
  const {
    activeAlignment,
    activeLetter,
    registerLetter,
    search,
    availableLetters,
    rows,
    resultCount,
    selectAlignment,
    selectLetter,
    changeSearch,
    handleProfileClick,
  } = useProfilesPage();

  return (
    <Box>
      <ReferencePageHeader title={t("title")} description={t("description")} />

      <ProfilesToolbar
        activeAlignment={activeAlignment}
        activeLetter={activeLetter}
        search={search}
        availableLetters={availableLetters}
        onAlignmentChange={selectAlignment}
        onLetterChange={selectLetter}
        onSearchChange={changeSearch}
      />

      <ReferenceResultCount
        count={resultCount}
        resultLabel={t("search.result")}
        resultsLabel={t("search.results")}
      />

      <ProfileList
        rows={rows}
        registerLetter={registerLetter}
        onOpenProfile={handleProfileClick}
      />
    </Box>
  );
}
