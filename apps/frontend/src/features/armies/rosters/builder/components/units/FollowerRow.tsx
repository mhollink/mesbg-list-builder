import { UnitCard } from "~/features/armies/rosters/builder/components/units/UnitCard.tsx";
import type { BuilderGameData } from "~/features/armies/rosters/builder/data/builder-game-data.types.ts";
import type { BuilderUnit } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface FollowerRowProps {
  follower: BuilderUnit;
  gameData: BuilderGameData;
}

export function FollowerRow({ follower, gameData }: FollowerRowProps) {
  const { openProfileDrawer } = useDrawerStack();

  const profile = gameData.armyListProfilesById.get(follower.armyListProfileId);

  return (
    <UnitCard
      key={follower.id}
      unit={follower}
      profile={profile}
      onOpenProfile={() => openProfileDrawer(profile.profileId)}
      onOptionsChange={(options) => console.log(options)}
      showUnitCost={!profile.profile.unitTypeNames.includes("unique")}
    />
  );
}
