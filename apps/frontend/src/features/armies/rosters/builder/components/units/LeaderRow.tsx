import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { UnitCard } from "~/features/armies/rosters/builder/components/units/UnitCard.tsx";
import type { BuilderGameData } from "~/features/armies/rosters/builder/data/builder-game-data.types.ts";
import type { BuilderUnit } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface LeaderRowProps {
  leader: BuilderUnit | null;
  gameData: BuilderGameData;
}

export function LeaderRow({ leader, gameData }: LeaderRowProps) {
  const { openProfileDrawer } = useDrawerStack();

  if (!leader) {
    // TODO: Proper warning/hint to instruct user to select a leader.
    return (
      <Stack spacing={0.5}>
        <Typography variant="overline" color="text.secondary">
          Leader
        </Typography>

        <Typography color="text.secondary">No leader selected</Typography>
      </Stack>
    );
  }

  const leaderProfile = gameData.armyListProfilesById.get(
    leader.armyListProfileId,
  );
  return (
    <UnitCard
      unit={leader}
      profile={leaderProfile}
      onOpenProfile={() => openProfileDrawer(leaderProfile.profile.profile)}
      onOptionsChange={(options) => console.log(options)}
    />
  );
}
