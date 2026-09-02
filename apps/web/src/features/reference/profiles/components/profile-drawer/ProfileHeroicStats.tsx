import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Stats } from "../../profiles.types";

interface ProfileHeroicStatsProps {
  stats: Stats;
}

export function ProfileHeroicStats({ stats }: ProfileHeroicStatsProps) {
  const values = [
    ["Might", stats.might],
    ["Will", stats.will],
    ["Fate", stats.fate],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (values.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="row"
      sx={{
        mt: 1.5,
        gap: 1,
      }}
    >
      {values.map(([label, value]) => (
        <Box
          key={label}
          sx={{
            flex: 1,
            py: 1,
            px: 1.5,
            textAlign: "center",
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              display: "block",
              fontWeight: 700,
            }}
          >
            {label}
          </Typography>

          <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
        </Box>
      ))}
    </Stack>
  );
}
