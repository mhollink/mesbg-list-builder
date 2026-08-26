import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PreviewRow } from "./PreviewRow.tsx";

export function RosterPreviewCard() {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 2,
        border: 1,
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.88),
        backdropFilter: "blur(14px)",
      })}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between" }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Roster preview
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Moria
            </Typography>
          </Box>
          <Chip label="650 pts" color="primary" />
        </Stack>

        <Divider />

        <Stack spacing={1.25}>
          <PreviewRow label="Leader" value="Durburz, Goblin-King of Moria" />
          <PreviewRow label="Warbands" value="5" />
          <PreviewRow label="Models" value="56" />
          <PreviewRow label="Bows" value="9 / 17" />
          <PreviewRow label="Throwing weapons" value="12 / 17" />
          <PreviewRow label="Warnings" value="None" />
        </Stack>

        <Button href="/armies/rosters/new" variant="contained" fullWidth>
          Start building
        </Button>
      </Stack>
    </Paper>
  );
}
