import type { SvgIconComponent } from "@mui/icons-material";
import CollectionsBookmarkOutlined from "@mui/icons-material/CollectionsBookmarkOutlined";
import EmojiEventsOutlined from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import ListAltOutlined from "@mui/icons-material/ListAltOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PersonSearchOutlined from "@mui/icons-material/PersonSearchOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";

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
        label: "home",
        path: "/",
        icon: HomeOutlined,
      },
    ],
  },
  {
    label: "armies",
    items: [
      {
        label: "rosters",
        path: "/armies/rosters",
        icon: ShieldOutlined,
        description: "Create and manage your army lists.",
        featured: true,
      },
      {
        label: "collection",
        path: "/armies/collection",
        icon: Inventory2Outlined,
        description: "Keep track of the miniatures in your collection.",
        featured: true,
      },
    ],
  },
  {
    label: "play",
    items: [
      {
        label: "find-a-game",
        path: "/play/find-game",
        icon: PersonSearchOutlined,
        description: "Find players and games in your area.",
        featured: true,
      },
      {
        label: "games",
        path: "/play/games",
        icon: SportsEsportsOutlined,
        description: "Track the games you play.",
        featured: true,
      },
      {
        label: "battle-companies",
        path: "/play/battle-companies",
        icon: GroupsOutlined,
      },
      {
        label: "tournaments",
        path: "/play/tournaments",
        icon: EmojiEventsOutlined,
      },
    ],
  },
  {
    label: "reference",
    items: [
      {
        label: "rules",
        path: "/reference/rules",
        icon: MenuBookOutlined,
        description: "Quickly find rules and game references.",
        featured: true,
      },
      {
        label: "profiles",
        path: "/reference/profiles",
        icon: CollectionsBookmarkOutlined,
      },
      {
        label: "army-lists",
        path: "/reference/armylists",
        icon: ListAltOutlined,
      },
    ],
  },
];
