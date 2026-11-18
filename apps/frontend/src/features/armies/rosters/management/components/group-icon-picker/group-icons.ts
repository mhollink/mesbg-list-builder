import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

export const GROUP_ICONS = [
  { id: "folder", label: "Folder", Icon: FolderRoundedIcon },
  { id: "shield", label: "Shield", Icon: ShieldOutlinedIcon },
  { id: "trophy", label: "Trophy", Icon: EmojiEventsOutlinedIcon },
  { id: "community", label: "Community", Icon: GroupsOutlinedIcon },
  { id: "flag", label: "Flag", Icon: FlagOutlinedIcon },
  { id: "favorite", label: "Favorite", Icon: StarBorderOutlinedIcon },
] as const;

export function getGroupIcon(id?: string | null) {
  return GROUP_ICONS.find((icon) => icon.id === id) ?? GROUP_ICONS[0];
}
