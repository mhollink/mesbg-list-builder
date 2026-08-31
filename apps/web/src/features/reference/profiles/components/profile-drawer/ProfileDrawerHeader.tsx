import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LocalizedProfile } from "../../profiles.types";

interface ProfileDrawerHeaderProps {
  profile: LocalizedProfile;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
}

export function ProfileDrawerHeader({
  profile,
  canGoBack,
  onBack,
  onClose,
}: ProfileDrawerHeaderProps) {
  return (
    <Box
      sx={{
        px: {
          xs: 2.5,
          sm: 4,
        },
        pt: 3,
        pb: 2.5,
      }}
    >
      <Stack
        direction="row"
        sx={{
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {canGoBack && (
          <IconButton
            onClick={onBack}
            aria-label="Back to previous item"
            sx={{
              mt: -0.5,
              ml: -1,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="overline"
              color="textSecondary"
              sx={{
                display: "block",
                mb: 0.5,
                fontWeight: 700,
              }}
            >
              {profile.originName}
            </Typography>

            {profile.points !== undefined && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  pt: 0.5,
                }}
              >
                {profile.points} pts
              </Typography>
            )}
          </Stack>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {profile.name}
          </Typography>

          <Stack
            direction="row"
            useFlexGap
            sx={{
              mt: 1.5,
              gap: 0.75,
              flexWrap: "wrap",
            }}
          >
            {profile.race.map((race) => (
              <Chip
                key={race}
                label={race}
                size="small"
                variant="outlined"
                color="warning"
              />
            ))}

            {profile.factions.map((faction) => (
              <Chip
                key={faction}
                label={faction}
                size="small"
                variant="outlined"
                color="info"
              />
            ))}

            {profile.unitTypes.map((unitType) => (
              <Chip
                key={unitType}
                label={unitType}
                size="small"
                variant="outlined"
                color="error"
              />
            ))}

            {profile.baseSize && (
              <Chip
                label={profile.baseSize}
                size="small"
                variant="outlined"
                color="success"
              />
            )}
          </Stack>
        </Box>

        <IconButton
          onClick={onClose}
          aria-label="Close profile details"
          sx={{
            mt: -0.5,
            mr: -1,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
