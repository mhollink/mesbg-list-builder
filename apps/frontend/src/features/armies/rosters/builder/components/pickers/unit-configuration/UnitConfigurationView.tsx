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
  createWarriorDrafts,
  getEquipmentSelectionLimits,
  getRemainingWarbandSlots,
  normalizeOptionIds,
  toDraftUnit,
  toggleUnitOption,
  type UnitLoadout,
} from "./unit-configuration.utils.ts";
import { WarriorLoadoutSelection } from "./WarriorLoadoutSelection.tsx";
import type { WarbandCapacity } from "~/features/armies/rosters/builder/domain/warband-rules.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export interface UnitConfigurationViewProps {
  profile: LocalizedArmyListProfile;
  /** Editing a hero still targets exactly one roster entry. */
  unit?: BuilderUnit;
  /** Editing warriors changes only the explicitly provided same-profile entries. */
  existingUnits?: readonly BuilderUnit[];
  capacity?: WarbandCapacity;
  onBack?: () => void;
  onClose: () => void;
  onSave: (loadouts: UnitLoadout[]) => Promise<void>;
}

export function UnitConfigurationView({
  profile,
  unit,
  existingUnits,
  capacity,
  onBack,
  onClose,
  onSave,
}: UnitConfigurationViewProps) {
  const editing = unit !== undefined || existingUnits !== undefined;
  const isHero = profile.profile.stats.type === "hero";
  const previousUnits = isHero ? (unit ? [unit] : []) : (existingUnits ?? []);
  const [heroOptionIds, setHeroOptionIds] = useState<string[]>(() =>
    normalizeOptionIds(profile, unit?.optionIds ?? []),
  );
  const [warriorDrafts, setWarriorDrafts] = useState(() =>
    createWarriorDrafts(profile, existingUnits),
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const savingRef = useRef(false);

  const heroLimits = getEquipmentSelectionLimits(profile, heroOptionIds);
  const loadouts: UnitLoadout[] = isHero
    ? [{ optionIds: heroOptionIds, quantity: 1 }]
    : warriorDrafts
        .filter((draft) => draft.quantity > 0)
        .map(({ optionIds, quantity }) => ({ optionIds, quantity }));
  const models = loadouts.reduce((sum, loadout) => sum + loadout.quantity, 0);
  const points = loadouts.reduce(
    (sum, loadout) =>
      sum + getUnitTotalCost(toDraftUnit(profile, loadout), profile),
    0,
  );
  const previousPoints = previousUnits.reduce(
    (sum, previous) => sum + getUnitTotalCost(previous, profile),
    0,
  );
  const previousModels = previousUnits.reduce(
    (sum, previous) => sum + previous.quantity,
    0,
  );
  const remainingSlots = isHero
    ? undefined
    : getRemainingWarbandSlots(capacity, models, previousModels);

  function toggleHeroOption(optionId: string, checked: boolean) {
    setHeroOptionIds((previous) =>
      toggleUnitOption(profile, previous, optionId, checked),
    );
  }

  function changeWarriorQuantity(key: string, quantity: number) {
    setWarriorDrafts((previous) =>
      previous.map((draft) =>
        draft.key === key
          ? { ...draft, quantity: Math.max(0, quantity) }
          : draft,
      ),
    );
  }

  async function submit() {
    if (
      savingRef.current ||
      (isHero && !heroLimits.valid) ||
      (!editing && models === 0)
    )
      return;

    savingRef.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      await onSave(loadouts);
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
        {!isHero && editing && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 2, pt: 1 }}
          >
            Editing all configurations of this warrior in the selected warband.
          </Typography>
        )}
        {isHero ? (
          <>
            <UnitLoadoutSelection
              options={profile.options}
              selectedOptionIds={heroOptionIds}
              quantity={1}
              showQuantity={false}
              disabled={saving}
              onToggleOption={toggleHeroOption}
              onChangeQuantity={() => undefined}
            />
            {!heroLimits.valid && (
              <Alert severity="warning" sx={{ m: 2 }}>
                {heroLimits.maximum === Number.POSITIVE_INFINITY
                  ? `Select at least ${heroLimits.minimum} equipment option(s).`
                  : `Select between ${heroLimits.minimum} and ${heroLimits.maximum} equipment option(s).`}
              </Alert>
            )}
          </>
        ) : (
          <WarriorLoadoutSelection
            profile={profile}
            drafts={warriorDrafts}
            disabled={saving}
            onChangeQuantity={changeWarriorQuantity}
          />
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
            The configurations could not be saved. No changes were applied.
            Check the latest warband data and try again.
          </Alert>
        )}
        {!isHero && remainingSlots !== undefined && (
          <Typography
            variant="caption"
            color={remainingSlots < 0 ? "error" : "text.secondary"}
          >
            {remainingSlots < 0
              ? `${-remainingSlots} over warband capacity`
              : `${remainingSlots} free ${remainingSlots === 1 ? "slot" : "slots"} in warband`}
          </Typography>
        )}
        {!isHero && (
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography>Models {editing ? "configured" : "to add"}</Typography>
            <Typography fontWeight={700}>{models}</Typography>
          </Stack>
        )}
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>Total points</Typography>
          <Typography fontWeight={700}>{points} pts</Typography>
        </Stack>
        {editing && (
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="textSecondary">Change</Typography>
            <Typography color="textSecondary">
              {points - previousPoints > 0 ? "+" : ""}
              {points - previousPoints} pts
            </Typography>
          </Stack>
        )}
        <Button
          variant="contained"
          startIcon={editing ? <SaveIcon /> : <AddIcon />}
          disabled={
            saving ||
            (isHero && !heroLimits.valid) ||
            (!editing && models === 0)
          }
          onClick={() => void submit()}
        >
          {saving
            ? "Saving..."
            : editing
              ? "Save changes"
              : isHero
                ? "Add hero"
                : `Add ${models} followers`}
        </Button>
      </Stack>
    </Stack>
  );
}
