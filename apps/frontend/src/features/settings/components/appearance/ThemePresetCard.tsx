import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ThemePreset } from "../../../../theme/theme.types";

interface ThemePresetCardProps {
  preset: ThemePreset;
  selected: boolean;
  onSelect: () => void;
}

export function ThemePresetCard({
  preset,
  selected,
  onSelect,
}: ThemePresetCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? "primary.main" : "divider",
      }}
    >
      <CardActionArea
        onClick={onSelect}
        sx={{
          height: "100%",
          p: 2,
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>{preset.name}</Typography>

            {preset.description && (
              <Typography variant="body2" color="textSecondary">
                {preset.description}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1}>
            <ColorPreview label="Primary" color={preset.colors.brand.primary} />
            <ColorPreview
              label="Secondary"
              color={preset.colors.brand.secondary}
            />
            <ColorPreview
              label="Tertiary"
              color={preset.colors.brand.tertiary}
            />
            <ColorPreview label="Accent" color={preset.colors.brand.accent} />
            <ColorPreview
              label="Highlight"
              color={preset.colors.brand.highlight}
            />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

function ColorPreview({ color, label }: { color: string; label: string }) {
  return (
    <Box
      role="img"
      aria-label={`${label}: ${color}`}
      title={`${label}: ${color}`}
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1,
        bgcolor: color,
        border: 1,
        borderColor: "divider",
      }}
    />
  );
}
