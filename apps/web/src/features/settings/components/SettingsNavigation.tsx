import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import AccessibilityNewOutlinedIcon from "@mui/icons-material/AccessibilityNewOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import {Link, useLocation} from "react-router";
import type {ReactElement} from "react";

interface SettingsSection {
    path: string;
    label: string;
    icon: ReactElement;
    enabled: boolean;
}

const SETTINGS_SECTIONS: SettingsSection[] = [
    {
        path: "/settings/general",
        label: "General",
        icon: <TuneOutlinedIcon/>,
        enabled: false,
    },
    {
        path: "/settings/appearance",
        label: "Appearance",
        icon: <PaletteOutlinedIcon/>,
        enabled: true,
    },
    {
        path: "/settings/accessibility",
        label: "Accessibility",
        icon: <AccessibilityNewOutlinedIcon/>,
        enabled: false,
    },
    {
        path: "/settings/export",
        label: "Export",
        icon: <PictureAsPdfOutlinedIcon/>,
        enabled: false,
    },
    {
        path: "/settings/account",
        label: "Account",
        icon: <PersonOutlineOutlinedIcon/>,
        enabled: false,
    },
    {
        path: "/settings/data",
        label: "Data & Sync",
        icon: <SyncOutlinedIcon/>,
        enabled: false,
    },
    {
        path: "/settings/privacy",
        label: "Privacy",
        icon: <PrivacyTipOutlinedIcon/>,
        enabled: false,
    },
];

export function SettingsNavigation() {
    const location = useLocation();
    const theme = useTheme();

    const desktop = useMediaQuery(
        theme.breakpoints.up("md"),
    );

    const selectedPath =
        SETTINGS_SECTIONS.find(({path}) =>
            location.pathname.startsWith(path),
        )?.path ?? false;

    return (
        <Box
            component="nav"
            aria-label="Settings"
            sx={{
                minWidth: desktop ? 220 : 0,
            }}
        >
            <Tabs
                value={selectedPath}
                orientation={desktop ? "vertical" : "horizontal"}
                variant={desktop ? "standard" : "scrollable"}
                scrollButtons="auto"
                aria-label="Settings sections"
                sx={{
                    borderRight: desktop ? 1 : 0,
                    borderBottom: desktop ? 0 : 1,
                    borderColor: "divider",

                    "& .MuiTab-root": {
                        minHeight: 48,
                        justifyContent: desktop
                            ? "flex-start"
                            : "center",
                    },
                }}
            >
                {SETTINGS_SECTIONS.map(
                    ({path, label, icon}) => (
                        <Tab
                            key={path}
                            component={Link}
                            to={path}
                            value={path}
                            label={label}
                            icon={icon}
                            iconPosition="start"
                        />
                    ),
                )}
            </Tabs>
        </Box>
    );
}