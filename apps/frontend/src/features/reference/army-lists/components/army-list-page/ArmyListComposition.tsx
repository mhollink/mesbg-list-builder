import { useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {
  createTierGroups,
  splitTierGroups,
} from "../../army-list-composition.utils.ts";
import type { LocalizedArmyListProfile } from "../../army-lists.types.ts";
import { ArmyListTier } from "./ArmyListTier.tsx";

interface ArmyListCompositionProps {
  profiles: LocalizedArmyListProfile[];
  onOpenProfile: (profileId: string) => void;
}

export function ArmyListComposition({
  profiles,
  onOpenProfile,
}: ArmyListCompositionProps) {
  const columns = useMemo(
    () => splitTierGroups(createTierGroups(profiles)),
    [profiles],
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: "repeat(2, minmax(0, 1fr))",
        },
        gap: {
          xs: 4,
          md: 8,
        },
        alignItems: "start",
      }}
    >
      <CompositionColumn groups={columns.left} onOpenProfile={onOpenProfile} />

      <CompositionColumn groups={columns.right} onOpenProfile={onOpenProfile} />
    </Box>
  );
}

interface CompositionColumnProps {
  groups: ReturnType<typeof createTierGroups>;
  onOpenProfile: (profileId: string) => void;
}

function CompositionColumn({ groups, onOpenProfile }: CompositionColumnProps) {
  return (
    <Stack sx={{ gap: 4 }}>
      {groups.map((group) => (
        <ArmyListTier
          key={group.tier}
          profiles={group.profiles}
          onOpenProfile={onOpenProfile}
        />
      ))}
    </Stack>
  );
}
