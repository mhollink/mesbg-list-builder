import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  getEffectiveUnitOptions,
  getUnitCost,
  getUnitTotalCost,
} from "../../domain/option-rules.ts";
import type { BuilderUnit } from "../../domain/roster.types.ts";
import { ProfileAvatar } from "~/components/profile-avatar/ProfileAvatar.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface UnitCardProps {
  unit: BuilderUnit;
  profile: LocalizedArmyListProfile;
  collapsed?: boolean;
  readonly?: boolean;
  showUnitCost?: boolean;
  draggable?: boolean;
  controls?: ReactNode;
  onOpenProfile: () => void;
}

export function UnitCard({
  unit,
  profile,
  collapsed = false,
  readonly = false,
  showUnitCost = false,
  draggable = false,
  controls,
  onOpenProfile,
}: UnitCardProps) {
  const effectiveOptions = getEffectiveUnitOptions(unit, profile);
  const unitCost = getUnitCost(unit, profile);
  const totalCost = getUnitTotalCost(unit, profile);
  const unique = profile.profile.unitTypes.includes("unique");

  return (
    <Paper variant="outlined">
      <Stack spacing={1} sx={{ p: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            pr: draggable ? 4 : 0,
          }}
        >
          <ProfileAvatar profileId={profile.profileId} />
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
              useFlexGap
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Stack direction="column" spacing={0}>
                <Typography
                  component="button"
                  type="button"
                  onClick={onOpenProfile}
                  sx={{
                    p: 0,
                    border: 0,
                    bgcolor: "transparent",
                    color: "text.primary",
                    font: "inherit",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "start",

                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {!unique && <span>{unit.quantity} &times;</span>}{" "}
                  {profile.profile.name}
                </Typography>
                <Typography color="textSecondary">
                  {effectiveOptions.map((option) => option.name).join(" · ")}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "row", sm: "column" }}
                spacing={{ xs: 1, sm: 0 }}
                sx={{
                  textAlign: {
                    xs: "left",
                    sm: "right",
                  },
                  flexShrink: 0,
                  alignItems: "end",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {totalCost} pts
                </Typography>
                {showUnitCost && unit.quantity > 1 && (
                  <Typography color="textSecondary">
                    {unitCost} pts each
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {controls && !readonly && (
          <Collapse in={!collapsed}>
            <Stack spacing={1}>
              <Divider />
              {controls}
            </Stack>
          </Collapse>
        )}
      </Stack>
    </Paper>
  );
}
