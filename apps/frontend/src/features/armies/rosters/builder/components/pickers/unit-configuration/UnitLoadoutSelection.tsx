import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { UnitLoadoutQuantityControls } from "./UnitLoadoutQuantityControls.tsx";
import { isSpecialUpgrade } from "./unit-configuration.utils.ts";
import Switch from "~/components/switch";
import type { LocalizedArmyListProfileOption } from "~/features/reference/army-lists/army-lists.types.ts";

interface UnitLoadoutSelectionProps {
  options: readonly LocalizedArmyListProfileOption[];
  selectedOptionIds: readonly string[];
  quantity: number;
  showQuantity: boolean;
  disabled?: boolean;
  onToggleOption: (optionId: string, checked: boolean) => void;
  onChangeQuantity: (quantity: number) => void;
  remainingSlots?: number;
}

export function UnitLoadoutSelection({
  options,
  selectedOptionIds,
  quantity,
  showQuantity,
  disabled = false,
  onToggleOption,
  onChangeQuantity,
  remainingSlots,
}: UnitLoadoutSelectionProps) {
  const upgrades = options.filter(isSpecialUpgrade);
  const equipment = options.filter((option) => !isSpecialUpgrade(option));
  const compulsoryUpgrade = upgrades.find(
    (option) => option.state === "preselected",
  );

  const renderOptions = (
    title: string,
    entries: readonly LocalizedArmyListProfileOption[],
  ) =>
    entries.length > 0 && (
      <>
        <Stack spacing={1} sx={{ p: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {entries.map((option) => {
            const preselected = option.state === "preselected";
            const checked =
              preselected || selectedOptionIds.includes(option.id);
            return (
              <Stack
                key={option.id}
                direction="row"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: checked ? "action.selected" : "transparent",
                }}
              >
                <FormControlLabel
                  sx={{ m: 0, minWidth: 0 }}
                  control={
                    <Switch
                      checked={checked}
                      disabled={
                        disabled ||
                        preselected ||
                        (isSpecialUpgrade(option) &&
                          compulsoryUpgrade !== undefined)
                      }
                      onChange={(_, next) => onToggleOption(option.id, next)}
                    />
                  }
                  label={option.name}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1, whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  {preselected
                    ? "Included"
                    : option.points === undefined
                      ? ""
                      : `${option.points > 0 ? "+" : ""}${option.points} pts`}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
        <Divider />
      </>
    );

  return (
    <>
      {renderOptions("Special upgrades", upgrades)}
      {renderOptions("Equipment", equipment)}
      {showQuantity && (
        <>
          <Stack
            direction="row"
            sx={{ p: 2, alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction="column">
              <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                Quantity
              </Typography>
              {remainingSlots !== undefined && (
                <Typography
                  variant="caption"
                  color={remainingSlots < 0 ? "error" : "textSecondary"}
                >
                  {remainingSlots < 0
                    ? `${-remainingSlots} over warband capacity`
                    : `${remainingSlots} free ${
                        remainingSlots === 1 ? "slot" : "slots"
                      } in warband`}
                </Typography>
              )}
            </Stack>
            <UnitLoadoutQuantityControls
              quantity={quantity}
              minQuantity={1}
              disabled={disabled}
              onChange={onChangeQuantity}
            />
          </Stack>
          <Divider />
        </>
      )}
    </>
  );
}
