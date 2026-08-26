import {useState} from "react";
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import {MenuOutlined, SettingsOutlined} from "@mui/icons-material";
import {NavLink, Outlet} from "react-router";
import {navigation} from "./navigation";
import {QuickLookupSearch} from "../features/search/QuickLookupSearch.tsx";
import {useTranslation} from "react-i18next";

const drawerWidth = 260;

export const AppLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const {t} = useTranslation("navigation");

    const drawer = (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflowY: "auto",
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="div">
                    MESBG List Builder
                </Typography>
            </Toolbar>

            <Divider />

            <Box>
                {navigation.map((section, sectionIndex) => (
                    <Box key={section.label ?? sectionIndex}>
                        {section.label && (
                            <Typography
                                variant="overline"
                                color="textSecondary"
                                sx={{
                                    display: "block",
                                    px: 2,
                                    pt: 2,
                                    pb: 0.5,
                                }}
                            >
                                {t(section.label)}
                            </Typography>
                        )}

                        <List disablePadding>
                            {section.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <ListItemButton
                                        key={item.path}
                                        component={NavLink}
                                        to={item.path}
                                        end={item.path === "/"}
                                        onClick={() => setMobileOpen(false)}
                                        sx={{
                                            px: 2,
                                            borderRadius: 1,
                                            "&[aria-current='page']": {
                                                bgcolor: "action.selected",
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Icon />
                                        </ListItemIcon>

                                        <ListItemText primary={t(item.label)} />
                                    </ListItemButton>
                                );
                            })}
                        </List>

                        <Divider />
                    </Box>
                ))}
            </Box>

            <Box
                sx={{
                    mt: "auto",
                }}
            >
                <List disablePadding>
                    <ListItemButton
                        component={NavLink}
                        to="/settings"
                        onClick={() => setMobileOpen(false)}
                        sx={{
                            px: 2,
                            borderRadius: 1,
                            "&[aria-current='page']": {
                                bgcolor: "action.selected",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <SettingsOutlined />
                        </ListItemIcon>

                        <ListItemText primary={t("settings")} />
                    </ListItemButton>
                </List>
            </Box>
        </Box>
    );

    return (
        <Box sx={{display: "flex", minHeight: "100vh"}}>
            <AppBar position="fixed" color="inherit">
                <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            aria-label="Open navigation"
                            onClick={() => setMobileOpen(true)}
                            sx={{
                                display: {lg: "none"},
                            }}
                        >
                            <MenuOutlined/>
                        </IconButton>

                        <Typography variant="h6" sx={{ml: 2}}>
                            MESBG
                        </Typography>
                    </Box>
                    
                    <QuickLookupSearch onSearch={(query) => console.log(query)}/>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{
                    width: {lg: drawerWidth},
                    flexShrink: {lg: 0},
                }}
                aria-label="Main navigation"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {xs: "block", lg: "none"},
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: {xs: "none", lg: "block"},
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                }}
            >
                <Toolbar/>

                <Box
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                            lg: 4,
                        },
                        maxWidth: 1400,
                        mx: "auto",
                    }}
                >
                    <Outlet/>
                </Box>
            </Box>
        </Box>
    );
};