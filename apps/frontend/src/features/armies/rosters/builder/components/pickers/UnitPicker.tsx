import Drawer from "@mui/material/Drawer";

import { UnitConfigurationView } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/UnitConfigurationView.tsx";
import type { UnitLoadout } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/unit-configuration.utils.ts";
import { UnitSelectionView } from "~/features/armies/rosters/builder/components/pickers/unit-picker/UnitSelectionView.tsx";
import type { BuilderUnit } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { WarbandCapacity } from "~/features/armies/rosters/builder/domain/warband-rules.ts";
import { useBuilderPickerHistory } from "~/features/armies/rosters/builder/hooks/useBuilderPickerHistory.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface UnitPickerProps {
  open: boolean;
  title: string;
  profiles: readonly LocalizedArmyListProfile[];
  initialProfile?: LocalizedArmyListProfile;
  unit?: BuilderUnit;
  existingUnits?: readonly BuilderUnit[];
  capacity?: WarbandCapacity;
  continuous?: boolean;
  onSave: (
    profile: LocalizedArmyListProfile,
    loadouts: UnitLoadout[],
  ) => Promise<void>;
}

export function UnitPicker({ open, ...flowProps }: UnitPickerProps) {
  const { close } = useBuilderPickerHistory();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 680 },
            maxWidth: "100%",
          },
        },
      }}
    >
      <UnitPickerFlow {...flowProps} open={open} />
    </Drawer>
  );
}

function UnitPickerFlow({
  open,
  title,
  profiles,
  initialProfile,
  unit,
  existingUnits,
  capacity,
  onSave,
  continuous,
}: UnitPickerProps) {
  const history = useBuilderPickerHistory();
  const selectedProfile =
    initialProfile ??
    profiles.find((profile) => profile.id === history.profileId);
  const matchingUnits = existingUnits?.filter(
    (candidate) => candidate.armyListProfileId === selectedProfile?.id,
  );
  const editingUnit =
    unit ??
    (selectedProfile?.profile.stats.type === "hero"
      ? matchingUnits?.[0]
      : undefined);

  async function handleSave(
    profile: LocalizedArmyListProfile,
    loadouts: UnitLoadout[],
  ) {
    await onSave(profile, loadouts);
    if (continuous) {
      // Each save adds one warband; stay in the leader selector for the next.
      if (history.profileId) history.back();
    } else {
      history.close();
    }
  }

  return selectedProfile === undefined ? (
    <UnitSelectionView
      title={title}
      profiles={profiles}
      onSelect={(profile) => history.configure(profile.id)}
      onQuickAdd={(profile) => {
        if (
          existingUnits?.some(
            (existing) => existing.armyListProfileId === profile.id,
          )
        ) {
          history.configure(profile.id);
          return Promise.resolve();
        }
        return handleSave(profile, [{ quantity: 1, optionIds: [] }]);
      }}
      onClose={history.close}
    />
  ) : (
    <UnitConfigurationView
      // The drawer stays mounted for animations, but reopening resets draft state.
      key={`${selectedProfile.id}:${editingUnit?.id ?? "new"}:${open ? "open" : "closed"}`}
      profile={selectedProfile}
      unit={editingUnit}
      existingUnits={
        selectedProfile.profile.stats.type === "hero"
          ? undefined
          : matchingUnits?.length
            ? matchingUnits
            : undefined
      }
      capacity={capacity}
      onBack={initialProfile ? undefined : history.back}
      onClose={history.close}
      onSave={(loadouts) => handleSave(selectedProfile, loadouts)}
    />
  );
}
