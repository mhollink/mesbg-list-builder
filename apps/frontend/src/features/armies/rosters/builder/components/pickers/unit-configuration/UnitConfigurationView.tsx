import { useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getUnitTotalCost } from "../../../domain/option-rules.ts";
import type { BuilderUnit } from "../../../domain/roster.types.ts";
import { UnitConfigurationHeader } from "./UnitConfigurationHeader.tsx";
import { UnitLoadoutSelection } from "./UnitLoadoutSelection.tsx";
import { UnitSummary } from "./UnitSummary.tsx";
import {
  getEquipmentSelectionLimits,
  getRemainingWarbandSlots,
  normalizeOptionIds,
  toDraftUnit,
  toggleUnitOption,
  type UnitLoadout,
} from "./unit-configuration.utils.ts";
import type { WarbandCapacity } from "~/features/armies/rosters/builder/domain/warband-rules.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export interface UnitConfigurationViewProps {
  profile: LocalizedArmyListProfile;
  unit?: BuilderUnit;
  capacity?: WarbandCapacity;
  onBack?: () => void;
  onClose: () => void;
  onSave: (loadout: UnitLoadout) => Promise<void>;
}

export function UnitConfigurationView({
  profile,
  unit,
  capacity,
  onBack,
  onClose,
  onSave,
}: UnitConfigurationViewProps) {
  const editing = unit !== undefined;
  const isHero = profile.profile.stats.type === "hero";
  const [optionIds, setOptionIds] = useState<string[]>(() =>
    normalizeOptionIds(profile, unit?.optionIds ?? []),
  );
  const [quantity, setQuantity] = useState(isHero ? 1 : (unit?.quantity ?? 1));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const savingRef = useRef(false);

  const equipmentLimits = getEquipmentSelectionLimits(profile, optionIds);
  const current: UnitLoadout = {
    optionIds,
    quantity: isHero ? 1 : quantity,
  };
  const points = getUnitTotalCost(toDraftUnit(profile, current), profile);
  const previousPoints = unit ? getUnitTotalCost(unit, profile) : 0;
  const pointsDifference = points - previousPoints;
  const remainingSlots = isHero
    ? undefined
    : getRemainingWarbandSlots(capacity, current.quantity, unit?.quantity ?? 0);

  function toggleOption(optionId: string, checked: boolean) {
    setOptionIds((previous) =>
      toggleUnitOption(profile, previous, optionId, checked),
    );
  }

  async function submit() {
    if (savingRef.current || !equipmentLimits.valid || current.quantity < 1)
      return;

    savingRef.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      await onSave(current);
    } catch {
      setSaveError(true);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <Stack sx={{ height: "100%", minHeight: 0 }}>
      <UnitConfigurationHeader
        profile={profile}
        onBack={onBack}
        onClose={onClose}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          pointerEvents: saving ? "none" : "auto",
        }}
      >
        <UnitSummary profile={profile} />
        <UnitLoadoutSelection
          options={profile.options}
          selectedOptionIds={optionIds}
          quantity={current.quantity}
          showQuantity={!isHero}
          remainingSlots={remainingSlots}
          disabled={saving}
          onToggleOption={toggleOption}
          onChangeQuantity={(next) => setQuantity(Math.max(1, next))}
        />
        {!equipmentLimits.valid && (
          <Alert severity="warning" sx={{ m: 2 }}>
            {equipmentLimits.maximum === Number.POSITIVE_INFINITY
              ? `Select at least ${equipmentLimits.minimum} equipment option(s).`
              : `Select between ${equipmentLimits.minimum} and ${equipmentLimits.maximum} equipment option(s).`}
          </Alert>
        )}
      </Box>

      <Stack
        spacing={1.5}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        {saveError && (
          <Alert severity="error" role="alert">
            The configuration could not be saved. Your changes are still here.
          </Alert>
        )}
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>Total points</Typography>
          <Typography sx={{ fontWeight: 700 }}>{points} pts</Typography>
        </Stack>
        {editing && (
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="textSecondary">Change</Typography>
            <Typography color="textSecondary">
              {pointsDifference > 0 ? "+" : ""}
              {pointsDifference} pts
            </Typography>
          </Stack>
        )}
        <Button
          variant="contained"
          startIcon={editing ? <SaveIcon /> : <AddIcon />}
          disabled={saving || !equipmentLimits.valid || current.quantity < 1}
          onClick={() => void submit()}
        >
          {saving
            ? "Saving..."
            : editing
              ? "Save changes"
              : isHero
                ? "Add hero"
                : `Add ${current.quantity} followers`}
        </Button>
      </Stack>
    </Stack>
  );
}
