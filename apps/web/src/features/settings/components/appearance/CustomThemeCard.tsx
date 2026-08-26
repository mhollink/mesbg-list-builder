import {Box, Card, Stack, Typography} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

interface CustomThemeCardProps {
    selected: boolean;
    primaryColor: string;
    onChange: (color: string) => void;
}

export function CustomThemeCard({
                                    selected,
                                    primaryColor,
                                    onChange,
                                }: CustomThemeCardProps) {
    return (
        <Card
            variant="outlined"
            sx={{
                borderWidth: selected ? 2 : 1,
                borderColor: selected
                    ? "primary.main"
                    : "divider",
            }}
        >
            <Box sx={{p: 2}}>
                <Stack spacing={2}>
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{alignItems: "center"}}
                        >
                            <AutoAwesomeRoundedIcon sx={{fontSize: "1rem"}}/>

                            <Typography sx={{fontWeight: 600}}>
                                Custom
                            </Typography>
                        </Stack>

                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            Create a theme from your own
                            primary color.
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{alignItems: "center"}}
                    >
                        <Box
                            component="input"
                            type="color"
                            aria-label="Custom primary color"
                            value={primaryColor}
                            onChange={(event) =>
                                onChange(
                                    event.currentTarget.value,
                                )
                            }
                            sx={{
                                width: 38,
                                height: 30,
                                p: 0,
                                border: 0,
                                bgcolor: "transparent",
                                cursor: "pointer",
                            }}
                        />

                        <Typography sx={{fontFamily: "monospace"}}>
                            {primaryColor.toUpperCase()}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        </Card>
    );
}