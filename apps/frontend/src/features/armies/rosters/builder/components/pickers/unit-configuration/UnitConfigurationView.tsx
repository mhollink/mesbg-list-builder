import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { UnitConfigurationHeader } from "./UnitConfigurationHeader.tsx";
import { UnitSummary } from "./UnitSummary.tsx";
import { UnitLoadoutSelection } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/UnitLoadoutSelection.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export interface UnitConfigurationViewProps {
  profile: LocalizedArmyListProfile;
  onBack: () => void;
  onClose: () => void;
}

export function UnitConfigurationView({
  profile,
  onBack,
  onClose,
}: UnitConfigurationViewProps) {
  const allowsEmptyLoadout = (profile.profile.optionLimits?.min ?? 0) === 0;

  const [loadouts, setLoadouts] = useState({
    ...(allowsEmptyLoadout
      ? {
          none: {
            name: "No additional equipment",
            pp: 0,
            quantity: 0,
          },
        }
      : {}),
    ...Object.fromEntries(
      profile.options
        .sort((a, b) => a.points - b.points)
        .map((option) => [
          option.id,
          {
            name: option.name,
            pp: option.points, // points per ..
            quantity: 0,
          },
        ]),
    ),
  });

  const [models, points] = Object.values(loadouts)
    .map((loadout) => [loadout.quantity, loadout.pp])
    .reduce(
      (sum, loadout) => [
        sum[0] + loadout[0],
        sum[1] + loadout[0] * (loadout[1] + profile.profile.points),
      ],
      [0, 0],
    );

  function handleChangeQuantity(option: string, quantity: number) {
    setLoadouts({
      ...loadouts,
      [option]: {
        ...loadouts[option],
        quantity,
      },
    });
  }

  return (
    <Stack>
      <UnitConfigurationHeader
        profile={profile}
        onBack={onBack}
        onClose={onClose}
      />
      <UnitSummary profile={profile} />
      <UnitLoadoutSelection
        loadouts={loadouts}
        handleChangeQuantity={handleChangeQuantity}
      />

      <Stack sx={{ p: 2, my: 2 }} spacing={1}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>Models to add</Typography>
          <Typography sx={{ fontWeight: 700 }}>{models}</Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>Total points</Typography>
          <Typography sx={{ fontWeight: 700 }}>{points}</Typography>
        </Stack>
      </Stack>

      <Stack sx={{ px: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log("submit")}
        >
          Add {models} followers
        </Button>
      </Stack>
    </Stack>
  );
}
