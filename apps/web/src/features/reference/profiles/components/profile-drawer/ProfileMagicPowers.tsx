import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileSection } from "./ProfileSection";
import type { ProfileDrawerMagicPower } from "./profile-drawer.types";

interface ProfileMagicPowersProps {
  powers: ProfileDrawerMagicPower[];
  onOpenRule: (ruleId: string) => void;
}

export function ProfileMagicPowers({
  powers,
  onOpenRule,
}: ProfileMagicPowersProps) {
  if (powers.length === 0) {
    return null;
  }

  return (
    <ProfileSection title="Magical Powers">
      <Stack
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 80px 64px",
            gap: 1,
            px: 1.5,
            py: 0.75,
            bgcolor: "action.hover",
          }}
        >
          <Header>Name</Header>
          <Header>Range</Header>
          <Header>Cast</Header>
        </Box>

        {powers.map((power) => (
          <ButtonBase
            key={power.id}
            onClick={() => onOpenRule(power.id)}
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 80px 64px",
              gap: 1,
              width: "100%",
              px: 1.5,
              py: 1,
              textAlign: "left",
              borderTop: 1,
              borderColor: "divider",

              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 500,
                }}
              >
                {power.name}
              </Typography>

              {power.target && (
                <Typography variant="caption" color="textSecondary">
                  {power.target}
                </Typography>
              )}
            </Box>

            <Typography variant="body2">{power.range}</Typography>

            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {power.cast}
            </Typography>
          </ButtonBase>
        ))}
      </Stack>
    </ProfileSection>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      color="textSecondary"
      sx={{ fontWeight: 700 }}
    >
      {children}
    </Typography>
  );
}
