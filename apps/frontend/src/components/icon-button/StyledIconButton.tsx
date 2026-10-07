import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import { alpha, type PaletteColor, styled } from "@mui/material/styles";

import { tokenize } from "~/theme/createAppTheme";

type ActionTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "accent"
  | "highlight";

interface StyledIconButtonProps extends IconButtonProps {
  tone?: ActionTone;
  filled?: boolean;
}

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "tone" && prop !== "filled",
})<StyledIconButtonProps>(({ theme, tone, filled = false }) => {
  const palette: PaletteColor = tone ? theme.palette[tone] : tokenize("#333");

  return {
    borderRadius: theme.shape.borderRadius,
    width: 32,
    height: 32,

    color: filled ? palette.contrastText : palette.main,

    backgroundColor: filled ? palette.main : alpha(palette.main, 0.1),

    transition: theme.transitions.create(["background-color", "color"]),

    "&:hover": {
      backgroundColor: filled ? palette.dark : alpha(palette.main, 0.2),
    },

    "&.Mui-disabled": {
      color: theme.palette.action.disabled,
      backgroundColor: theme.palette.action.disabledBackground,
    },
  };
});

export default StyledIconButton;
