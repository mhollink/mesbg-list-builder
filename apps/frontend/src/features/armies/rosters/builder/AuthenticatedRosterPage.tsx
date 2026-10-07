import { useMemo } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";

import { useGetRosterQuery } from "../api/rosters-api.ts";
import { RosterBuilder } from "./components/layout/RosterBuilder.tsx";
import { mapApiRoster } from "./mappers/api-roster.mapper.ts";
import { useAuthenticatedRosterPersistence } from "./persistence/useAuthenticatedRosterPersistence.ts";

interface AuthenticatedRosterPageProps {
  rosterId: number;
}

export function AuthenticatedRosterPage({
  rosterId,
}: AuthenticatedRosterPageProps) {
  const { data, isLoading, isError } = useGetRosterQuery(rosterId);

  const persistence = useAuthenticatedRosterPersistence(rosterId);

  const roster = useMemo(() => (data ? mapApiRoster(data) : undefined), [data]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
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

  return <RosterBuilder roster={roster} persistence={persistence} />;
}
