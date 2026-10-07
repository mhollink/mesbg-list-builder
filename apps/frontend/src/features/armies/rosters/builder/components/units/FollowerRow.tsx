import Stack from "@mui/material/Stack";

import { UnitActions } from "~/features/armies/rosters/builder/components/units/UnitActions.tsx";
import { UnitCard } from "~/features/armies/rosters/builder/components/units/UnitCard.tsx";
import { UnitQuantityControls } from "~/features/armies/rosters/builder/components/units/UnitQuantityControls.tsx";
import type { BuilderGameData } from "~/features/armies/rosters/builder/data/builder-game-data.types.ts";
import type {
  BuilderUnit,
  BuilderWarbandId,
} from "~/features/armies/rosters/builder/domain/roster.types.ts";
import { useDebouncedUnitUpdate } from "~/features/armies/rosters/builder/hooks/useDebouncedUnitUpdate.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface FollowerRowProps {
  warbandId: BuilderWarbandId;
  follower: BuilderUnit;
  gameData: BuilderGameData;
  readonly?: boolean;
  actions: RosterPersistence;
}

export function FollowerRow({
  warbandId,
  follower,
  gameData,
  readonly = false,
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

  const profile = gameData.armyListProfilesById.get(follower.armyListProfileId);
  if (!profile) {
    throw new Error(
      `Could not find profile for follower unit: ${follower.armyListProfileId}`,
    );
  }

  function handleOptionsChange(optionIds: string[]) {
    updateFollower({
      optionIds,
    });
  }

  function handleQuantityChange(quantity: number) {
    updateFollower({
      quantity,
    });
  }

  function handleDuplicate() {
    void actions.addFollower(
      warbandId,
      draftFollower.armyListProfileId,
      draftFollower.quantity,
      [...draftFollower.optionIds],
    );
  }

  function handleReplace() {
    // Open follower picker here later.
  }

  function handleDelete() {
    cancelUpdate();
    void actions.deleteUnit(warbandId, follower.id);
  }

  const unique = profile.profile.unitTypes.includes("unique");
  return (
    <UnitCard
      key={follower.id}
      unit={draftFollower}
      profile={profile}
      onOpenProfile={() => openProfileDrawer(profile.profileId)}
      onOptionsChange={handleOptionsChange}
      showUnitCost={!unique}
      readonly={readonly}
      controls={
        <Stack
          direction="row"
          spacing={2}
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
            canDuplicate={!unique}
            canReplace
            canDelete
            onDuplicate={handleDuplicate}
            onReplace={handleReplace}
            onDelete={handleDelete}
          />
        </Stack>
      }
    />
  );
}
