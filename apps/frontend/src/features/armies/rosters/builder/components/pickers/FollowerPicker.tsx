import { UnitPicker } from "./UnitPicker.tsx";
import type { UnitLoadout } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/unit-configuration.utils.ts";
import type { BuilderUnit } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface FollowerPickerProps {
  open: boolean;
  profiles: readonly LocalizedArmyListProfile[];
  initialProfile?: LocalizedArmyListProfile;
  existingUnits?: readonly BuilderUnit[];
  onSave: (
    profile: LocalizedArmyListProfile,
    loadouts: UnitLoadout[],
  ) => Promise<void>;
}

export function FollowerPicker(props: FollowerPickerProps) {
  return <UnitPicker {...props} title="Add follower" />;
}
