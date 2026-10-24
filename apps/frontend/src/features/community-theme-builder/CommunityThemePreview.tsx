import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { alpha, type Theme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { BRAND_ROLES } from "./community-theme.utils.ts";
import Switch from "~/components/switch";

export function CommunityThemePreview({ theme }: { theme: Theme }) {
  const [equipmentSelected, setEquipmentSelected] = useState(true);
  const [models, setModels] = useState(6);
  const points = 76 + models * (equipmentSelected ? 10 : 8);

  return (
    <ThemeProvider theme={theme}>
      <Paper
        variant="outlined"
        sx={{
          overflow: "hidden",
          bgcolor: (theme) => theme.palette.background.default,
          color: (theme) => theme.palette.text.primary,
          borderColor: "divider",
        }}
      >
        <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Brand palette
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 0.5,
              }}
            >
              {BRAND_ROLES.map((role) => {
                const color = theme.palette[role].main;
                return (
                  <Box key={role} sx={{ minWidth: 0 }}>
                    <Box
                      sx={{ height: 44, bgcolor: color, borderRadius: 1 }}
                      title={`${role}: ${color}`}
                    />
                    <Typography
                      variant="caption"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {role}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="overline"
              sx={{ color: (theme) => theme.palette.text.secondary }}
            >
              Army builder
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                mt: 1,
                overflow: "hidden",
                bgcolor: (theme) => theme.palette.background.paper,
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                  borderLeft: 4,
                  borderColor: (theme) => theme.palette.secondary.main,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: (theme) => theme.palette.text.primary,
                  }}
                >
                  Warband 1
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: (theme) => theme.palette.text.primary }}
                >
                  {points} points · {models + 1} models
                </Typography>
              </Stack>
              <Divider />
              <Stack spacing={2} sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center" }}
                >
                  <ShieldOutlinedIcon
                    sx={{ color: (theme) => theme.palette.accent.main }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: (theme) => theme.palette.text.primary,
                      }}
                    >
                      Captain of Rohan
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: (theme) => theme.palette.text.secondary }}
                    >
                      Hero of Fortitude
                    </Typography>
                  </Box>
                  <Chip
                    label="General"
                    size="small"
                    variant="outlined"
                    sx={{
                      color: (theme) => theme.palette.accent.main,
                      borderColor: (theme) => theme.palette.accent.main,
                    }}
                  />
                </Stack>
                <Divider />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", flexWrap: "wrap" }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      flex: 1,
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    Warriors of Rohan
                  </Typography>
                  <Chip
                    size="small"
                    label={`${models} models`}
                    sx={{
                      bgcolor: (theme) =>
                        alpha(theme.palette.text.primary, 0.2),
                      color: (theme) => theme.palette.text.primary,
                    }}
                  />
                </Stack>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    bgcolor: equipmentSelected
                      ? (theme) => alpha(theme.palette.highlight.main, 0.12)
                      : (theme) => theme.palette.background.paper,
                    borderColor: equipmentSelected
                      ? theme.palette.primary.main
                      : "divider",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={equipmentSelected}
                        onChange={(_, value) => setEquipmentSelected(value)}
                        sx={{
                          ".MuiSwitch-thumb": {
                            color: equipmentSelected
                              ? (theme) => theme.palette.primary.main
                              : "inherit",
                          },
                          ".Mui-checked+.MuiSwitch-track": {
                            bgcolor: (theme) =>
                              `${theme.palette.primary.main} !important`,
                          },
                        }}
                      />
                    }
                    label="Shield and spear · +2 points"
                    slotProps={{
                      typography: {
                        sx: {
                          color: (theme) => theme.palette.text.primary,
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      ml: 6,
                      color: (theme) => theme.palette.text.secondary,
                    }}
                  >
                    Highlight marks the selected loadout.
                  </Typography>
                </Paper>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    disabled={models >= 12}
                    sx={{
                      bgcolor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.primary.contrastText,
                    }}
                    onClick={() =>
                      setModels((count) => Math.min(12, count + 1))
                    }
                  >
                    Add follower
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: (theme) => theme.palette.secondary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    onClick={() =>
                      setEquipmentSelected((selected) => !selected)
                    }
                  >
                    Toggle equipment
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Box>

          <Box>
            <Typography
              variant="overline"
              sx={{ color: (theme) => theme.palette.text.secondary }}
            >
              Reference and profiles
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                mt: 1,
                p: 2,
                bgcolor: (theme) => theme.palette.background.paper,
              }}
            >
              <Stack spacing={2}>
                <Box
                  sx={{
                    pl: 1.5,
                    borderLeft: 3,
                    borderColor: (theme) => theme.palette.tertiary.main,
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 700,
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    Heroic tier
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.text.secondary }}
                  >
                    Tertiary marks reference categories and sections.
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: (theme) => theme.palette.text.primary }}
                >
                  Some special rules have one or multiple{" "}
                  <Box
                    component="strong"
                    sx={{
                      fontWeight: 700,
                      color: (theme) => theme.palette.accent.main,
                    }}
                  >
                    Keywords
                  </Box>{" "}
                  which will get highlighted in the text.
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    size="small"
                    variant="outlined"
                    label="Dwarf"
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      borderColor: (theme) => theme.palette.primary.main,
                    }}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label="Fellowship"
                    sx={{
                      color: (theme) => theme.palette.secondary.main,
                      borderColor: (theme) => theme.palette.secondary.main,
                    }}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label="Infantry"
                    sx={{
                      color: (theme) => theme.palette.accent.main,
                      borderColor: (theme) => theme.palette.accent.main,
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>
          </Box>

          <Box>
            <Typography
              variant="overline"
              sx={{ color: (theme) => theme.palette.text.primary }}
            >
              Semantic colors (unchanged)
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Alert
                severity="success"
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.2),
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.success.light
                      : theme.palette.success.dark,
                }}
              >
                Roster saved successfully
              </Alert>
              <Alert
                severity="info"
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.2),
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.info.light
                      : theme.palette.info.dark,
                }}
              >
                Reference information
              </Alert>
              <Alert
                severity="warning"
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2),
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.warning.light
                      : theme.palette.warning.dark,
                }}
              >
                Your roster is over the points limit
              </Alert>
              <Alert
                severity="error"
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.2),
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.error.light
                      : theme.palette.error.dark,
                }}
              >
                An invalid unit configuration was found
              </Alert>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
}
