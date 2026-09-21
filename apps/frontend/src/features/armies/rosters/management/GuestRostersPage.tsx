import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppDispatch, useAppSelector } from "~/app/store/hooks.ts";
import { GuestRosterCard } from "~/features/armies/rosters/guest/components/GuestRosterCard.tsx";
import { selectGuestRoster } from "~/features/armies/rosters/guest/guest-roster.selectors.ts";
import { clearGuestRoster } from "~/features/armies/rosters/guest/guest-roster.slice.ts";
import { CreateRosterDialog } from "~/features/armies/rosters/management/components/dialogs/CreateRosterDialog.tsx";
import { useRosterDialogs } from "~/features/armies/rosters/management/hooks/useRosterDialogs.ts";

export function GuestRostersPage() {
  const roster = useAppSelector(selectGuestRoster);
  const dispatch = useAppDispatch();
  const dialogs = useRosterDialogs();

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {"My Rosters"}
          </Typography>
        </Box>
      </Stack>

      {roster ? (
        <GuestRosterCard
          roster={roster}
          onDelete={() => dispatch(clearGuestRoster())}
        />
      ) : (
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
          <Typography color="textSecondary">
            Create a roster to get started.
          </Typography>
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add guest roster"
        onClick={dialogs.createRoster.show}
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
        }}
      >
        <AddIcon />
      </Fab>

      <CreateRosterDialog
        open={dialogs.createRoster.open}
        onClose={dialogs.createRoster.close}
        tagSuggestions={[]}
      />
    </Container>
  );
}
