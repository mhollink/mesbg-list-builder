import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import type { BuilderUnit } from "../../domain/roster.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface UnitOptionsProps {
  unit: BuilderUnit;
  profile: LocalizedArmyListProfile;
  disabled: boolean;

  onChange: (optionIds: string[]) => void;
}

export function UnitOptions({
  unit,
  profile,
  disabled,
  onChange,
}: UnitOptionsProps) {
  if (profile.options.length === 0) {
    return null;
  }

  const toggleOption = (optionId: string, checked: boolean) => {
    const current = new Set(unit.optionIds);

    if (checked) {
      current.add(optionId);
    } else {
      current.delete(optionId);
    }

    onChange([...current]);
  };

  return (
    <Stack spacing={0.5}>
      {profile.options.map((option) => {
        const preselected = option.state === "preselected";

        const checked = preselected || unit.optionIds.includes(option.id);

        return (
          <Stack
            key={option.id}
            direction="row"
            spacing={2}
            useFlexGap
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Switch
                size="small"
                checked={checked}
                disabled={disabled || preselected}
                onChange={(_, checked) => toggleOption(option.id, checked)}
              />

              <Typography variant="body2">{option.name}</Typography>
            </Stack>

            {option.points !== undefined && option.points !== 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ flexShrink: 0 }}
              >
                +{option.points} pts
              </Typography>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
