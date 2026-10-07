import Stack from "@mui/material/Stack";

import { UnitActions } from "~/features/armies/rosters/builder/components/units/UnitActions.tsx";
import { UnitCard } from "~/features/armies/rosters/builder/components/units/UnitCard.tsx";
import { UnitQuantityControls } from "~/features/armies/rosters/builder/components/units/UnitQuantityControls.tsx";
import type { BuilderGameData } from "~/features/armies/rosters/builder/data/builder-game-data.types.ts";
import type { BuilderUnit } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface FollowerRowProps {
  follower: BuilderUnit;
  gameData: BuilderGameData;
  readonly?: boolean;
}

export function FollowerRow({
  follower,
  gameData,
  readonly = false,
}: FollowerRowProps) {
  const { openProfileDrawer } = useDrawerStack();

  const profile = gameData.armyListProfilesById.get(follower.armyListProfileId);

  if (!profile) {
    throw new Error(
      `Could not find profile for follower unit: ${follower.armyListProfileId}`,
    );
  }

  function handleOptionsChange(optionIds: string[]) {
    console.log("Options changed", optionIds);
  }

  function handleQuantityChange(quantity: number) {
    console.log("Quantity changed", quantity);
  }

  function handleDuplicate() {
    console.log("duplicate");
  }

  function handleReplace() {
    console.log("replace");
  }

  function handleDelete() {
    console.log("delete");
  }

  return (
    <UnitCard
      key={follower.id}
      unit={follower}
      profile={profile}
      onOpenProfile={() => openProfileDrawer(profile.profileId)}
      onOptionsChange={handleOptionsChange}
      showUnitCost={!profile.profile.unitTypeNames.includes("unique")}
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
          <UnitQuantityControls
            quantity={follower.quantity}
            disabled={readonly}
            onChange={handleQuantityChange}
          />

          <UnitActions
            canDuplicate={!profile.profile.unitTypes.includes("unique")}
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
