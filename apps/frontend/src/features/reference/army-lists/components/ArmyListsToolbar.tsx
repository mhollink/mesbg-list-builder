import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import type { ArmyListAlignment } from "../army-lists.types.ts";
import { AlphabetTabs } from "~/features/reference/shared/components/AlphabetTabs.tsx";
import { ReferenceSearchField } from "~/features/reference/shared/components/ReferenceSearchField.tsx";

interface ArmyListsToolbarProps {
  activeAlignment: ArmyListAlignment;
  activeLetter: string | false;
  search: string;
  availableLetters: ReadonlySet<string>;
  onAlignmentChange: (alignment: ArmyListAlignment) => void;
  onLetterChange: (letter: string) => void;
  onSearchChange: (search: string) => void;
}

export function ArmyListsToolbar({
  activeAlignment,
  activeLetter,
  search,
  availableLetters,
  onAlignmentChange,
  onLetterChange,
  onSearchChange,
}: ArmyListsToolbarProps) {
  const { t } = useTranslation("army-lists");

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
        value={activeAlignment}
        onChange={(_, value: ArmyListAlignment) => onAlignmentChange(value)}
        aria-label={t("alignment.label")}
      >
        <Tab value="good" label={t("alignment.good")} />
        <Tab value="evil" label={t("alignment.evil")} />
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
