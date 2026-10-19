import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import { Feedback } from "@dnd-kit/dom";
import { useSortable } from "@dnd-kit/react/sortable";

import { UnitActions } from "~/features/armies/rosters/builder/components/units/controls/UnitActions.tsx";
import { UnitQuantityControls } from "~/features/armies/rosters/builder/components/units/controls/UnitQuantityControls.tsx";
import { UnitCard } from "~/features/armies/rosters/builder/components/units/UnitCard.tsx";
import type { BuilderGameData } from "~/features/armies/rosters/builder/data/builder-game-data.types.ts";
import type {
  BuilderUnit,
  BuilderWarbandId,
} from "~/features/armies/rosters/builder/domain/roster.types.ts";
import {
  followerSortId,
  warbandSortId,
} from "~/features/armies/rosters/builder/hooks/roster-sort-layout.ts";
import { useDebouncedUnitUpdate } from "~/features/armies/rosters/builder/hooks/useDebouncedUnitUpdate.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface FollowerRowProps {
  warbandId: BuilderWarbandId;
  follower: BuilderUnit;
  index: number;
  gameData: BuilderGameData;
  readonly?: boolean;
  sortingDisabled?: boolean;
  onEdit: () => void;
  actions: RosterPersistence;
}

export function FollowerRow({
  warbandId,
  follower,
  index,
  gameData,
  readonly = false,
  sortingDisabled,
  onEdit,
  actions,
}: FollowerRowProps) {
  const { openProfileDrawer } = useDrawerStack();
  const {
    unit: draftFollower,
    update: updateFollower,
    cancel: cancelUpdate,
  } = useDebouncedUnitUpdate({
    unit: follower,
    warbandId,
    updateUnit: actions.updateUnit,
  });

  const { ref, handleRef, isDragging } = useSortable({
    id: followerSortId(follower.id),
    index,
    group: warbandSortId(warbandId),
    type: "follower",
    accept: "follower",
    disabled: readonly || sortingDisabled,
    plugins: [
      Feedback.configure({
        feedback: "clone",
      }),
    ],
    data: {
      kind: "follower",
      followerId: follower.id,
      warbandId,
    },
  });

  const profile = gameData.armyListProfilesById.get(follower.armyListProfileId);
  if (!profile) {
    throw new Error(
      `Could not find profile for follower unit: ${follower.armyListProfileId}`,
    );
  }

  function handleQuantityChange(quantity: number) {
    updateFollower({
      quantity,
    });
  }

  function handleDelete() {
    cancelUpdate();
    void actions.deleteUnit(warbandId, follower.id);
  }

  const unique = profile.profile.unitTypes.includes("unique");
  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <IconButton
        ref={handleRef}
        aria-label="Move unit"
        disabled={readonly || sortingDisabled}
        sx={{
          position: "absolute",
          right: 1,
          top: 1,
          zIndex: 1,
          cursor: "grab",
          touchAction: "none",
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        <DragIndicatorIcon />
      </IconButton>
      <UnitCard
        key={follower.id}
        unit={draftFollower}
        profile={profile}
        onOpenProfile={() => openProfileDrawer(profile.profileId)}
        showUnitCost={!unique}
        readonly={readonly}
        draggable={!readonly}
        controls={
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!unique ? (
              <UnitQuantityControls
                quantity={draftFollower.quantity}
                disabled={readonly}
                onChange={handleQuantityChange}
              />
            ) : (
              <span />
            )}

            <UnitActions
              canEdit
              canDelete
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          </Stack>
        }
      />
    </Box>
  );
}
