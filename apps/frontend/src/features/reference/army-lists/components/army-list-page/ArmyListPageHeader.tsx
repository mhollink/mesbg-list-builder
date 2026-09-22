import { useLocation, useNavigate } from "react-router";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LocalizedArmyList } from "../../army-lists.types.ts";
import { useRosterCreation } from "~/features/armies/rosters/management/RosterCreationProvider.tsx";

interface ArmyListPageHeaderProps {
  armyList: LocalizedArmyList;
}

export function ArmyListPageHeader({ armyList }: ArmyListPageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCreateRoster } = useRosterCreation();

  const backTo =
    (location.state as { backTo?: string } | null)?.backTo ??
    "/reference/armylists";

  return (
    <Stack sx={{ gap: 3 }}>
      <Button
        variant="text"
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(backTo)}
        sx={{
          alignSelf: "flex-start",
          px: 0,
        }}
      >
        Army lists
      </Button>

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "flex-end",
          },
          gap: 3,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            color="textSecondary"
            sx={{
              display: "block",
              mb: 0.5,
              fontWeight: 700,
            }}
          >
            {armyList.sourceName} · page {armyList.source.page}
          </Typography>

          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {armyList.name}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => openCreateRoster({ armyListId: armyList.id })}
          sx={{
            flexShrink: 0,
          }}
        >
          Create a roster
        </Button>
      </Stack>
    </Stack>
  );
}
