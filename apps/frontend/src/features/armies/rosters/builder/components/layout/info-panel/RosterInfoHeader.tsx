import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { BuilderRoster } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { LocalizedArmyList } from "~/features/reference/army-lists/army-lists.types.ts";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";

interface RosterInfoHeaderProps {
  roster: BuilderRoster;
  armyList: LocalizedArmyList;
  onClose?: () => void;
}

export function RosterInfoHeader({
  roster,
  armyList,
  onClose,
}: RosterInfoHeaderProps) {
  return (
    <Box
      sx={{
        px: 3,
        py: 3,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{alignItems: "flex-start"}}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {roster.name}
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 0.75 }}
          >
            {armyList.name}
          </Typography>
        </Box>

        {onClose && (
          <IconButton
            onClick={onClose}
            aria-label="Close roster information"
            sx={{
              mt: -0.5,
              mr: -1,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}