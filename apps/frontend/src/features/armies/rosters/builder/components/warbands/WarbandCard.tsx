import {useEffect, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import type { BuilderWarband } from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";
import type { WarbandHeaderActions } from "./WarbandActions.tsx";
import { MobileWarbandHeader, WarbandHeader } from "./WarbandHeader.tsx";
import { FollowerPicker } from "~/features/armies/rosters/builder/components/pickers/FollowerPicker.tsx";
import { LeaderPicker } from "~/features/armies/rosters/builder/components/pickers/LeaderPicker.tsx";
import { FollowerRow } from "~/features/armies/rosters/builder/components/units/FollowerRow.tsx";
import { LeaderRow } from "~/features/armies/rosters/builder/components/units/LeaderRow.tsx";
import { calculateWarbandPoints } from "~/features/armies/rosters/builder/domain/roster-statistics.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export interface WarbandCardProps {
  index: number;
  warband: BuilderWarband;
  gameData: BuilderGameData;
  capacity: WarbandCapacity;
  readonly?: boolean;
  actions: RosterPersistence;
  availableLeaders: LocalizedArmyListProfile[];
  availableFollowers: LocalizedArmyListProfile[];
  autoOpenLeaderPicker?: boolean;
  onLeaderPickerOpened?: () => void;
}

export function WarbandCard({
  index,
  warband,
  capacity,
  gameData,
  readonly = false,
  actions,
  availableLeaders,
  availableFollowers,
                              autoOpenLeaderPicker,
                              onLeaderPickerOpened
}: WarbandCardProps) {
  const points = calculateWarbandPoints(warband, gameData);
  const [open, setOpen] = useState(true);
  const [leaderPickerOpen, setLeaderPickerOpen] = useState(false);
  const [followerPickerOpen, setFollowerPickerOpen] = useState(false);

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

  const handleSelectLeader = async (profile: LocalizedArmyListProfile) =>
    await actions.setLeader(warband.id, profile.id, []);

  const handleAddFollower = async (profile: LocalizedArmyListProfile) =>
    await actions.addFollower(warband.id, profile.id, 1, []);

  useEffect(() => {
    if (
      autoOpenLeaderPicker &&
      !warband.leader &&
      !readonly
    ) {
      setLeaderPickerOpen(true);
      onLeaderPickerOpened?.();
    }
  }, [
    autoOpenLeaderPicker,
    onLeaderPickerOpened,
    readonly,
    warband.leader,
  ]);

  return (
    <>
      <Paper variant="outlined" elevation={10}>
        <Stack>
          <MobileWarbandHeader
            index={index}
            points={points}
            capacity={capacity}
            actions={headerActions}
          />
          <WarbandHeader
            index={index}
            points={points}
            capacity={capacity}
            actions={headerActions}
          />
          <Divider />
          <Box sx={{ p: 2 }}>
            <LeaderRow
              warbandId={warband.id}
              leader={warband.leader}
              gameData={gameData}
              actions={actions}
              readonly={readonly}
              collapsed={!open}
              onSelectLeader={() => setLeaderPickerOpen(true)}
            />
          </Box>
          {warband.followers.length > 0 && (
            <Collapse in={open}>
              <Divider />
              <Stack spacing={2} sx={{ p: 2 }}>
                {warband.followers.map((follower) => (
                  <FollowerRow
                    key={follower.id}
                    warbandId={warband.id}
                    follower={follower}
                    gameData={gameData}
                    actions={actions}
                    readonly={readonly}
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
                  p: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setFollowerPickerOpen(true)}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                    minWidth: {
                      sm: 180,
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
        open={leaderPickerOpen}
        profiles={availableLeaders}
        onClose={() => setLeaderPickerOpen(false)}
        onSelect={handleSelectLeader}
      />

      <FollowerPicker
        open={followerPickerOpen}
        profiles={availableFollowers}
        onClose={() => setFollowerPickerOpen(false)}
        onSelect={handleAddFollower}
      />
    </>
  );
}
