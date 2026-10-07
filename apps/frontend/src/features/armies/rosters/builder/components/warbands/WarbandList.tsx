import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import type {
  BuilderRoster,
  BuilderWarband,
} from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";
import { WarbandCard } from "./WarbandCard.tsx";

interface WarbandListProps {
  roster: BuilderRoster;
  gameData: BuilderGameData;

  canAddWarband: boolean;

  getWarbandCapacity(warband: BuilderWarband): WarbandCapacity;

  onAddWarband(): Promise<void>;
}

export function WarbandList({
  roster,
  gameData,
  canAddWarband,
  getWarbandCapacity,
  onAddWarband,
}: WarbandListProps) {
  const [adding, setAdding] = useState(false);
  const [addFailed, setAddFailed] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    setAddFailed(false);

    try {
      await onAddWarband();
    } catch {
      setAddFailed(true);
    } finally {
      setAdding(false);
    }
  };

  if (roster.warbands.length === 0) {
    return (
      <Stack spacing={2}>
        {addFailed && (
          <Alert severity="error">The warband could not be created.</Alert>
        )}

        <Paper
          variant="outlined"
          sx={{
            p: 5,
            textAlign: "center",
            borderStyle: "dashed",
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <div>
              <Typography variant="h6">No warbands yet</Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Add a warband to start building this roster.
              </Typography>
            </div>

            {canAddWarband && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                disabled={adding}
                onClick={() => void handleAdd()}
              >
                Add warband
              </Button>
            )}
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {addFailed && (
        <Alert severity="error">The warband could not be created.</Alert>
      )}

      {roster.warbands.map((warband, index) => (
        <WarbandCard
          key={warband.id}
          index={index}
          warband={warband}
          gameData={gameData}
          capacity={getWarbandCapacity(warband)}
          readonly={roster.locked}
        />
      ))}

      {canAddWarband && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          disabled={adding}
          onClick={() => void handleAdd()}
          sx={{
            alignSelf: "flex-start",
          }}
        >
          Add warband
        </Button>
      )}
    </Stack>
  );
}
