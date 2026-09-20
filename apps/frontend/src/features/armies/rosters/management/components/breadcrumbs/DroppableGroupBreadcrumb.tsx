import { Link as RouterLink } from "react-router";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { useDroppable } from "@dnd-kit/react";
import type { RosterGroup } from "@mlb/api-client";

interface DroppableGroupBreadcrumbProps {
  group: RosterGroup;
  last?: boolean;
}

export function DroppableGroupBreadcrumb({
  group,
  last = false,
}: DroppableGroupBreadcrumbProps) {
  const { ref, isDropTarget } = useDroppable({
    id: `breadcrumb-group:${group.id}`,
    accept: ["roster", "group"],
    data: {
      type: "group",
      groupId: group.id,
    },
  });

  if (last) {
    return (
      <Typography
        ref={ref}
        color="textPrimary"
        sx={{
          px: 0.5,
          borderRadius: 1,
          bgcolor: isDropTarget ? "action.selected" : undefined,
        }}
      >
        {group.name}
      </Typography>
    );
  }

  return (
    <Link
      ref={ref}
      component={RouterLink}
      to={`/armies/rosters/groups/${group.id}`}
      underline="hover"
      color="inherit"
      sx={{
        px: 0.5,
        borderRadius: 1,
        bgcolor: isDropTarget ? "action.selected" : undefined,
      }}
    >
      {group.name}
    </Link>
  );
}
