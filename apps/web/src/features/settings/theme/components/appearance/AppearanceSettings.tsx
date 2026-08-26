import type {MouseEvent} from "react";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SettingsBrightnessRoundedIcon from "@mui/icons-material/SettingsBrightnessRounded";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import {useAppDispatch, useAppSelector,} from "../../../../../app/hooks.ts";
import {setCustomPrimaryColor, setPreset, setThemeMode,} from "../../themeSlice.ts";
import type {ThemeMode} from "../../theme.types.ts";
import {THEME_PRESETS} from "../../themePresets.ts";
import {ThemePresetCard} from "./ThemePresetCard.tsx";
import {CustomThemeCard} from "./CustomThemeCard.tsx";

export function AppearanceSettings() {
    const dispatch = useAppDispatch();
    const {mode, selection} = useAppSelector((state) => state.theme,);

    function handleModeChange(_: MouseEvent<HTMLElement>, value: ThemeMode | null) {
        if (value) {
            dispatch(setThemeMode(value));
        }
    }

    const preset = Object.values(THEME_PRESETS);

    return (
        <Stack spacing={4}>
            <Box>
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                >
                    Appearance
                </Typography>

                <Typography color="textSecondary">
                    Customize how MESBG List Builder looks.
                </Typography>
            </Box>

            <Box>
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                >
                    Color mode
                </Typography>

                <ToggleButtonGroup
                    exclusive
                    value={mode}
                    onChange={handleModeChange}
                    aria-label="Color mode"
                >
                    <ToggleButton
                        value="light"
                        aria-label="Light"
                    >
                        <LightModeRoundedIcon sx={{mr: 1}}/>
                        Light
                    </ToggleButton>

                    <ToggleButton
                        value="dark"
                        aria-label="Dark"
                    >
                        <DarkModeRoundedIcon sx={{mr: 1}}/>
                        Dark
                    </ToggleButton>

                    <ToggleButton
                        value="system"
                        aria-label="System"
                    >
                        <SettingsBrightnessRoundedIcon sx={{mr: 1}}/>
                        System
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
                    Theme
                </Typography>

                <Typography color="textSecondary" sx={{mb: 2}}>
                    Choose one of the available themes.
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
                    {preset.map((preset) => (
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
            </Box>
        </Stack>
    );
}