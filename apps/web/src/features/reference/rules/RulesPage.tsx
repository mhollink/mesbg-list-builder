import Box from "@mui/material/Box";

import { RulesHeader } from "./components/RulesHeader";
import { RulesList } from "./components/RulesList";
import { RulesResultCount } from "./components/RulesResultCount";
import { RulesToolbar } from "./components/RulesToolbar";
import { useRulesPage } from "./hooks/useRulesPage";
import { RuleDrawer } from "~/features/reference/rules/components/RuleDrawer.tsx";

export function RulesPage() {
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
      <RulesHeader />

      <RulesToolbar
        activeType={activeType}
        activeLetter={activeLetter}
        search={search}
        availableLetters={availableLetters}
        onTypeChange={selectType}
        onLetterChange={selectLetter}
        onSearchChange={changeSearch}
      />

      <RulesResultCount count={resultCount} />

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

      <RuleDrawer />
    </Box>
  );
}
