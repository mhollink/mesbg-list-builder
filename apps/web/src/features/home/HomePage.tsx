import {Container, Stack} from "@mui/material";
import {LinkStrip} from "./components/LinkStrip.tsx";
import {FeatureSection} from "./sections/FeatureSection.tsx";
import {HeroSection} from "./sections/HeroSection.tsx";
import {NewPlayerSection} from "./sections/NewPlayerSection.tsx";
import {PreviewSection} from "./sections/PreviewSection.tsx";
import {type RecentRoster, ReturningPlayerSection,} from "./sections/ReturningPlayerSection.tsx";
import {StatusAndCommunitySection} from "./sections/StatusAndComunitySection.tsx";

type HomePageProps = {
    isReturningUser?: boolean;
    recentRosters?: RecentRoster[];
};

const demoRecentRosters: RecentRoster[] = [
    {
        id: "1",
        name: "Minas Tirith 750",
        army: "Minas Tirith",
        points: 750,
        href: "/rosters/1",
    },
    {
        id: "2",
        name: "Mordor pressure list",
        army: "Legions of Mordor",
        points: 650,
        href: "/rosters/2",
    },
    {
        id: "3",
        name: "Riders of Théoden",
        army: "Rohan",
        points: 800,
        href: "/rosters/3",
    },
];

export function HomePage({
                             isReturningUser = true,
                             recentRosters = demoRecentRosters,
                         }: HomePageProps) {
    return (
        <>
            <HeroSection returningUser={isReturningUser}/>

            <Container maxWidth="lg" sx={{py: {xs: 4, md: 7}}}>
                <Stack spacing={{xs: 5, md: 8}}>
                    {isReturningUser ? (
                        <ReturningPlayerSection recentRosters={recentRosters}/>
                    ) : (
                        <NewPlayerSection/>
                    )}

                    <FeatureSection/>
                    <PreviewSection/>
                    <StatusAndCommunitySection/>
                    <LinkStrip/>
                </Stack>
            </Container>
        </>
    );
}
