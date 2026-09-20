import Breadcrumbs from "@mui/material/Breadcrumbs";

import type { RosterGroup } from "@mlb/api-client";

import { DroppableGroupBreadcrumb } from "./DroppableGroupBreadcrumb.tsx";
import { RootBreadcrumb } from "~/features/armies/rosters/management/components/breadcrumbs/RootBreadcrumb.tsx";

interface RosterBreadcrumbsProps {
  path: RosterGroup[];
}

export function RosterBreadcrumbs({ path }: RosterBreadcrumbsProps) {
  return (
    <Breadcrumbs aria-label="Roster group navigation">
      <RootBreadcrumb />

      {path.map((group, index) => (
        <DroppableGroupBreadcrumb
          key={group.id}
          group={group}
          last={index === path.length - 1}
        />
      ))}
    </Breadcrumbs>
  );
}
