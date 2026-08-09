import {createBrowserRouter, Navigate} from "react-router";
import {AppLayout} from "./AppLayout";
import {FeaturePagePlaceholder} from "../components/FeaturePagePlaceholder";
import {HomePage} from "../features/home/HomePage";
import {FeedbackPage} from "../features/about-help/FeedbackPage"
import {SupportPage} from "../features/about-help/SupportPage.tsx";
import {PoliciesPage} from "../features/about-help/PoliciesPage.tsx";
import {NotFoundPage} from "../components/NotFoundPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: "search",
                element: (
                    <FeaturePagePlaceholder
                        title="Search"
                        description="Search through MESBG content."
                    />
                ),
            },

            {
                path: "armies",
                children: [
                    {
                        index: true,
                        element: <Navigate to="rosters" replace/>,
                    },
                    {
                        path: "rosters",
                        element: (
                            <FeaturePagePlaceholder
                                title="Rosters"
                                description="Create and manage army lists."
                            />
                        ),
                    },
                    {
                        path: "rosters/new",
                        element: (
                            <FeaturePagePlaceholder
                                title="New roster"
                                description="Create a new army list"
                            />
                        ),
                    },
                    {
                        path: "rosters/:rosterId",
                        element: (
                            <FeaturePagePlaceholder
                                title="Roster"
                                description="See and update a roster"
                            />
                        ),
                    },
                    {
                        path: "collection",
                        element: (
                            <FeaturePagePlaceholder
                                title="Collection"
                                description="Manage your miniature collection."
                            />
                        ),
                    },
                ],
            },

            {
                path: "play",
                children: [
                    {
                        index: true,
                        element: <Navigate to="games" replace/>,
                    },
                    {
                        path: "find-game",
                        element: (
                            <FeaturePagePlaceholder
                                title="Find a game"
                                description="Find players and games near you."
                            />
                        ),
                    },
                    {
                        path: "battle-companies",
                        element: (
                            <FeaturePagePlaceholder title="Battle Companies"/>
                        ),
                    },
                    {
                        path: "games",
                        element: (
                            <FeaturePagePlaceholder
                                title="Games"
                                description="View and manage your games."
                            />
                        ),
                    },
                    {
                        path: "tournaments",
                        element: (
                            <FeaturePagePlaceholder title="Tournaments"/>
                        ),
                    },
                ],
            },

            {
                path: "reference",
                children: [
                    {
                        index: true,
                        element: <Navigate to="rules" replace/>,
                    },
                    {
                        path: "rules",
                        element: (
                            <FeaturePagePlaceholder
                                title="Rules"
                                description="Browse game rules and reference material."
                            />
                        ),
                    },
                    {
                        path: "profiles",
                        element: (
                            <FeaturePagePlaceholder
                                title="Profiles"
                                description="Browse model profiles."
                            />
                        ),
                    },
                ],
            },

            {
                path: "account",
                element: <FeaturePagePlaceholder title="Account"/>,
            },
            {
                path: "settings",
                element: <FeaturePagePlaceholder title="Settings"/>,
            },

            {
                path: "feedback",
                element: <FeedbackPage/>,
            },
            {
                path: "support",
                element: <SupportPage/>,
            },
            {
                path: "policies",
                element: <PoliciesPage/>
            },

            {
                path: "*",
                element: <NotFoundPage/>,
            },
        ],
    },
]);