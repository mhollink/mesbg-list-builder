import Box from "@mui/material/Box";

import { RulesHeader } from "./components/RulesHeader";
import { RulesList } from "./components/RulesList";
import { RulesResultCount } from "./components/RulesResultCount";
import { RulesToolbar } from "./components/RulesToolbar";
import { useRulesPage } from "./hooks/useRulesPage";
import type { Rule } from "./rules.types";

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
  } = useRulesPage();

  function openRule(rule: Rule) {
    // Reference drawer navigator will go here.
    console.log(rule);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100%",
      }}
    >
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
          onOpenRule={openRule}
          registerLetter={registerLetter}
        />
      </Box>
    </Box>
  );
}
