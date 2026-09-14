import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { RULE_TYPES } from "../rules.constants";
import type { RuleType } from "../rules.types";
import { AlphabetTabs } from "~/features/reference/shared/components/AlphabetTabs.tsx";
import { ReferenceSearchField } from "~/features/reference/shared/components/ReferenceSearchField.tsx";

interface RulesToolbarProps {
  activeType: RuleType;
  activeLetter: string | false;
  search: string;
  availableLetters: ReadonlySet<string>;
  onTypeChange: (type: RuleType) => void;
  onLetterChange: (letter: string) => void;
  onSearchChange: (search: string) => void;
}

export function RulesToolbar({
  activeType,
  activeLetter,
  search,
  availableLetters,
  onTypeChange,
  onLetterChange,
  onSearchChange,
}: RulesToolbarProps) {
  const { t } = useTranslation("rules");
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: "background.default",
        pt: 2,
      }}
    >
      <Tabs
        value={activeType}
        onChange={(_, value: RuleType) => onTypeChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Rule type"
        sx={{
          px: {
            xs: 1,
            md: 2,
          },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {RULE_TYPES.map((type) => (
          <Tab key={type.value} value={type.value} label={type.label} />
        ))}
      </Tabs>

      <ReferenceSearchField
        search={search}
        onSearchChange={onSearchChange}
        placeholder={t("search.placeholder")}
      />

      <AlphabetTabs
        activeLetter={activeLetter}
        onLetterChange={onLetterChange}
        availableLetters={availableLetters}
        ariaLabel="Rule index"
      />
    </Box>
  );
}
