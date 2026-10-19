import { useState } from "react";
import Drawer from "@mui/material/Drawer";

import { UnitConfigurationView } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/UnitConfigurationView.tsx";
import { UnitSelectionView } from "~/features/armies/rosters/builder/components/pickers/unit-picker/UnitSelectionView.tsx";
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

  onClose: () => void;
  onSelect: (profile: LocalizedArmyListProfile) => Promise<void>;
}

export function UnitPicker({
  open,
  title,
  profiles,
  onClose,
  onSelect,
}: UnitPickerProps) {
  const [view, setView] = useState<PickerView>({ type: "selection" });

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
          profile={view.profile}
          onBack={handleBack}
          onClose={onClose}
        />
      )}
    </Drawer>
  );
}
