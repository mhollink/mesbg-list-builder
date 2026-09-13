import Box from "@mui/material/Box";

import { ArmyListsHeader } from "./components/ArmyListsHeader.tsx";
import { ArmyListsResultCount } from "./components/ArmyListsResultCount.tsx";
import { ArmyListsToolbar } from "./components/ArmyListsToolbar.tsx";
import { ArmyListList } from "./components/army-list-list/ArmyListList.tsx";
import { useArmyListsPage } from "./hooks/useArmyListsPage.ts";

export function ArmyListsPage() {
  const {
    activeAlignment,
    activeLetter,
    search,
    availableLetters,
    rows,
    resultCount,
    selectAlignment,
    selectLetter,
    changeSearch,
    registerLetter,
    handleArmyListClick,
  } = useArmyListsPage();

  return (
    <Box>
      <ArmyListsHeader />

      <ArmyListsToolbar
        activeAlignment={activeAlignment}
        activeLetter={activeLetter}
        search={search}
        availableLetters={availableLetters}
        onAlignmentChange={selectAlignment}
        onLetterChange={selectLetter}
        onSearchChange={changeSearch}
      />

      <ArmyListsResultCount count={resultCount} />

      <ArmyListList
        rows={rows}
        registerLetter={registerLetter}
        onOpenArmyList={handleArmyListClick}
      />
    </Box>
  );
}
