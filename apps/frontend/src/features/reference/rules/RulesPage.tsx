import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";

import { RulesToolbar } from "./components/RulesToolbar";
import { RulesList } from "./components/rule-list/RulesList.tsx";
import { useRulesPage } from "./hooks/useRulesPage";
import { ReferencePageHeader } from "~/features/reference/shared/components/ReferencePageHeader.tsx";
import { ReferenceResultCount } from "~/features/reference/shared/components/ReferenceResultCount.tsx";

export function RulesPage() {
  const { t } = useTranslation("rules");
  const {
    activeType,
    activeLetter,
    registerLetter,
    search,
    availableLetters,
    rows,
    resultCount,
    selectType,
    selectLetter,
    changeSearch,
    handleRuleClick,
  } = useRulesPage();

  return (
    <Box>
      <ReferencePageHeader title={t("title")} description={t("description")} />

      <RulesToolbar
        activeType={activeType}
        activeLetter={activeLetter}
        search={search}
        availableLetters={availableLetters}
        onTypeChange={selectType}
        onLetterChange={selectLetter}
        onSearchChange={changeSearch}
      />

      <ReferenceResultCount
        count={resultCount}
        resultLabel={t("search.result")}
        resultsLabel={t("search.results")}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
        }}
      >
        <RulesList
          rows={rows}
          onOpenRule={handleRuleClick}
          registerLetter={registerLetter}
        />
      </Box>
    </Box>
  );
}
