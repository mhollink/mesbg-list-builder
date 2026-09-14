import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";

import { ArmyListsToolbar } from "./components/ArmyListsToolbar.tsx";
import { ArmyListList } from "./components/army-list-list/ArmyListList.tsx";
import { useArmyListsPage } from "./hooks/useArmyListsPage.ts";
import { ReferencePageHeader } from "~/features/reference/shared/components/ReferencePageHeader.tsx";
import { ReferenceResultCount } from "~/features/reference/shared/components/ReferenceResultCount.tsx";

export function ArmyListsPage() {
  const { t } = useTranslation("army-lists");

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
      <ReferencePageHeader title={t("title")} description={t("description")} />

      <ArmyListsToolbar
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

      <ArmyListList
        rows={rows}
        registerLetter={registerLetter}
        onOpenArmyList={handleArmyListClick}
      />
    </Box>
  );
}
