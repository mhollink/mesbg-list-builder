import { Link as RouterLink } from "react-router";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import type { RosterGroup } from "@mlb/api-client";

interface RosterBreadcrumbsProps {
  path: RosterGroup[];
}

export function RosterBreadcrumbs({ path }: RosterBreadcrumbsProps) {
  return (
    <Breadcrumbs aria-label="Roster group navigation">
      <Link
        component={RouterLink}
        to="/armies/rosters"
        underline="hover"
        color="inherit"
      >
        My Rosters
      </Link>

      {path.map((group, index) => {
        const last = index === path.length - 1;

        if (last) {
          return (
            <Typography key={group.id} color="text.primary">
              {group.name}
            </Typography>
          );
        }

        return (
          <Link
            key={group.id}
            component={RouterLink}
            to={`/armies/rosters/groups/${group.id}`}
            underline="hover"
            color="inherit"
          >
            {group.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
