import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LocalizedArmyListProfileOption } from "../../army-lists.types.ts";

interface ArmyListProfileOptionsProps {
  options: LocalizedArmyListProfileOption[];
}

export function ArmyListProfileOptions({
  options,
}: ArmyListProfileOptionsProps) {
  if (options.length === 0) {
    return null;
  }

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{
          fontWeight: 700,
        }}
      >
        Options
      </Typography>

      <Stack
        component="ul"
        sx={{
          m: 0,
          p: 0,
          gap: 0.25,
          listStyle: "none",
        }}
      >
        {options.map((option) => (
          <Box
            key={option.id}
            component="li"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              {option.name}
            </Typography>

            {option.points !== undefined && option.points !== 0 && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {option.points > 0 ? "+" : ""}
                {option.points} pts
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
