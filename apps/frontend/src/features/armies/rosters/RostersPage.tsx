import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { RosterSummary } from "@mlb/api-client";

import { useGetRostersQuery } from "./api/roster-api.ts";
import { CreateRosterDialog } from "./components/CreateRosterDialog.tsx";
import { DeleteRosterDialog } from "./components/DeleteRosterDialog.tsx";
import { RosterCard } from "./components/RosterCard.tsx";
import { formatArmyListId } from "~/features/reference/army-lists/army-lists.utils.ts";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";

export function RostersPage() {
  const { data: rosters = [], isLoading, isError } = useGetRostersQuery();

  const { armyLists } = useGameArmyLists();

  const [createOpen, setCreateOpen] = useState(false);
  const [rosterToDelete, setRosterToDelete] = useState<RosterSummary | null>(
    null,
  );

  const armyListNames = useMemo(
    () => new Map(armyLists.map((armyList) => [armyList.id, armyList.name])),
    [armyLists],
  );

  const tagSuggestions = useMemo(() => {
    const tags = new Map<string, string>();

    for (const roster of rosters) {
      for (const tag of roster.tags) {
        const key = tag.toLocaleLowerCase();

        if (!tags.has(key)) {
          tags.set(key, tag);
        }
      }
    }

    return [...tags.values()].sort((a, b) => a.localeCompare(b));
  }, [rosters]);

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">My Rosters</Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Create and manage your MESBG army rosters.
          </Typography>
        </Box>

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error">Your rosters could not be loaded.</Alert>
        )}

        {!isLoading && !isError && rosters.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              borderStyle: "dashed",
            }}
          >
            <Typography variant="h6">No rosters yet</Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Create your first roster to start building an army.
            </Typography>
          </Paper>
        )}

        {rosters.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 280px), 300px))",
              gap: 3,
            }}
          >
            {rosters.map((roster) => (
              <RosterCard
                key={roster.id}
                roster={roster}
                armyListName={
                  armyListNames.get(roster.armyListId) ??
                  formatArmyListId(roster.armyListId)
                }
                onDelete={setRosterToDelete}
              />
            ))}
          </Box>
        )}
      </Stack>

      <Fab
        color="primary"
        aria-label="Create roster"
        onClick={() => setCreateOpen(true)}
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
        }}
      >
        <AddIcon />
      </Fab>

      <CreateRosterDialog
        open={createOpen}
        tagSuggestions={tagSuggestions}
        onClose={() => setCreateOpen(false)}
      />

      <DeleteRosterDialog
        roster={rosterToDelete}
        onClose={() => setRosterToDelete(null)}
      />
    </Box>
  );
}
