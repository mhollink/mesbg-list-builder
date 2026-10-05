import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BuilderRoster } from "../../domain/roster.types.ts";
import type { BuilderRosterStatistics } from "../../domain/roster-statistics.ts";
import {
  formatIssueCount,
  formatPoints,
} from "~/features/armies/rosters/builder/builder.utils.ts";

interface MobileRosterSummaryProps {
  roster: BuilderRoster;
  statistics: BuilderRosterStatistics;
  issueCount: number;
  onClick: () => void;
}

export function MobileRosterSummary({
  roster,
  statistics,
  issueCount,
  onClick,
}: MobileRosterSummaryProps) {
  return (
    <Box
      sx={{
        display: {
          xs: "block",
          lg: "none",
        },

        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,

        zIndex: (theme) => theme.zIndex.appBar,

        px: {
          xs: 2,
          sm: 3,
        },

        pt: 1,
        pb: "max(8px, env(safe-area-inset-bottom))",

        bgcolor: "background.default",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <ButtonBase
        onClick={onClick}
        sx={{
          width: "100%",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "left",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{
            width: "100%",
            px: 2,
            py: 1.25,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatPoints(roster, statistics)}
              {" · "}
              {statistics.modelCount} models
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {statistics.bowCount} bows
              {" · "}
              {statistics.throwingWeaponCount} throwing weapons
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center", flexShrink: 0 }}
          >
            {issueCount > 0 && (
              <ErrorOutlineRoundedIcon color="warning" fontSize="small" />
            )}

            <Typography
              variant="body2"
              color={issueCount > 0 ? "warning.main" : "text.secondary"}
              sx={{ fontWeight: 600 }}
            >
              {formatIssueCount(issueCount)}
            </Typography>
          </Stack>
        </Stack>
      </ButtonBase>
    </Box>
  );
}
