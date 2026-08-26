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
import {useTranslation} from "react-i18next";

interface SettingsSection {
    path: string;
    label: string;
    icon: ReactElement;
}

const SETTINGS_SECTIONS: SettingsSection[] = [
    {
        path: "/settings/general",
        label: "general",
        icon: <TuneOutlinedIcon/>,
    },
    {
        path: "/settings/appearance",
        label: "appearance",
        icon: <PaletteOutlinedIcon/>,
    },
    {
        path: "/settings/accessibility",
        label: "accessibility",
        icon: <AccessibilityNewOutlinedIcon/>,
    },
    {
        path: "/settings/export",
        label: "export",
        icon: <PictureAsPdfOutlinedIcon/>,
    },
    {
        path: "/settings/account",
        label: "account",
        icon: <PersonOutlineOutlinedIcon/>,
    },
    {
        path: "/settings/data",
        label: "dataAndSync",
        icon: <SyncOutlinedIcon/>,
    },
    {
        path: "/settings/privacy",
        label: "privacy",
        icon: <PrivacyTipOutlinedIcon/>,
    },
];

export function SettingsNavigation() {
    const location = useLocation();
    const theme = useTheme();
    const { t } = useTranslation("navigation");

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
                            label={t(label)}
                            icon={icon}
                            iconPosition="start"
                            sx={{
                                textAlign: "start"
                            }}
                        />
                    ),
                )}
            </Tabs>
        </Box>
    );
}