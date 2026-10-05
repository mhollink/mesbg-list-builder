import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import type { BuilderWarband } from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";

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
  const leader = warband.leader
    ? gameData.armyListProfilesById.get(warband.leader.armyListProfileId)
    : undefined;

  return (
    <Paper variant="outlined">
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
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                Leader
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                {leader.profile.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {leader.tierName}
              </Typography>
            </Stack>
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

            <Stack spacing={1} sx={{ p: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Followers
              </Typography>

              {warband.followers.map((follower) => {
                const profile = gameData.armyListProfilesById.get(
                  follower.armyListProfileId,
                );

                return (
                  <Stack
                    key={follower.id}
                    sx={{
                      direction: "row",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2">
                      {profile?.profile.name ?? follower.armyListProfileId}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      × {follower.quantity}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
