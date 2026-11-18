import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import CastleOutlinedIcon from "@mui/icons-material/CastleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import FolderSpecialOutlinedIcon from "@mui/icons-material/FolderSpecialOutlined";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsKabaddiOutlinedIcon from "@mui/icons-material/SportsKabaddiOutlined";
import SportsMmaOutlinedIcon from "@mui/icons-material/SportsMmaOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import TerrainOutlinedIcon from "@mui/icons-material/TerrainOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

export const GROUP_ICONS = [
  // Organization and collections
  { id: "folder", label: "Folder", Icon: FolderRoundedIcon },
  { id: "folder-open", label: "Open folder", Icon: FolderOpenOutlinedIcon },
  {
    id: "folder-special",
    label: "Special folder",
    Icon: FolderSpecialOutlinedIcon,
  },
  { id: "archive", label: "Archive", Icon: ArchiveOutlinedIcon },
  { id: "inventory", label: "Inventory", Icon: Inventory2OutlinedIcon },
  {
    id: "collection",
    label: "Collection",
    Icon: CollectionsBookmarkOutlinedIcon,
  },
  { id: "bookmark", label: "Bookmark", Icon: BookmarkBorderOutlinedIcon },
  { id: "category", label: "Category", Icon: CategoryOutlinedIcon },
  { id: "layers", label: "Layers", Icon: LayersOutlinedIcon },

  // Armies, combat and achievements
  { id: "shield", label: "Shield", Icon: ShieldOutlinedIcon },
  { id: "castle", label: "Castle", Icon: CastleOutlinedIcon },
  { id: "flag", label: "Flag", Icon: FlagOutlinedIcon },
  { id: "trophy", label: "Trophy", Icon: EmojiEventsOutlinedIcon },
  { id: "medal", label: "Medal", Icon: MilitaryTechOutlinedIcon },
  { id: "premium", label: "Achievement", Icon: WorkspacePremiumOutlinedIcon },
  { id: "favorite", label: "Favorite", Icon: StarBorderOutlinedIcon },
  { id: "security", label: "Defence", Icon: SecurityOutlinedIcon },
  { id: "combat", label: "Combat", Icon: SportsMmaOutlinedIcon },
  { id: "skirmish", label: "Skirmish", Icon: SportsKabaddiOutlinedIcon },

  // Fantasy and elements
  { id: "lightning", label: "Lightning", Icon: BoltOutlinedIcon },
  { id: "fire", label: "Fire", Icon: LocalFireDepartmentOutlinedIcon },

  // People and communities
  { id: "community", label: "Community", Icon: GroupsOutlinedIcon },
  { id: "people", label: "People", Icon: PeopleOutlinedIcon },
  { id: "alliance", label: "Alliance", Icon: HandshakeOutlinedIcon },
  { id: "world", label: "World", Icon: PublicOutlinedIcon },

  // Locations and exploration
  { id: "map", label: "Map", Icon: MapOutlinedIcon },
  { id: "explore", label: "Explore", Icon: ExploreOutlinedIcon },
  { id: "terrain", label: "Mountains", Icon: TerrainOutlinedIcon },
  { id: "forest", label: "Forest", Icon: ForestOutlinedIcon },
  { id: "travel", label: "Travel", Icon: TravelExploreOutlinedIcon },

  // Events and history
  { id: "event", label: "Event", Icon: EventOutlinedIcon },
  { id: "calendar", label: "Calendar", Icon: CalendarMonthOutlinedIcon },
  { id: "history", label: "History", Icon: HistoryOutlinedIcon },

  // Knowledge and configuration
  { id: "book", label: "Rulebook", Icon: MenuBookOutlinedIcon },
  { id: "learning", label: "Learning", Icon: SchoolOutlinedIcon },
  { id: "strategy", label: "Strategy", Icon: PsychologyOutlinedIcon },
  { id: "tools", label: "Tools", Icon: BuildOutlinedIcon },
  { id: "settings", label: "Settings", Icon: TuneOutlinedIcon },

  // Gaming
  { id: "dice", label: "Dice", Icon: CasinoOutlinedIcon },
  { id: "gaming", label: "Gaming", Icon: SportsEsportsOutlinedIcon },
] as const;

export function getGroupIcon(id?: string | null) {
  return GROUP_ICONS.find((icon) => icon.id === id) ?? GROUP_ICONS[0];
}
