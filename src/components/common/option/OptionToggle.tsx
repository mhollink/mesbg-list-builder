import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Option, Unit } from "../../../types/unit.ts";
import { arraysIntersect } from "../../../utils/array.ts";
import { CustomSwitch as Switch } from "../switch/CustomSwitch.tsx";

export const OptionToggle = ({
  warbandId,
  unit,
  option,
  selectable,
  updateState,
}: {
  warbandId: string;
  unit: Unit;
  option: Option;
  selectable: boolean;
  updateState: (
    warbandId: string,
    unitId: string,
    update: Partial<Unit>,
  ) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const hasCommonOptionType = (optA, optB) => {
    const optATypes = optA.type.split(",").map((x) => x.trim());
    const optBTypes = optB.type.split(",").map((x) => x.trim());
    return arraysIntersect(optATypes, optBTypes);
  };

  const handleToggle = () => {
    updateState(warbandId, unit.id, {
      options: unit.options.map((o) => {
        if (option.type === "mount" && o.option === "Lance") {
          if (o.opt_quantity === 1 && option.opt_quantity === 1) {
            return {
              ...o,
              opt_quantity: 0,
            };
          }
        }
        if (option.option_id !== o.option_id) {
          return {
            ...o,
            opt_quantity:
              option.type !== null &&
              o.type !== null &&
              hasCommonOptionType(option, o)
                ? 0 // toggles off same-type options.
                : o.opt_quantity,
          };
        }
        return {
          ...o,
          opt_quantity: o.opt_quantity === 1 ? 0 : 1,
        };
      }),
    });
  };

  return (
    <FormControlLabel
      sx={{ display: "block" }}
      control={
        <Switch
          id={`switch-${warbandId}-${unit.id}-${option.option.replaceAll(" ", "-")}`}
          checked={option.opt_quantity === 1}
          disabled={!selectable}
          onChange={handleToggle}
          name={option.option}
          sx={{ my: isMobile ? 0 : -2 }}
        />
      }
      label={option.option + " (" + option.points + " points)"}
    />
  );
};
