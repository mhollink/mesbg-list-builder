import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import {Box, Button, Card, CardActions, CardContent, Container, Grid, Stack, Typography,} from "@mui/material";
import {Link} from "react-router";

const supportOptions = [
    {
        title: "Share the project",
        description:
            "One of the easiest ways to help is by sharing the List Builder with other players, local groups, Discord communities, and tournament organizers.",
        icon: <GroupsOutlinedIcon fontSize="large"/>,
        actionLabel: "Invite players",
        href: undefined,
    },
    {
        title: "Give feedback",
        description:
            "Clear feedback helps improve the app faster. Bugs, missing data, confusing flows, and feature ideas are all useful.",
        icon: <RateReviewOutlinedIcon fontSize="large"/>,
        actionLabel: "Give feedback",
        href: "/feedback",
    },
    {
        title: "Contribute code",
        description:
            "If you are comfortable with development, focused pull requests are welcome. UI fixes, accessibility improvements, tests, documentation, and small features are great places to start.",
        icon: <CodeOutlinedIcon fontSize="large"/>,
        actionLabel: "View repository",
        href: "https://github.com/mhollink/mesbg-list-builder-v2",
    },
    {
        title: "Support financially",
        description:
            "Donations help cover hosting, tooling, maintenance, and the time needed to keep improving the project.",
        icon: <VolunteerActivismOutlinedIcon fontSize="large"/>,
        actionLabel: "Donate",
        href: "https://patreon.com/mesbg_list_builder",
    },
];

const contributionGuidelines = [
    {
        title: "Keep changes focused",
        description:
            "Small, well-scoped improvements are easier to review, test, and merge than large changes touching many parts of the app.",
    },
    {
        title: "Open a discussion for bigger ideas",
        description:
            "Before starting larger features, it helps to align on the problem, design direction, and technical approach first.",
    },
    {
        title: "Prioritize maintainability",
        description:
            "The project benefits most from changes that keep the app predictable, testable, accessible, and easy to evolve.",
    },
];

export function SupportPage() {
    return (
        <Box component="main">
            <Box>
                <Container maxWidth="lg">
                    <Stack spacing={3} sx={{maxWidth: "md"}}>
                        <Typography
                            component="p"
                            variant="overline"
                            color="primary"
                            sx={{fontWeight: 700}}
                        >
                            Support the project
                        </Typography>

                        <Typography
                            component="h1"
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: -1,
                            }}
                        >
                            Help keep the List Builder moving forward
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{lineHeight: 1.7}}
                        >
                            The List Builder takes time to build, maintain, host, and keep up
                            to date. If you find it useful, there are several ways to support
                            the project, from sharing it with other players to contributing
                            code or helping financially.
                        </Typography>

                        <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                            <Button
                                component={Link}
                                to="/feedback"
                                variant="contained"
                                size="large"
                            >
                                Give feedback
                            </Button>

                            <Button component={Link} to="/" variant="outlined" size="large">
                                Back to homepage
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{py: {xs: 6, md: 10}}}>
                <Grid container spacing={3}>
                    {supportOptions.map((option) => (
                        <Grid key={option.title} size={{xs: 12, sm: 6, md: 3}}>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                    borderRadius: 4,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardContent sx={{flexGrow: 1}}>
                                    <Stack spacing={2}>
                                        <Box color="primary.main">{option.icon}</Box>

                                        <Typography
                                            component="h2"
                                            variant="h6"
                                            sx={{fontWeight: 700}}
                                        >
                                            {option.title}
                                        </Typography>

                                        <Typography color="text.secondary" sx={{lineHeight: 1.7}}>
                                            {option.description}
                                        </Typography>
                                    </Stack>
                                </CardContent>

                                <CardActions sx={{px: 2, pb: 2}}>
                                    {option.href ? (
                                        <Button component={Link} to={option.href}>
                                            {option.actionLabel}
                                        </Button>
                                    ) : (
                                        <Button disabled>{option.actionLabel}</Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Box sx={{bgcolor: "background.default", py: {xs: 6, md: 10}}}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{alignItems: "center"}}>
                        <Grid size={{xs: 12, md: 5}}>
                            <Stack spacing={2}>
                                <Box color="primary.main">
                                    <HandshakeOutlinedIcon fontSize="large"/>
                                </Box>

                                <Typography
                                    component="h2"
                                    variant="h4"
                                    sx={{fontWeight: 800}}
                                >
                                    Ways to contribute
                                </Typography>

                                <Typography color="text.secondary" sx={{lineHeight: 1.7}}>
                                    Contributions do not have to be large to be valuable. A clear
                                    bug report, a small accessibility fix, a missing test, or a
                                    well-described feature idea can all help the project become
                                    better.
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{xs: 12, md: 7}}>
                            <Stack spacing={2}>
                                {contributionGuidelines.map((guideline) => (
                                    <Card
                                        key={guideline.title}
                                        variant="outlined"
                                        sx={{borderRadius: 4}}
                                    >
                                        <CardContent>
                                            <Stack spacing={1}>
                                                <Typography variant="h6" sx={{fontWeight: 700}}>
                                                    {guideline.title}
                                                </Typography>

                                                <Typography
                                                    color="text.secondary"
                                                    sx={{lineHeight: 1.7}}
                                                >
                                                    {guideline.description}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{py: {xs: 6, md: 10}}}>
                <Card
                    variant="outlined"
                    sx={{
                        borderRadius: 4,
                        textAlign: "center",
                    }}
                >
                    <CardContent sx={{p: {xs: 3, md: 5}}}>
                        <Stack spacing={3} sx={{alignItems: "center"}}>
                            <Box color="primary.main">
                                <FavoriteBorderOutlinedIcon fontSize="large"/>
                            </Box>

                            <Stack spacing={1.5}>
                                <Typography
                                    component="h2"
                                    variant="h4"
                                    sx={{fontWeight: 800}}
                                >
                                    Every bit of support helps
                                </Typography>

                                <Typography color="text.secondary" sx={{lineHeight: 1.7}}>
                                    Whether you share the project, report an issue, help verify
                                    data, contribute code, or donate, you are helping make the
                                    List Builder more useful for the community.
                                </Typography>
                            </Stack>

                            <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                                <Button
                                    component={Link}
                                    to="/feedback"
                                    variant="contained"
                                    size="large"
                                >
                                    Give feedback
                                </Button>

                                <Button
                                    href="https://patreon.com/mesbg_list_builder"
                                    variant="outlined"
                                    size="large"
                                >
                                    Support financially
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
