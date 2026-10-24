import { useMemo, useState } from "react";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { CommunityThemePreview } from "./CommunityThemePreview.tsx";
import {
  BRAND_DESCRIPTIONS,
  BRAND_ROLES,
  type CommunityThemeDraft,
  generateThemeSource,
  getThemeSlug,
  isHexColor,
  isValidCommunityTheme,
} from "./community-theme.utils.ts";
import { applyThemeMode } from "~/theme/applyThemeMode.ts";
import { createAppTheme } from "~/theme/createAppTheme.ts";
import { createThemeTokens } from "~/theme/createThemeTokens.ts";
import { defaultTheme } from "~/theme/presets/default.ts";
import type { BrandColorTokens } from "~/theme/theme.types.ts";
import { THEME_PRESETS } from "~/theme/themePresets.ts";

const STARTER_PRESETS = Object.values(THEME_PRESETS);

const INITIAL_DRAFT: CommunityThemeDraft = {
  name: "",
  author: "",
  description: "",
  colors: { ...defaultTheme.colors.brand },
};

export function CommunityThemeBuilderPage() {
  const theme = useTheme();
  const [draft, setDraft] = useState<CommunityThemeDraft>(INITIAL_DRAFT);
  const [starterId, setStarterId] = useState<string>(defaultTheme.id);
  const [mode, setMode] = useState<"light" | "dark">(theme.palette.mode);

  const validColors = BRAND_ROLES.every((role) =>
    isHexColor(draft.colors[role]),
  );
  const canDownload = isValidCommunityTheme(draft);

  // Keep the live preview usable while a hexadecimal color is being typed.
  const previewColors = useMemo<BrandColorTokens>(
    () =>
      Object.fromEntries(
        BRAND_ROLES.map((role) => [
          role,
          isHexColor(draft.colors[role])
            ? draft.colors[role]
            : defaultTheme.colors.brand[role],
        ]),
      ) as unknown as BrandColorTokens,
    [draft.colors],
  );

  const previewTheme = useMemo(() => {
    const tokens = createThemeTokens(previewColors);
    return createAppTheme(applyThemeMode(tokens, mode), mode);
  }, [previewColors, mode]);

  function setColor(role: keyof BrandColorTokens, value: string) {
    setDraft((current) => ({
      ...current,
      colors: { ...current.colors, [role]: value },
    }));
  }

  function chooseStarter(id: string) {
    const preset = STARTER_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setStarterId(id);
    setDraft((current) => ({
      ...current,
      colors: { ...preset.colors.brand },
    }));
  }

  function downloadTheme() {
    if (!canDownload) return;
    const source = generateThemeSource(draft);
    const blob = new Blob([source], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getThemeSlug(draft.name)}.tsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <Stack spacing={4} sx={{ pb: 4 }}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          Appearance · Community
        </Typography>
        <Typography component="h1" variant="h3" sx={{ fontWeight: 700 }}>
          Community Theme Builder
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 820 }}>
          Create a color theme for MESBG List Builder. Try all five brand colors
          in a live interface, then export a preset for community review. Your
          choices stay in this page and do not change your account theme.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(320px, 440px) minmax(0, 1fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2.5}>
              <Typography component="h2" variant="h6">
                Theme details
              </Typography>

              <TextField
                select
                fullWidth
                size="small"
                label="Start from an existing palette"
                value={starterId}
                onChange={(event) => chooseStarter(event.target.value)}
                helperText="Only the starting colors are copied. Your changes remain separate."
              >
                {STARTER_PRESETS.map((preset) => (
                  <MenuItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                required
                label="Theme name"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                slotProps={{ htmlInput: { maxLength: 60 } }}
                helperText="Displayed in the theme selector after acceptance."
              />
              <TextField
                fullWidth
                required
                label="Creator name"
                value={draft.author}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    author: event.target.value,
                  }))
                }
                slotProps={{ htmlInput: { maxLength: 60 } }}
                helperText="Shown as the credit for your community theme."
              />
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Description (optional)"
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                slotProps={{ htmlInput: { maxLength: 160 } }}
              />
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2}>
              <Box>
                <Typography component="h2" variant="h6">
                  Brand colors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pick a color or enter a six-digit hex value. Neutral surfaces
                  and status colors are generated automatically.
                </Typography>
              </Box>

              {BRAND_ROLES.map((role) => (
                <ColorEditor
                  key={role}
                  role={role}
                  value={draft.colors[role]}
                  onChange={(value) => setColor(role, value)}
                />
              ))}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h6">
                Export your theme
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download a self-contained .tsx preset that uses the same theme
                factory as the built-in themes. Send the file to the project
                maintainer for review. Downloading does not publish the theme.
              </Typography>
              {!validColors && (
                <Alert severity="warning">
                  Fix the invalid hex values before downloading.
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                startIcon={<DownloadRoundedIcon />}
                onClick={downloadTheme}
                disabled={!canDownload}
              >
                Download .tsx theme file
              </Button>
              {canDownload && (
                <Typography variant="caption" color="text.secondary">
                  Filename: {getThemeSlug(draft.name)}.tsx
                </Typography>
              )}
            </Stack>
          </Paper>
        </Stack>

        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { sm: "center" },
            }}
          >
            <Box>
              <Typography component="h2" variant="h5">
                Live preview
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Components are rendered using your generated theme.
              </Typography>
            </Box>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={mode}
              onChange={(_, value: "light" | "dark" | null) => {
                if (value) setMode(value);
              }}
              aria-label="Preview color mode"
            >
              <ToggleButton value="light">Light</ToggleButton>
              <ToggleButton value="dark">Dark</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <CommunityThemePreview theme={previewTheme} />
          <Alert severity="info" icon={<AutoAwesomeRoundedIcon />}>
            Check both preview modes. Pale accent and secondary colors may look
            attractive as fills but have insufficient contrast for small text or
            outlined buttons. Status colors are deliberately kept separate.
          </Alert>
        </Stack>
      </Box>
    </Stack>
  );
}

interface ColorEditorProps {
  role: keyof BrandColorTokens;
  value: string;
  onChange: (value: string) => void;
}

function ColorEditor({ role, value, onChange }: ColorEditorProps) {
  const valid = isHexColor(value);
  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
        <Box
          component="input"
          type="color"
          aria-label={`Choose ${role} color`}
          value={valid ? value : "#808080"}
          onChange={(event) => onChange(event.currentTarget.value)}
          sx={{
            width: 40,
            height: 40,
            p: 0,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            cursor: "pointer",
            bgcolor: "transparent",
            flexShrink: 0,
          }}
        />
        <TextField
          fullWidth
          size="small"
          label={role.charAt(0).toUpperCase() + role.slice(1)}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          error={!valid}
          slotProps={{ htmlInput: { maxLength: 7, spellCheck: false } }}
          helperText={
            !valid ? "Use a six-digit #RRGGBB value" : BRAND_DESCRIPTIONS[role]
          }
        />
      </Stack>
    </Stack>
  );
}
