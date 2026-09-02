import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { Stats } from "../../profiles.types";
import { ProfileSection } from "./ProfileSection";

interface ProfileStatsProps {
  stats: Stats;
}

const PROFILE_STATS = [
  ["Mv", "mv"],
  ["Fv", "fv"],
  ["Sv", "sv"],
  ["S", "s"],
  ["D", "d"],
  ["A", "a"],
  ["W", "w"],
  ["C", "c"],
  ["I", "i"],
] as const satisfies readonly [string, keyof Stats][];

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <ProfileSection title="Profile">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(5, minmax(0, 1fr))",
            sm: "repeat(9, minmax(0, 1fr))",
          },
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {PROFILE_STATS.map(([label, key]) => (
          <Box
            key={key}
            sx={{
              minWidth: 0,
              py: 1.25,
              textAlign: "center",

              "&:not(:last-child)": {
                borderRight: 1,
                borderColor: "divider",
              },
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

            <Typography
              variant="h6"
              sx={{
                mt: 0.25,
                fontWeight: 700,
              }}
            >
              {stats[key]}
            </Typography>
          </Box>
        ))}
      </Box>
    </ProfileSection>
  );
}
