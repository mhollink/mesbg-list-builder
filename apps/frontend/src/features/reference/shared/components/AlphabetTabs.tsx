import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { ALPHABET } from "~/features/reference/shared/reference.constants.ts";

export function AlphabetTabs({
  activeLetter,
  onLetterChange,
  availableLetters,
  ariaLabel,
}: {
  activeLetter: string | false;
  onLetterChange: (value: string) => void;
  availableLetters: ReadonlySet<string>;
  ariaLabel: string;
}) {
  return (
    <Tabs
      value={activeLetter}
      onChange={(_, value: string) => onLetterChange(value)}
      variant="scrollable"
      scrollButtons={false}
      aria-label={ariaLabel}
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
  );
}
