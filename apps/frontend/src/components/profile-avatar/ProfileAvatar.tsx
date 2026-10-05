import { Box, type BoxProps } from "@mui/material";

import avatarSprite from "~/generated/assets/avatars.webp";
import avatarMap from "~/generated/assets/avatars-map.json";

interface AvatarMap {
  cellSize: number;
  width: number;
  height: number;
  icons: Record<string, [number, number]>;
}

const avatars = avatarMap as AvatarMap;

interface ProfileAvatarProps {
  profileId: string;
  size?: number;
  sx?: BoxProps["sx"];
}

export function ProfileAvatar({
  profileId,
  size = 48,
  sx = {},
}: ProfileAvatarProps) {
  const position = avatars.icons[profileId];

  if (!position) {
    return null;
  }

  const [x, y] = position;
  const scale = size / avatars.cellSize;

  return (
    <Box
      role="img"
      aria-label={profileId}
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        backgroundImage: `url(${avatarSprite})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${avatars.width * scale}px ${avatars.height * scale}px`,
        backgroundPosition: `${-x * scale}px ${-y * scale}px`,
        ...sx,
      }}
    />
  );
}
