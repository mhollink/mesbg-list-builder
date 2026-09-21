import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { DragDropProvider } from "@dnd-kit/react";

import { RosterBreadcrumbs } from "./components/breadcrumbs/RosterBreadcrumbs.tsx";
import { CreateRosterDialog } from "./components/dialogs/CreateRosterDialog";
import { CreateRosterGroupDialog } from "./components/dialogs/CreateRosterGroupDialog";
import { DeleteRosterDialog } from "./components/dialogs/DeleteRosterDialog";
import { DeleteRosterGroupDialog } from "./components/dialogs/DeleteRosterGroupDialog";
import { MoveRosterDialog } from "./components/dialogs/MoveRosterDialog";
import { RenameRosterGroupDialog } from "./components/dialogs/RenameRosterGroupDialog";
import { RostersSpeedDial } from "./components/RostersSpeedDial";
import { useRosterDialogs } from "./hooks/useRosterDialogs";
import { useRosterDragAndDrop } from "./hooks/useRosterDragAndDrop";
import { useRosterGroupNavigation } from "./hooks/useRosterGroupNavigation";
import { useRosterManagementData } from "./hooks/useRosterManagementData";
import { RosterGrid } from "~/features/armies/rosters/management/components/RosterGrid.tsx";

export function AuthenticatedRostersPage() {
  const data = useRosterManagementData();
  const navigation = useRosterGroupNavigation(data.groups, data.rosters);
  const dialogs = useRosterDialogs();
  const dnd = useRosterDragAndDrop();

  if (data.isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (navigation.invalidGroupId || navigation.groupNotFound) {
    return (
      <Container maxWidth={false} sx={{ py: 3 }}>
        <Alert severity="error">This roster group does not exist.</Alert>
      </Container>
    );
  }

  return (
    <DragDropProvider onDragEnd={dnd.handleDragEnd}>
      <Container maxWidth={false} sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {navigation.currentGroup?.name ?? "My Rosters"}
            </Typography>

            <RosterBreadcrumbs path={navigation.currentPath} />
          </Box>

          {data.isError && (
            <Alert severity="error">Could not load your rosters.</Alert>
          )}

          {dnd.isError && (
            <Alert severity="error">
              The roster or group could not be moved.
            </Alert>
          )}

          <RosterGrid
            groups={navigation.currentGroups}
            rosters={navigation.currentRosters}
            getRosterCount={navigation.getDirectRosterCount}
            onRenameGroup={dialogs.renameGroup.open}
            onDeleteGroup={dialogs.deleteGroup.open}
            onMoveRoster={dialogs.moveRoster.open}
            onDeleteRoster={dialogs.deleteRoster.open}
          />
        </Stack>

        <RostersSpeedDial
          onCreateRoster={dialogs.createRoster.show}
          onCreateGroup={dialogs.createGroup.show}
        />

        <CreateRosterDialog
          open={dialogs.createRoster.open}
          groupId={navigation.currentGroupId}
          tagSuggestions={data.tagSuggestions}
          onClose={dialogs.createRoster.close}
        />

        <CreateRosterGroupDialog
          open={dialogs.createGroup.open}
          parentGroupId={navigation.currentGroupId}
          onClose={dialogs.createGroup.close}
        />

        <DeleteRosterDialog
          roster={dialogs.deleteRoster.roster}
          onClose={dialogs.deleteRoster.close}
        />

        <MoveRosterDialog
          roster={dialogs.moveRoster.roster}
          groups={data.groups}
          onClose={dialogs.moveRoster.close}
        />

        <RenameRosterGroupDialog
          group={dialogs.renameGroup.group}
          onClose={dialogs.renameGroup.close}
        />

        <DeleteRosterGroupDialog
          group={dialogs.deleteGroup.group}
          onClose={dialogs.deleteGroup.close}
        />
      </Container>
    </DragDropProvider>
  );
}
