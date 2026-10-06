import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import type { BuilderWarband } from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";
import { UnitCard } from "~/features/armies/rosters/builder/components/units/UnitCard.tsx";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface WarbandCardProps {
  index: number;
  warband: BuilderWarband;
  gameData: BuilderGameData;
  capacity: WarbandCapacity;
}

export function WarbandCard({
  index,
  warband,
  gameData,
  capacity,
}: WarbandCardProps) {
  const { openProfileDrawer } = useDrawerStack();

  const leader = warband.leader
    ? gameData.armyListProfilesById.get(warband.leader.armyListProfileId)
    : undefined;

  return (
    <Paper variant="outlined" elevation={10}>
      <Stack>
        <Stack
          sx={{
            p: 2,
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6">Warband {index + 1}</Typography>

          {capacity.maximum !== undefined && (
            <Chip
              size="small"
              label={`${capacity.current} / ${capacity.maximum}`}
              color={capacity.overMaximum ? "error" : "default"}
            />
          )}
        </Stack>

        <Divider />

        <Box sx={{ p: 2 }}>
          {leader ? (
            <UnitCard
              unit={warband.leader}
              profile={leader}
              onOpenProfile={() => openProfileDrawer(leader.profile.profile)}
              onOptionsChange={(options) => console.log(options)}
            />
          ) : (
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                Leader
              </Typography>

              <Typography color="text.secondary">No leader selected</Typography>
            </Stack>
          )}
        </Box>

        {warband.followers.length > 0 && (
          <>
            <Divider />

            <Stack spacing={2} sx={{ p: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Followers
              </Typography>

              {warband.followers.map((follower) => {
                const profile = gameData.armyListProfilesById.get(
                  follower.armyListProfileId,
                );

                return (
                  <UnitCard
                    key={follower.id}
                    unit={follower}
                    profile={profile}
                    onOpenProfile={() => openProfileDrawer(profile.profileId)}
                    onOptionsChange={(options) => console.log(options)}
                    showUnitCost={
                      !profile.profile.unitTypeNames.includes("unique")
                    }
                  />
                );
              })}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
