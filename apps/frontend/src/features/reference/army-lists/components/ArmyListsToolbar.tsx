import { useTranslation } from "react-i18next";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";

import { ALPHABET } from "../army-lists.constants.ts";
import type { ArmyListAlignment } from "../army-lists.types.ts";

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

      <Box
        sx={{
          px: {
            xs: 2,
            md: 3,
          },
          pt: 2,
        }}
      >
        <TextField
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("search.placeholder")}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Tabs
        value={activeLetter}
        onChange={(_, value: string) => onLetterChange(value)}
        variant="scrollable"
        scrollButtons={false}
        aria-label={t("alphabet.label")}
        sx={{
          px: {
            xs: 1,
            md: 2,
          },
          mt: 1,

          "& .MuiTab-root": {
            minWidth: 40,
            px: 1,
          },
        }}
      >
        {ALPHABET.map((letter) => (
          <Tab
            key={letter}
            value={letter}
            label={letter}
            disabled={!availableLetters.has(letter)}
          />
        ))}
      </Tabs>
    </Box>
  );
}
