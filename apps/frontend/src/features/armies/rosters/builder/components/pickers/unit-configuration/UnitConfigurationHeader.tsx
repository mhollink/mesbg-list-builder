import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { UnitConfigurationViewProps } from "./UnitConfigurationView.tsx";

type UnitConfigurationHeaderProps = Pick<
  UnitConfigurationViewProps,
  "profile" | "onBack" | "onClose"
>;

export function UnitConfigurationHeader({
  profile,
  onBack,
  onClose,
}: UnitConfigurationHeaderProps) {
  return (
    <>
      <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: 3, pb: 2.5 }}>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ alignItems: "flex-start" }}
        >
          {onBack && (
            <IconButton
              onClick={onBack}
              aria-label="Back to unit selection"
              sx={{ mt: -0.5, ml: -1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}
            >
              Configure unit
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {profile.profile.name}
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            aria-label="Close drawer"
            sx={{ mt: -0.5, mr: -1 }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>
      <Divider />
    </>
  );
}
