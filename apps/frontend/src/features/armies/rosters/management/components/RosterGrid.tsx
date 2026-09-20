import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { RosterGroup, RosterSummary } from "@mlb/api-client";

import { RosterCard } from "./cards/RosterCard";
import { RosterGroupCard } from "./cards/RosterGroupCard";

interface RosterGridProps {
  groups: RosterGroup[];
  rosters: RosterSummary[];

  getRosterCount: (groupId: number) => number;

  onRenameGroup: (group: RosterGroup) => void;

  onDeleteGroup: (group: RosterGroup) => void;

  onMoveRoster: (roster: RosterSummary) => void;

  onDeleteRoster: (roster: RosterSummary) => void;
}

export function RosterGrid({
  groups,
  rosters,
  getRosterCount,
  onRenameGroup,
  onDeleteGroup,
  onMoveRoster,
  onDeleteRoster,
}: RosterGridProps) {
  if (groups.length === 0 && rosters.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          px: 3,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          This group is empty
        </Typography>

        <Typography color="text.secondary">
          Create a roster or another group to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(min(100%, 280px), 300px))",
        gap: 3,
      }}
    >
      {groups.map((group) => (
        <RosterGroupCard
          key={group.id}
          group={group}
          rosterCount={getRosterCount(group.id)}
          onRename={onRenameGroup}
          onDelete={onDeleteGroup}
        />
      ))}

      {rosters.map((roster) => (
        <RosterCard
          key={roster.id}
          roster={roster}
          onMove={onMoveRoster}
          onDelete={onDeleteRoster}
        />
      ))}
    </Box>
  );
}
