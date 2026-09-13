import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import type { ArmyListMatch } from "../army-list-finder.types.ts";
import { ArmyListFinderResultItem } from "./ArmyListFinderResultItem.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

interface ArmyListFinderResultsProps {
  matches: ArmyListMatch[];
  selectedProfiles: LocalizedProfile[];
  onOpenArmyList: (armyListId: string) => void;
}

export function ArmyListFinderResults({
  matches,
  selectedProfiles,
  onOpenArmyList,
}: ArmyListFinderResultsProps) {
  const { t } = useTranslation("army-list-finder");

  return (
    <Box>
      <Typography component="h2" variant="h6" sx={{ mb: 1.5 }}>
        {t("results.title")}
      </Typography>

      {selectedProfiles.length === 0 ? (
        <Typography color="textSecondary">{t("results.empty")}</Typography>
      ) : matches.length === 0 ? (
        <Typography color="textSecondary">{t("results.noResults")}</Typography>
      ) : (
        <List
          disablePadding
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
            "& > :last-child": {
              borderBottom: 0,
            },
          }}
        >
          {matches.map((match) => (
            <ArmyListFinderResultItem
              key={match.armyList.id}
              match={match}
              selectedProfiles={selectedProfiles}
              onOpenArmyList={onOpenArmyList}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
