import { useMemo } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useGetRosterQuery } from "../api/roster-api.ts";
import { formatArmyListId } from "~/features/reference/army-lists/army-lists.utils.ts";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";

interface AuthenticatedRosterPageProps {
  rosterId: number;
}

export function AuthenticatedRosterPage({
  rosterId,
}: AuthenticatedRosterPageProps) {
  const { data: roster, isLoading, isError } = useGetRosterQuery(rosterId);

  const { armyLists } = useGameArmyLists();
  const armyListName = useMemo(() => {
    if (!roster) {
      return "";
    }

    return (
      armyLists.find((armyList) => armyList.id === roster.armyListId)?.name ??
      formatArmyListId(roster.armyListId)
    );
  }, [armyLists, roster]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !roster) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">This roster could not be loaded.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">{roster.name}</Typography>

          <Typography color="textSecondary">{armyListName}</Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            flexWrap: "wrap",
          }}
        >
          <Chip label={`${roster.points} points`} />
          <Chip label={`${roster.modelCount} models`} />
          <Chip label={`${roster.warbandCount} warbands`} />
          <Chip label={`${roster.bowCount} bows`} />
          <Chip label={`${roster.throwingWeaponCount} throwing weapons`} />
        </Stack>

        {roster.warbands.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              borderStyle: "dashed",
            }}
          >
            <Typography variant="h6">No warbands yet</Typography>

            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Add a warband to start building this roster.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {roster.warbands.map((warband, index) => (
              <Paper key={warband.id} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6">Warband {index + 1}</Typography>

                <Typography>Leader: {warband.leader.profileId}</Typography>

                <Typography variant="body2" color="textSecondary">
                  {warband.followers.reduce(
                    (total, follower) => total + follower.quantity,
                    0,
                  )}{" "}
                  followers
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
