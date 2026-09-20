import { Link as RouterLink } from "react-router";
import Link from "@mui/material/Link";

import { useDroppable } from "@dnd-kit/react";

export function RootBreadcrumb() {
  const { ref, isDropTarget } = useDroppable({
    id: "breadcrumb-root",
    accept: ["roster", "group"],
    data: {
      type: "root",
    },
  });

  return (
    <Link
      ref={ref}
      component={RouterLink}
      to="/armies/rosters"
      underline="hover"
      color="inherit"
      sx={{
        px: 0.5,
        borderRadius: 1,
        bgcolor: isDropTarget ? "action.selected" : undefined,
      }}
    >
      My Rosters
    </Link>
  );
}
