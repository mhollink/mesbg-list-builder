import { type MouseEvent, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ButtonGroup } from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
import type { UnitLoadout } from "../pickers/unit-configuration/unit-configuration.utils.ts";
import { WarbandCard } from "./WarbandCard.tsx";
import { DuplicateWarbandDrawer } from "~/features/armies/rosters/builder/components/pickers/DuplicateWarbandDrawer.tsx";
import { LeaderPicker } from "~/features/armies/rosters/builder/components/pickers/LeaderPicker.tsx";
import { useBuilderPickerHistory } from "~/features/armies/rosters/builder/hooks/useBuilderPickerHistory.ts";
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

type CreationMode = "single" | "continuous";

interface WarbandListProps {
  roster: BuilderRoster;
  gameData: BuilderGameData;
  canAddWarband: boolean;

  getWarbandCapacity(warband: BuilderWarband): WarbandCapacity;

  getAvailableLeaders(warband?: BuilderWarband): LocalizedArmyListProfile[];

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
  const dnd = useRosterSorting(roster, actions);
  const { picker, openPicker } = useBuilderPickerHistory();
  const creationMode = picker?.type === "warband-create" ? picker.mode : null;
  const duplicatingWarband =
    picker?.type === "warband-duplicate"
      ? roster.warbands.find((wb) => String(wb.id) === picker.warbandId)
      : null;
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [movingWarband, setMovingWarband] = useState(false);
  const [moveError, setMoveError] = useState(false);
  const [addFailed, setAddFailed] = useState(false);

  const canReorderWarbands =
    !roster.locked && !movingWarband && !dnd.isDragging && !dnd.isSaving;

  function openCreator(mode: CreationMode) {
    setMenuAnchor(null);
    openPicker({ type: "warband-create", mode });
  }

  async function handleCreateWarband(
    profile: LocalizedArmyListProfile,
    loadouts: UnitLoadout[],
  ) {
    const loadout = loadouts[0];
    if (loadouts.length !== 1 || !loadout || loadout.quantity !== 1) {
      setAddFailed(true);
      throw new Error("A warband requires exactly one leader.");
    }

    await actions.createWarband({
      armyListProfileId: profile.id,
      optionIds: loadout.optionIds,
    });
  }

  async function handleDuplicateWarband(
    profile: LocalizedArmyListProfile,
    loadouts: UnitLoadout[],
  ) {
    const loadout = loadouts[0];

    if (
      !duplicatingWarband ||
      loadouts.length !== 1 ||
      !loadout ||
      loadout.quantity !== 1
    ) {
      throw new Error("A warband requires exactly one leader.");
    }

    await actions.duplicateWarband(duplicatingWarband.id, {
      armyListProfileId: profile.id,
      optionIds: loadout.optionIds,
    });
  }

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

      {roster.warbands.length > 0 ? (
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
              canMoveUp={canReorderWarbands && index > 0}
              canMoveDown={
                canReorderWarbands && index < roster.warbands.length - 1
              }
              onMoveUp={() => void handleMoveWarband(warband, index - 1)}
              onMoveDown={() => void handleMoveWarband(warband, index + 1)}
            />
          ))}

          <AddWarbandButton
            menuOpened={Boolean(menuAnchor)}
            canAddWarband={canAddWarband}
            openCreator={openCreator}
          />
        </DragDropProvider>
      ) : (
        <NoWarbands
          menuOpened={Boolean(menuAnchor)}
          canAddWarband={canAddWarband}
          openCreator={openCreator}
        />
      )}

      <LeaderPicker
        open={creationMode !== null}
        continuous={creationMode === "continuous"}
        profiles={getAvailableLeaders()}
        onSave={handleCreateWarband}
      />

      <DuplicateWarbandDrawer
        open={duplicatingWarband !== null}
        sourceWarband={duplicatingWarband}
        gameData={gameData}
        profiles={getAvailableLeaders()}
        onSave={handleDuplicateWarband}
      />
    </Stack>
  );
}

function NoWarbands({
  canAddWarband,
  openCreator,
  menuOpened,
}: {
  menuOpened?: boolean;
  canAddWarband: boolean;
  openCreator: (mode: CreationMode) => void;
}) {
  return (
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
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Add a warband to start building this roster.
          </Typography>
        </div>
        <AddWarbandButton
          primary
          menuOpened={menuOpened}
          canAddWarband={canAddWarband}
          openCreator={openCreator}
        />
      </Stack>
    </Paper>
  );
}

function AddWarbandButton({
  primary,
  canAddWarband,
  openCreator,
  menuOpened,
}: {
  primary?: boolean;
  menuOpened?: boolean;
  canAddWarband: boolean;
  openCreator: (mode: CreationMode) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    canAddWarband && (
      <>
        <ButtonGroup variant={primary ? "contained" : "outlined"}>
          <Button startIcon={<AddIcon />} onClick={() => openCreator("single")}>
            Add warband
          </Button>
          <Button
            aria-expanded={menuOpened}
            aria-label="More warband creation options"
            aria-haspopup="menu"
            onClick={handleOpen}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => openCreator("continuous")}>
            Create multiple warbands
          </MenuItem>
        </Menu>
      </>
    )
  );
}
