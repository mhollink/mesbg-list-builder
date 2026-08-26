import {Box, Stack, Typography} from "@mui/material";
import {Outlet} from "react-router";
import {SettingsNavigation} from "./theme/components/SettingsNavigation.tsx";

export const SettingsPage = () => (
    <Stack spacing={3}>
        <Box>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
            >
                Settings
            </Typography>

            <Typography color="textSecondary">
                Customize your MESBG List Builder experience.
            </Typography>
        </Box>

        <Box
            sx={{
                display: {
                    xs: "block",
                    md: "grid",
                },
                gridTemplateColumns: {
                    md: "220px minmax(0, 1fr)",
                },
                gap: {
                    xs: 3,
                    md: 4,
                },
            }}
        >
            <SettingsNavigation/>

            <Box
                sx={{
                    minWidth: 0,
                    pt: {
                        xs: 3,
                        md: 0,
                    },
                }}
            >
                <Outlet/>
            </Box>
        </Box>
    </Stack>
);