import { Link as RouterLink } from "react-router";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BuilderRoster } from "../../domain/roster.types.ts";

interface RosterBuilderHeaderProps {
  roster: BuilderRoster;
}

export function RosterBuilderHeader({ roster }: RosterBuilderHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Breadcrumbs aria-label="Roster navigation">
        <Link
          component={RouterLink}
          to="/armies/rosters"
          underline="hover"
          color="inherit"
        >
          My Rosters
        </Link>

        <Typography color="text.primary">{roster.name}</Typography>
      </Breadcrumbs>

      <Button
        variant="outlined"
        startIcon={<SportsEsportsOutlinedIcon />}
        disabled
      >
        Start game
      </Button>
    </Stack>
  );
}
