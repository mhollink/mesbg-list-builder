import Stack from "@mui/material/Stack";

import { GeneralToggle } from "~/features/armies/rosters/builder/components/units/controls/GeneralToggle.tsx";
import { UnitActions } from "~/features/armies/rosters/builder/components/units/controls/UnitActions.tsx";
import { UnitCard } from "~/features/armies/rosters/builder/components/units/UnitCard.tsx";
import type { BuilderGameData } from "~/features/armies/rosters/builder/data/builder-game-data.types.ts";
import type {
  BuilderUnit,
  BuilderUnitId,
  BuilderWarbandId,
} from "~/features/armies/rosters/builder/domain/roster.types.ts";
import { useDebouncedUnitUpdate } from "~/features/armies/rosters/builder/hooks/useDebouncedUnitUpdate.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface LeaderRowProps {
  warbandId: BuilderWarbandId;
  leader: BuilderUnit;
  generalId?: BuilderUnitId | null;
  gameData: BuilderGameData;
  actions: RosterPersistence;
  readonly?: boolean;
  collapsed?: boolean;

  onEditLeader: () => void;
}

export function LeaderRow({
  leader,
  warbandId,
  generalId,
  gameData,
  actions,
  readonly,
  collapsed,
  onEditLeader,
}: LeaderRowProps) {
  const { openProfileDrawer } = useDrawerStack();
  const leaderProfile = gameData.armyListProfilesById.get(
    leader.armyListProfileId,
  );

  if (!leaderProfile) {
    throw new Error(
      `Could not find profile for follower unit: ${leader.armyListProfileId}`,
    );
  }

  const { unit: draftLeader } = useDebouncedUnitUpdate({
    unit: leader,
    warbandId,
    updateUnit: actions.updateUnit,
  });

  return (
    <UnitCard
      unit={draftLeader}
      profile={leaderProfile}
      onOpenProfile={() => openProfileDrawer(leaderProfile.profile.profile)}
      collapsed={collapsed}
      readonly={readonly}
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
          <GeneralToggle
            isGeneral={leader.id === generalId}
            isFixedGeneral={false}
            onSetGeneral={(value) =>
              value
                ? void actions.setGeneral(leader.id)
                : void actions.clearGeneral()
            }
          />

          <UnitActions canEdit onEdit={onEditLeader} />
        </Stack>
      }
    />
  );
}
