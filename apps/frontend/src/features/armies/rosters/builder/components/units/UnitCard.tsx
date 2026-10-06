import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getUnitCost, getUnitTotalCost } from "../../domain/option-rules.ts";
import type { BuilderUnit } from "../../domain/roster.types.ts";
import { UnitHeroicStats } from "./UnitHeroicStats.tsx";
import { UnitOptions } from "./UnitOptions.tsx";
import { ProfileAvatar } from "~/components/profile-avatar/ProfileAvatar.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface UnitCardProps {
  unit: BuilderUnit;
  profile: LocalizedArmyListProfile;

  readonly?: boolean;
  showUnitCost?: boolean;

  controls?: ReactNode;

  onOpenProfile: () => void;
  onOptionsChange: (optionIds: string[]) => void;
}

export function UnitCard({
  unit,
  profile,
  readonly = false,
  showUnitCost = false,
  controls,
  onOpenProfile,
  onOptionsChange,
}: UnitCardProps) {
  const unitCost = getUnitCost(unit, profile);

  const totalCost = getUnitTotalCost(unit, profile);

  return (
    <Paper variant="outlined">
      <Stack spacing={2} sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ alignItems: "flex-start" }}
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
              <Box>
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

                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {profile.profile.name}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ mt: 0.5, alignItems: "center", flexWrap: "wrap" }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {profile.tierName}
                  </Typography>

                  <UnitHeroicStats profile={profile.profile} />
                </Stack>
              </Box>

              <Box
                sx={{
                  textAlign: {
                    xs: "left",
                    sm: "right",
                  },
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {totalCost} pts
                </Typography>

                {showUnitCost && unit.quantity > 1 && (
                  <Typography variant="caption" color="textSecondary">
                    {unitCost} pts each
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>

        {profile.options.length > 0 && (
          <>
            <Divider />

            <UnitOptions
              unit={unit}
              profile={profile}
              disabled={readonly}
              onChange={onOptionsChange}
            />
          </>
        )}

        {controls && (
          <>
            <Divider />
            {controls}
          </>
        )}
      </Stack>
    </Paper>
  );
}
