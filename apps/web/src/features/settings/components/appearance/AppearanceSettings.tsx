import {type MouseEvent, useMemo} from "react";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SettingsBrightnessRoundedIcon from "@mui/icons-material/SettingsBrightnessRounded";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import {useAppDispatch, useAppSelector,} from "../../../../app/hooks.ts";
import {setCustomPrimaryColor, setPreset, setThemeMode,} from "../../theme/themeSlice.ts";
import type {ThemeMode} from "../../theme/theme.types.ts";
import {THEME_PRESETS} from "../../theme/themePresets.ts";
import {ThemePresetCard} from "./ThemePresetCard.tsx";
import {CustomThemeCard} from "./CustomThemeCard.tsx";
import {useTranslation} from "react-i18next";

const allPresets = Object.values(THEME_PRESETS);


export function AppearanceSettings() {
    const dispatch = useAppDispatch();
    const {mode, selection} = useAppSelector((state) => state.theme,);
    const {t} = useTranslation("settings")

    function handleModeChange(_: MouseEvent<HTMLElement>, value: ThemeMode | null) {
        if (value) {
            dispatch(setThemeMode(value));
        }
    }

    const appPresets = useMemo(() => allPresets.filter(({category}) => category === "middle-earth" || category === "default"), []);
    const creatorPresets = useMemo(() => allPresets.filter(({category}) => category === "creator"), []);
    const patreonPresets = useMemo(() => allPresets.filter(({category}) => category === "patreon"), []);

    return (
        <Stack spacing={4} sx={{pb: 4}}>
            <Box>
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                >
                    {t("appearance.title")}
                </Typography>

                <Typography color="textSecondary">
                    {t("appearance.description")}
                </Typography>
            </Box>

            <Box>
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                >
                    {t("appearance.mode.title")}
                </Typography>

                <ToggleButtonGroup
                    exclusive
                    value={mode}
                    onChange={handleModeChange}
                    aria-label={t("appearance.mode.title")}
                >
                    <ToggleButton
                        value="light"
                        aria-label={t("appearance.mode.light")}
                    >
                        <LightModeRoundedIcon sx={{mr: 1}}/>
                        {t("appearance.mode.light")}
                    </ToggleButton>

                    <ToggleButton
                        value="dark"
                        aria-label={t("appearance.mode.dark")}
                    >
                        <DarkModeRoundedIcon sx={{mr: 1}}/>
                        {t("appearance.mode.dark")}
                    </ToggleButton>

                    <ToggleButton
                        value="system"
                        aria-label={t("appearance.mode.system")}
                    >
                        <SettingsBrightnessRoundedIcon sx={{mr: 1}}/>
                        {t("appearance.mode.system")}
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Divider/>

            <Box>
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                >
                    {t("appearance.theme.title")}
                </Typography>

                <Typography color="textSecondary" sx={{mb: 2}}>
                    {t("appearance.theme.builtIn")}
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {appPresets.map((preset) => (
                        <ThemePresetCard
                            key={preset.id}
                            preset={preset}
                            selected={
                                selection.type === "preset" &&
                                selection.preset === preset.id
                            }
                            onSelect={() => dispatch(setPreset(preset.id))}
                        />
                    ))}

                    <CustomThemeCard
                        selected={selection.type === "custom"}
                        primaryColor={
                            selection.type === "custom"
                                ? selection.primaryColor
                                : "#1976D2"
                        }
                        onChange={(color) =>
                            dispatch(setCustomPrimaryColor(color),)
                        }
                    />
                </Box>

                <Typography color="textSecondary" sx={{my: 2}}>
                    {t("appearance.theme.creatorPacks")}
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {creatorPresets.map((preset) => (
                        <ThemePresetCard
                            key={preset.id}
                            preset={preset}
                            selected={
                                selection.type === "preset" &&
                                selection.preset === preset.id
                            }
                            onSelect={() => dispatch(setPreset(preset.id))}
                        />
                    ))}
                </Box>

                <Typography color="textSecondary" sx={{my: 2}}>
                    {t("appearance.theme.patreonPacks")}
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {patreonPresets.map((preset) => (
                        <ThemePresetCard
                            key={preset.id}
                            preset={preset}
                            selected={
                                selection.type === "preset" &&
                                selection.preset === preset.id
                            }
                            onSelect={() => dispatch(setPreset(preset.id))}
                        />
                    ))}
                </Box>
            </Box>
        </Stack>
    );
}