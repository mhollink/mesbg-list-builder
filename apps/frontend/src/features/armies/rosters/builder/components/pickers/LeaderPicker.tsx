import { UnitPicker } from "./UnitPicker.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface LeaderPickerProps {
  open: boolean;
  profiles: readonly LocalizedArmyListProfile[];
  onClose: () => void;
  onSelect: (profile: LocalizedArmyListProfile) => Promise<void>;
}

export function LeaderPicker(props: LeaderPickerProps) {
  return <UnitPicker {...props} title="Select leader" />;
}
