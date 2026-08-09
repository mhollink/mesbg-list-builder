import {
    AccountCircleOutlined,
    CollectionsBookmarkOutlined,
    EmojiEventsOutlined,
    GroupsOutlined,
    HomeOutlined,
    Inventory2Outlined,
    MenuBookOutlined,
    PersonSearchOutlined,
    SettingsOutlined,
    ShieldOutlined,
    SportsEsportsOutlined,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";

export interface NavigationItem {
    label: string;
    path: string;
    icon: SvgIconComponent;
    description?: string;
    featured?: boolean;
}

export interface NavigationSection {
    label?: string;
    items: NavigationItem[];
}

export const navigation: NavigationSection[] = [
    {
        items: [
            {
                label: "Home",
                path: "/",
                icon: HomeOutlined,
            }
        ],
    },
    {
        label: "Armies",
        items: [
            {
                label: "Rosters",
                path: "/armies/rosters",
                icon: ShieldOutlined,
                description: "Create and manage your army lists.",
                featured: true,
            },
            {
                label: "Collection",
                path: "/armies/collection",
                icon: Inventory2Outlined,
                description: "Keep track of the miniatures in your collection.",
                featured: true,
            },
        ],
    },
    {
        label: "Play",
        items: [
            {
                label: "Find a game",
                path: "/play/find-game",
                icon: PersonSearchOutlined,
                description: "Find players and games in your area.",
                featured: true,
            },
            {
                label: "Games",
                path: "/play/games",
                icon: SportsEsportsOutlined,
                description: "Track the games you play.",
                featured: true,
            },
            {
                label: "Battle Companies",
                path: "/play/battle-companies",
                icon: GroupsOutlined,
            },
            {
                label: "Tournaments",
                path: "/play/tournaments",
                icon: EmojiEventsOutlined,
            },
        ],
    },
    {
        label: "Reference",
        items: [
            {
                label: "Rules",
                path: "/reference/rules",
                icon: MenuBookOutlined,
                description: "Quickly find rules and game references.",
                featured: true,
            },
            {
                label: "Profiles",
                path: "/reference/profiles",
                icon: CollectionsBookmarkOutlined,
            },
        ],
    },
    {
        items: [
            {
                label: "Account",
                path: "/account",
                icon: AccountCircleOutlined,
            },
            {
                label: "Settings",
                path: "/settings",
                icon: SettingsOutlined,
            },
        ],
    },
];

export const featuredNavigation = navigation
    .flatMap((section) => section.items)
    .filter((item) => item.featured);