import { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { DragDropProvider } from "@dnd-kit/react";

import { RosterBreadcrumbs } from "./components/breadcrumbs/RosterBreadcrumbs.tsx";
import { CreateRosterDialog } from "./components/dialogs/CreateRosterDialog";
import { CreateRosterGroupDialog } from "./components/dialogs/CreateRosterGroupDialog";
import { DeleteRosterDialog } from "./components/dialogs/DeleteRosterDialog";
import { DeleteRosterGroupDialog } from "./components/dialogs/DeleteRosterGroupDialog";
import { EditRosterDialog } from "./components/dialogs/EditRosterDialog.tsx";
import { MoveRosterDialog } from "./components/dialogs/MoveRosterDialog";
import { RenameRosterGroupDialog } from "./components/dialogs/RenameRosterGroupDialog";
import { RostersSpeedDial } from "./components/RostersSpeedDial";
import { useRosterDialogs } from "./hooks/useRosterDialogs";
import { useRosterDragAndDrop } from "./hooks/useRosterDragAndDrop";
import { useRosterGroupNavigation } from "./hooks/useRosterGroupNavigation";
import { useRosterManagementData } from "./hooks/useRosterManagementData";
import {
  filterAndSortRosters,
  filterRosterGroups,
  type RosterSort,
} from "./roster-list.utils.ts";
import { RosterGrid } from "~/features/armies/rosters/management/components/RosterGrid.tsx";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";

export function AuthenticatedRostersPage() {
  const data = useRosterManagementData();
  const navigation = useRosterGroupNavigation(data.groups, data.rosters);
  const dialogs = useRosterDialogs();
  const dnd = useRosterDragAndDrop();
  const { armyLists } = useGameArmyLists();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<RosterSort>("recent");
  const searching = search.trim().length > 0;
  useEffect(() => {
    setSearch("");
  }, [navigation.currentGroupId]);
  const armyListNames = useMemo(
    () =>
      armyLists.reduce(
        (names, armyList) => names.set(armyList.id, armyList.name),
        new Map<string, string>(),
      ),
    [armyLists],
  );
  const visibleGroups = useMemo(
    () =>
      searching
        ? filterRosterGroups(data.groups, search)
        : navigation.currentGroups,
    [searching, data.groups, search, navigation.currentGroups],
  );
  const visibleRosters = useMemo(
    () =>
      filterAndSortRosters(
        searching ? data.rosters : navigation.currentRosters,
        search,
        sort,
        armyListNames,
      ),
    [
      searching,
      data.rosters,
      navigation.currentRosters,
      search,
      sort,
      armyListNames,
    ],
  );

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

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Search rosters and groups"
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={{ flex: 1 }}
              slotProps={{
                input: {
                  endAdornment: searching ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="Clear roster search"
                        onClick={() => setSearch("")}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                },
              }}
            />
            <TextField
              select
              label="Sort rosters"
              size="small"
              value={sort}
              onChange={(event) => setSort(event.target.value as RosterSort)}
              sx={{ minWidth: { sm: 210 } }}
            >
              <MenuItem value="recent">Recently updated</MenuItem>
              <MenuItem value="name-asc">Name (A to Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z to A)</MenuItem>
              <MenuItem value="army-asc">Army list (A to Z)</MenuItem>
              <MenuItem value="army-desc">Army list (Z to A)</MenuItem>
              <MenuItem value="points-desc">Points (high to low)</MenuItem>
              <MenuItem value="points-asc">Points (low to high)</MenuItem>
              <MenuItem value="models-desc">Models (most first)</MenuItem>
              <MenuItem value="models-asc">Models (fewest first)</MenuItem>
            </TextField>
          </Stack>

          <RosterGrid
            groups={visibleGroups}
            rosters={visibleRosters}
            searching={searching}
            getRosterCount={navigation.getDirectRosterCount}
            onRenameGroup={dialogs.renameGroup.open}
            onDeleteGroup={dialogs.deleteGroup.open}
            onEditRoster={dialogs.editRoster.open}
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

        <EditRosterDialog
          roster={dialogs.editRoster.roster}
          tagSuggestions={data.tagSuggestions}
          onClose={dialogs.editRoster.close}
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
