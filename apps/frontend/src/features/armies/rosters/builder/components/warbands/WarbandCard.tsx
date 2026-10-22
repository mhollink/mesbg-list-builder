import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import type {
  BuilderUnit,
  BuilderUnitId,
  BuilderWarband,
} from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";
import type { WarbandHeaderActions } from "./WarbandActions.tsx";
import { MobileWarbandHeader, WarbandHeader } from "./WarbandHeader.tsx";
import { FollowerPicker } from "~/features/armies/rosters/builder/components/pickers/FollowerPicker.tsx";
import { LeaderPicker } from "~/features/armies/rosters/builder/components/pickers/LeaderPicker.tsx";
import {
  saveFollowerLoadouts,
  saveLeaderLoadouts,
} from "~/features/armies/rosters/builder/components/pickers/unit-configuration/unit-configuration.persistence.ts";
import { FollowerRow } from "~/features/armies/rosters/builder/components/units/FollowerRow.tsx";
import { LeaderRow } from "~/features/armies/rosters/builder/components/units/LeaderRow.tsx";
import { calculateWarbandPoints } from "~/features/armies/rosters/builder/domain/roster-statistics.ts";
import { warbandSortId } from "~/features/armies/rosters/builder/hooks/roster-sort-layout.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

type FollowerEditor =
  | { type: "select" }
  | { type: "edit"; unit: BuilderUnit }
  | null;

export interface WarbandCardProps {
  index: number;
  warband: BuilderWarband;
  gameData: BuilderGameData;
  capacity: WarbandCapacity;
  generalId?: BuilderUnitId | null;
  readonly?: boolean;
  sortingDisabled?: boolean;
  actions: RosterPersistence;
  availableLeaders: LocalizedArmyListProfile[];
  availableFollowers: LocalizedArmyListProfile[];
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function WarbandCard({
  index,
  warband,
  capacity,
  gameData,
  generalId,
  readonly = false,
  actions,
  availableLeaders,
  availableFollowers,
  sortingDisabled,
  canMoveDown,
  canMoveUp,
  onMoveDown,
  onMoveUp,
}: WarbandCardProps) {
  const points = calculateWarbandPoints(warband, gameData);
  const [open, setOpen] = useState(true);

  const [leaderEditor, setLeaderEditor] = useState<boolean>(false);
  const [followerEditor, setFollowerEditor] = useState<FollowerEditor>(null);

  const { ref: warbandDropRef } = useDroppable({
    id: warbandSortId(warband.id),
    type: "warband",
    accept: "follower",
    collisionPriority: CollisionPriority.Low,
    disabled: readonly || sortingDisabled || !warband.leader,
    data: {
      kind: "warband",
      warbandId: warband.id,
    },
  });

  const headerActions: WarbandHeaderActions = {
    readonly,
    collapsed: open,
    toggleCollapse: () => setOpen(!open),
    deleteWarband: () => {
      void actions.deleteWarband(warband.id);
    },
    duplicateWarband: () => {
      void actions.duplicateWarband(warband.id);
    },
  };

  return (
    <>
      <Paper ref={warbandDropRef} variant="outlined">
        <Stack>
          <MobileWarbandHeader
            index={index}
            points={points}
            capacity={capacity}
            actions={headerActions}
            canMoveDown={canMoveDown}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            onMoveUp={onMoveUp}
          />
          <WarbandHeader
            index={index}
            points={points}
            capacity={capacity}
            actions={headerActions}
            canMoveDown={canMoveDown}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            onMoveUp={onMoveUp}
          />
          <Divider />
          <Box sx={{ p: 1 }}>
            <LeaderRow
              warbandId={warband.id}
              leader={warband.leader}
              generalId={generalId}
              gameData={gameData}
              actions={actions}
              readonly={readonly}
              collapsed={!open}
              onEditLeader={() => setLeaderEditor(true)}
            />
          </Box>
          {warband.followers.length > 0 && (
            <Collapse in={open}>
              <Divider />
              <Stack spacing={0.5} sx={{ p: 1 }}>
                {warband.followers.map((follower, index) => (
                  <FollowerRow
                    key={follower.id}
                    warbandId={warband.id}
                    follower={follower}
                    index={index}
                    gameData={gameData}
                    actions={actions}
                    readonly={readonly}
                    sortingDisabled={sortingDisabled}
                    onEdit={() =>
                      setFollowerEditor({ type: "edit", unit: follower })
                    }
                  />
                ))}
              </Stack>
            </Collapse>
          )}
          {open && warband.leader && !readonly && (
            <>
              <Divider />
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setFollowerEditor({ type: "select" })}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                    minWidth: {
                      sm: 240,
                    },
                  }}
                >
                  Add follower
                </Button>
              </Box>
            </>
          )}
        </Stack>
      </Paper>

      <LeaderPicker
        open={leaderEditor}
        profiles={availableLeaders}
        initialProfile={gameData.armyListProfilesById.get(
          warband.leader.armyListProfileId,
        )}
        existingUnits={warband.leader ? [warband.leader] : []}
        onClose={() => setLeaderEditor(false)}
        onSave={async (profile, loadouts) => {
          await saveLeaderLoadouts(warband, profile, loadouts, actions);
          setLeaderEditor(false);
        }}
      />

      <FollowerPicker
        open={followerEditor !== null}
        profiles={availableFollowers}
        initialProfile={
          followerEditor?.type === "edit"
            ? gameData.armyListProfilesById.get(
                followerEditor.unit.armyListProfileId,
              )
            : undefined
        }
        existingUnits={
          followerEditor?.type === "edit"
            ? warband.followers.map((unit) =>
                unit.id === followerEditor.unit.id ? followerEditor.unit : unit,
              )
            : warband.followers
        }
        onClose={() => setFollowerEditor(null)}
        onSave={async (profile, loadouts) => {
          await saveFollowerLoadouts(warband, profile, loadouts, actions);
          setFollowerEditor(null);
        }}
      />
    </>
  );
}
