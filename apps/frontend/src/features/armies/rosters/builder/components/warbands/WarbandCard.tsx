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
  BuilderUnitId,
  BuilderWarband,
} from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";
import type { WarbandHeaderActions } from "./WarbandActions.tsx";
import { MobileWarbandHeader, WarbandHeader } from "./WarbandHeader.tsx";
import { FollowerPicker } from "~/features/armies/rosters/builder/components/pickers/FollowerPicker.tsx";
import { LeaderPicker } from "~/features/armies/rosters/builder/components/pickers/LeaderPicker.tsx";
import {
  saveFollowerLoadout,
  saveFollowerLoadouts,
  saveLeaderLoadout,
} from "~/features/armies/rosters/builder/components/pickers/unit-configuration/unit-configuration.persistence.ts";
import { FollowerRow } from "~/features/armies/rosters/builder/components/units/FollowerRow.tsx";
import { LeaderRow } from "~/features/armies/rosters/builder/components/units/LeaderRow.tsx";
import { calculateWarbandPoints } from "~/features/armies/rosters/builder/domain/roster-statistics.ts";
import { warbandSortId } from "~/features/armies/rosters/builder/hooks/roster-sort-layout.ts";
import { useBuilderPickerHistory } from "~/features/armies/rosters/builder/hooks/useBuilderPickerHistory.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

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
  const { picker, openPicker } = useBuilderPickerHistory();
  const warbandId = String(warband.id);
  const leaderEditor =
    picker?.type === "leader-edit" && picker.warbandId === warbandId;
  const selectedFollower =
    picker?.type === "follower-edit" && picker.warbandId === warbandId
      ? warband.followers.find((unit) => String(unit.id) === picker.unitId)
      : undefined;
  const followerEditor =
    (picker?.type === "follower-add" && picker.warbandId === warbandId) ||
    (picker?.type === "follower-edit" &&
      picker.warbandId === warbandId &&
      selectedFollower !== undefined);
  const editingProfile = selectedFollower
    ? gameData.armyListProfilesById.get(selectedFollower.armyListProfileId)
    : undefined;
  const editingFollowers = selectedFollower
    ? editingProfile?.profile.stats.type === "hero"
      ? [selectedFollower]
      : warband.followers.filter(
          (follower) =>
            follower.armyListProfileId === selectedFollower.armyListProfileId,
        )
    : undefined;

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
              onEditLeader={() =>
                openPicker({ type: "leader-edit", warbandId })
              }
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
                      openPicker({
                        type: "follower-edit",
                        warbandId,
                        unitId: String(follower.id),
                      })
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
                  onClick={() =>
                    openPicker({ type: "follower-add", warbandId })
                  }
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
        unit={warband.leader}
        onSave={(profile, loadouts) => {
          const loadout = loadouts[0];
          if (!loadout || loadouts.length !== 1) {
            throw new Error("A leader requires one configuration.");
          }
          return saveLeaderLoadout(warband, profile, loadout, actions);
        }}
      />

      <FollowerPicker
        open={followerEditor}
        profiles={availableFollowers}
        initialProfile={
          selectedFollower
            ? gameData.armyListProfilesById.get(
                selectedFollower.armyListProfileId,
              )
            : undefined
        }
        unit={selectedFollower}
        existingUnits={editingFollowers ?? warband.followers}
        capacity={capacity}
        onSave={(profile, loadouts) => {
          if (profile.profile.stats.type === "hero") {
            const loadout = loadouts[0];
            if (!loadout || loadouts.length !== 1) {
              throw new Error("A hero requires one configuration.");
            }
            const existing =
              selectedFollower ??
              warband.followers.find(
                (follower) => follower.armyListProfileId === profile.id,
              );
            return saveFollowerLoadout(
              warband,
              profile,
              loadout,
              actions,
              existing,
            );
          }
          return saveFollowerLoadouts(
            warband,
            profile,
            loadouts,
            actions,
            warband.followers.filter(
              (follower) => follower.armyListProfileId === profile.id,
            ),
          );
        }}
      />
    </>
  );
}
