import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import type { ProfileAlignment } from "~/features/reference/profiles/profiles.types.ts";
import { AlphabetTabs } from "~/features/reference/shared/components/AlphabetTabs.tsx";
import { ReferenceSearchField } from "~/features/reference/shared/components/ReferenceSearchField.tsx";

interface ProfilesToolbarProps {
  activeAlignment: ProfileAlignment;
  activeLetter: string | false;
  search: string;
  availableLetters: ReadonlySet<string>;
  onAlignmentChange: (alignment: ProfileAlignment) => void;
  onLetterChange: (letter: string) => void;
  onSearchChange: (search: string) => void;
}

export function ProfilesToolbar({
  activeAlignment,
  activeLetter,
  search,
  availableLetters,
  onAlignmentChange,
  onLetterChange,
  onSearchChange,
}: ProfilesToolbarProps) {
  const { t } = useTranslation("profiles");
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
        onChange={(_, value: ProfileAlignment) => onAlignmentChange(value)}
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
