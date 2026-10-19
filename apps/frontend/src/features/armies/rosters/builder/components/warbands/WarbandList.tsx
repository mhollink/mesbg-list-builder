import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/react";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import type {
  BuilderRoster,
  BuilderWarband,
} from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";
import { WarbandCard } from "./WarbandCard.tsx";
import { useRosterSorting } from "~/features/armies/rosters/builder/hooks/useRosterSorting.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

const sensors = [
  PointerSensor.configure({
    activatorElements(source) {
      return source.handle ? [source.handle] : [];
    },
  }),
  KeyboardSensor,
];

interface WarbandListProps {
  roster: BuilderRoster;
  gameData: BuilderGameData;
  canAddWarband: boolean;

  getWarbandCapacity(warband: BuilderWarband): WarbandCapacity;

  getAvailableLeaders(warband: BuilderWarband): LocalizedArmyListProfile[];

  getAvailableFollowers(warband: BuilderWarband): LocalizedArmyListProfile[];

  actions: RosterPersistence;
}

export function WarbandList({
  roster,
  gameData,
  canAddWarband,
  getAvailableFollowers,
  getAvailableLeaders,
  getWarbandCapacity,
  actions,
}: WarbandListProps) {
  const [adding, setAdding] = useState(false);
  const [addFailed, setAddFailed] = useState(false);
  const dnd = useRosterSorting(roster, actions);

  const knownWarbandIds = useRef(
    new Set(roster.warbands.map((warband) => warband.id)),
  );

  const [openLeaderForWarbandId, setOpenLeaderForWarbandId] = useState<
    BuilderWarband["id"] | null
  >(null);

  const [awaitingNewWarband, setAwaitingNewWarband] = useState(false);
  const [movingWarband, setMovingWarband] = useState(false);
  const [moveError, setMoveError] = useState(false);

  const canReorderWarbands =
    !roster.locked && !movingWarband && !dnd.isDragging && !dnd.isSaving;

  const handleAdd = async () => {
    setAdding(true);
    setAddFailed(false);
    setAwaitingNewWarband(true);

    try {
      await actions.createWarband();
    } catch {
      setAwaitingNewWarband(false);
      setAddFailed(true);
    } finally {
      setAdding(false);
    }
  };

  async function handleMoveWarband(
    warband: BuilderWarband,
    targetIndex: number,
  ) {
    if (
      movingWarband ||
      roster.locked ||
      targetIndex < 0 ||
      targetIndex >= roster.warbands.length
    ) {
      return;
    }

    setMovingWarband(true);
    setMoveError(false);

    try {
      await actions.moveWarband(warband.id, targetIndex);
    } catch {
      setMoveError(true);
    } finally {
      setMovingWarband(false);
    }
  }

  useEffect(() => {
    const currentIds = new Set(roster.warbands.map((warband) => warband.id));

    if (awaitingNewWarband) {
      const createdWarband = roster.warbands.find(
        (warband) => !knownWarbandIds.current.has(warband.id),
      );

      if (createdWarband) {
        setOpenLeaderForWarbandId(createdWarband.id);

        setAwaitingNewWarband(false);
      }
    }

    knownWarbandIds.current = currentIds;
  }, [roster.warbands, awaitingNewWarband]);

  if (roster.warbands.length === 0) {
    return (
      <Stack spacing={2}>
        {addFailed && (
          <Alert severity="error">The warband could not be created.</Alert>
        )}

        <Paper
          variant="outlined"
          sx={{
            p: 5,
            textAlign: "center",
            borderStyle: "dashed",
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <div>
              <Typography variant="h6">No warbands yet</Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Add a warband to start building this roster.
              </Typography>
            </div>

            {canAddWarband && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                disabled={adding}
                onClick={() => void handleAdd()}
              >
                Add warband
              </Button>
            )}
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {addFailed && (
        <Alert severity="error">The warband could not be created.</Alert>
      )}

      {moveError && (
        <Alert severity="error">The warband could not be moved.</Alert>
      )}

      {dnd.isError && (
        <Alert severity="error">The follower could not be moved.</Alert>
      )}

      <DragDropProvider
        sensors={sensors}
        onDragStart={dnd.handleDragStart}
        onDragOver={dnd.handleDragOver}
        onDragEnd={dnd.handleDragEnd}
      >
        {dnd.warbands.map((warband, index) => (
          <WarbandCard
            key={warband.id}
            index={index}
            warband={warband}
            gameData={gameData}
            generalId={roster.generalUnitId}
            capacity={getWarbandCapacity(warband)}
            availableLeaders={getAvailableLeaders(warband)}
            availableFollowers={getAvailableFollowers(warband)}
            readonly={roster.locked}
            sortingDisabled={dnd.isSaving || movingWarband}
            actions={actions}
            autoOpenLeaderPicker={openLeaderForWarbandId === warband.id}
            onLeaderPickerOpened={() => setOpenLeaderForWarbandId(null)}
            canMoveUp={canReorderWarbands && index > 0}
            canMoveDown={
              canReorderWarbands && index < roster.warbands.length - 1
            }
            onMoveUp={() => void handleMoveWarband(warband, index - 1)}
            onMoveDown={() => void handleMoveWarband(warband, index + 1)}
          />
        ))}
      </DragDropProvider>

      {canAddWarband && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          disabled={adding}
          onClick={() => void handleAdd()}
          sx={{
            alignSelf: "flex-start",
          }}
        >
          Add warband
        </Button>
      )}
    </Stack>
  );
}
