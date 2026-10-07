import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { UnitActions } from "~/features/armies/rosters/builder/components/units/UnitActions.tsx";
import { UnitCard } from "~/features/armies/rosters/builder/components/units/UnitCard.tsx";
import type { BuilderGameData } from "~/features/armies/rosters/builder/data/builder-game-data.types.ts";
import type {
  BuilderUnit,
  BuilderWarbandId,
} from "~/features/armies/rosters/builder/domain/roster.types.ts";
import { useDebouncedUnitUpdate } from "~/features/armies/rosters/builder/hooks/useDebouncedUnitUpdate.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface LeaderRowProps {
  warbandId: BuilderWarbandId;
  leader: BuilderUnit | null;
  gameData: BuilderGameData;
  actions: RosterPersistence;
  readonly?: boolean;
  collapsed?: boolean;
}

export function LeaderRow({ leader, ...props }: LeaderRowProps) {
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

  return <SelectedLeaderRow leader={leader} {...props} />;
}

function SelectedLeaderRow({
  leader,
  warbandId,
  gameData,
  actions,
  readonly,
  collapsed,
}: Omit<LeaderRowProps, "leader"> & {
  leader: BuilderUnit;
}) {
  const { openProfileDrawer } = useDrawerStack();
  const leaderProfile = gameData.armyListProfilesById.get(
    leader.armyListProfileId,
  );

  if (!leaderProfile) {
    throw new Error(
      `Could not find profile for follower unit: ${leader.armyListProfileId}`,
    );
  }

  const { unit: draftLeader, update } = useDebouncedUnitUpdate({
    unit: leader,
    warbandId,
    updateUnit: actions.updateUnit,
  });

  return (
    <UnitCard
      unit={draftLeader}
      profile={leaderProfile}
      onOpenProfile={() => openProfileDrawer(leaderProfile.profile.profile)}
      onOptionsChange={(optionIds) => update({ optionIds })}
      collapsed={collapsed}
      readonly={readonly}
      controls={
        <Stack
          direction="row"
          sx={{
            justifyContent: "flex-end",
          }}
        >
          <UnitActions
            canReplace
            onReplace={() => {
              // picker later
            }}
          />
        </Stack>
      }
    />
  );
}
