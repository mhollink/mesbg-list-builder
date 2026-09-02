import Box from "@mui/material/Box";

import { ProfilesHeader } from "./components/ProfilesHeader";
import { ProfilesResultCount } from "./components/ProfilesResultCount";
import { ProfilesToolbar } from "./components/ProfilesToolbar";
import { ProfileList } from "./components/profile-list/ProfileList";
import { useProfilesPage } from "./hooks/useProfilesPage";
import { ProfileDrawer } from "~/features/reference/profiles/components/profile-drawer/ProfileDrawer.tsx";
import { RuleDrawer } from "~/features/reference/rules/components/rule-drawer/RuleDrawer.tsx";

export function ProfilesPage() {
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
      <ProfilesHeader />

      <ProfilesToolbar
        activeAlignment={activeAlignment}
        activeLetter={activeLetter}
        search={search}
        availableLetters={availableLetters}
        onAlignmentChange={selectAlignment}
        onLetterChange={selectLetter}
        onSearchChange={changeSearch}
      />

      <ProfilesResultCount count={resultCount} />

      <ProfileList
        rows={rows}
        registerLetter={registerLetter}
        onOpenProfile={handleProfileClick}
      />

      <ProfileDrawer />
      <RuleDrawer />
    </Box>
  );
}
