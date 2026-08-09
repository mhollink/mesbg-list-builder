import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {Box, Button, Chip, Container, Grid, Stack, Typography,} from "@mui/material";
import {RosterPreviewCard} from "../components/RosterPreviewCard.tsx";

export function HeroSection({returningUser}: { returningUser: boolean }) {

    return (
        <Box>
            <Container maxWidth="lg" sx={{py: {xs: 8, md: 14}}}>
                <Grid container spacing={5} sx={{alignItems: "center"}}>
                    <Grid size={{xs: 12, md: 7}}>
                        <Stack spacing={3}>
                            <Stack
                                direction="row"
                                spacing={1}
                                useFlexGap
                                sx={{flexWrap: "wrap"}}
                            >
                                <Chip label="MESBG 2024" color="primary"/>
                                <Chip label="Army lists" variant="outlined"/>
                                <Chip label="Game tracker" variant="outlined"/>
                            </Stack>

                            <Box>
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    sx={{
                                        maxWidth: 760,
                                        fontWeight: 800,
                                        letterSpacing: "-0.04em",
                                        fontSize: {xs: "2.5rem", md: "4.25rem"},
                                    }}
                                >
                                    Build, manage and play your MESBG army lists.
                                </Typography>

                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{mt: 2, maxWidth: 680, lineHeight: 1.6}}
                                >
                                    A fast list builder for Middle-earth Strategy Battle Game
                                    players, with roster validation, printable cards, digital
                                    trackers, match history and collection tools.
                                </Typography>
                            </Box>

                            <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                                {returningUser ? (
                                    <>
                                        <Button
                                            href="/armies/rosters/new"
                                            size="large"
                                            variant="contained"
                                            endIcon={<ArrowForwardIcon/>}
                                        >
                                            Create roster
                                        </Button>
                                        <Button href="/armies/rosters" size="large" variant="outlined">
                                            View my rosters
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            href="/login"
                                            size="large"
                                            variant="contained"
                                            endIcon={<ArrowForwardIcon/>}
                                        >
                                            Sign in
                                        </Button>
                                        <Button href="/register" size="large" variant="outlined">
                                            Create account
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid size={{xs: 12, md: 5}}>
                        <RosterPreviewCard/>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
