import { UnitPicker } from "./UnitPicker.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface FollowerPickerProps {
  open: boolean;
  profiles: readonly LocalizedArmyListProfile[];
  onClose: () => void;
  onSelect: (profile: LocalizedArmyListProfile) => Promise<void>;
}

export function FollowerPicker(props: FollowerPickerProps) {
  return <UnitPicker {...props} title="Add follower" />;
}
