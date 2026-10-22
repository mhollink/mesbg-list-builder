import { UnitPicker } from "./UnitPicker.tsx";
import type { UnitLoadout } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/unit-configuration.utils.ts";
import type { BuilderUnit } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface LeaderPickerProps {
  open: boolean;
  profiles: readonly LocalizedArmyListProfile[];
  initialProfile?: LocalizedArmyListProfile;
  existingUnits?: readonly BuilderUnit[];
  continuous?: boolean;
  onSave: (
    profile: LocalizedArmyListProfile,
    loadouts: UnitLoadout[],
  ) => Promise<void>;
}

export function LeaderPicker(props: LeaderPickerProps) {
  return <UnitPicker {...props} title="Select leader" />;
}
