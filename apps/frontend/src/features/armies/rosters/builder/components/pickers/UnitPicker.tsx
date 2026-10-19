import { useState } from "react";
import Drawer from "@mui/material/Drawer";

import { UnitConfigurationView } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/UnitConfigurationView.tsx";
import type { UnitLoadout } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/unit-configuration.utils.ts";
import { UnitSelectionView } from "~/features/armies/rosters/builder/components/pickers/unit-picker/UnitSelectionView.tsx";
import type { BuilderUnit } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

type PickerView =
  | { type: "selection" }
  | {
      type: "configuration";
      profile: LocalizedArmyListProfile;
    };

interface UnitPickerProps {
  open: boolean;
  title: string;
  profiles: readonly LocalizedArmyListProfile[];
  initialProfile?: LocalizedArmyListProfile;
  existingUnits?: readonly BuilderUnit[];
  onSave: (
    profile: LocalizedArmyListProfile,
    loadouts: UnitLoadout[],
  ) => Promise<void>;
  onClose: () => void;
}

export function UnitPicker({
  open,
  title,
  profiles,
  initialProfile,
  existingUnits,
  onClose,
  onSave,
}: UnitPickerProps) {
  const [view, setView] = useState<PickerView>(() =>
    initialProfile
      ? { type: "configuration", profile: initialProfile }
      : { type: "selection" },
  );

  function handleSelect(profile: LocalizedArmyListProfile) {
    setView({
      type: "configuration",
      profile,
    });
  }

  function handleBack() {
    setView({ type: "selection" });
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 480,
            },
            maxWidth: "100%",
          },
        },
      }}
    >
      {view.type === "selection" ? (
        <UnitSelectionView
          title={title}
          profiles={profiles}
          onSelect={handleSelect}
          onClose={onClose}
        />
      ) : (
        <UnitConfigurationView
          key={view.profile.id}
          profile={view.profile}
          existingUnits={existingUnits}
          onBack={initialProfile ? undefined : handleBack}
          onClose={onClose}
          onSave={(loadouts) => onSave(view.profile, loadouts)}
        />
      )}
    </Drawer>
  );
}
