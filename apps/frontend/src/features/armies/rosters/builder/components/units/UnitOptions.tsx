import { useId } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BuilderUnit } from "../../domain/roster.types.ts";
import Switch from "~/components/switch/Switch";
import type {
  LocalizedArmyListProfile,
  LocalizedArmyListProfileOption,
} from "~/features/reference/army-lists/army-lists.types.ts";

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
    <Stack spacing={-0.5}>
      {profile.options.map((option) => (
        <UnitOption
          key={option.id}
          option={option}
          unit={unit}
          disabled={disabled}
          toggleOption={toggleOption}
        />
      ))}
    </Stack>
  );
}

interface UnitOptionProps {
  option: LocalizedArmyListProfileOption;
  unit: BuilderUnit;
  disabled: boolean;
  toggleOption: (optionId: string, checked: boolean) => void;
}

function UnitOption({ option, unit, disabled, toggleOption }: UnitOptionProps) {
  const id = useId();
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
          id={id}
          checked={checked}
          disabled={disabled || preselected}
          onChange={(_, checked) => toggleOption(option.id, checked)}
        />

        <Typography
          component="label"
          htmlFor={id}
          variant="body2"
          sx={{ pr: 2, cursor: "pointer" }}
        >
          {option.name}
        </Typography>
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
}
