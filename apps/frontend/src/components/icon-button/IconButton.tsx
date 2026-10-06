import IconButton from "@mui/material/IconButton";
import type {MouseEventHandler, PropsWithChildren} from "react";

export type SquareIconButtonProps = {
  color: string;
  onClick: MouseEventHandler;
  iconSize?: string;
  iconPadding?: string;
  disabled?: boolean;
};

export const IconButtonComponent = (
  {
    color,
    children,
    disabled,
    iconPadding = "1.5",
    iconSize = "1rem",
    onClick
  }: PropsWithChildren<SquareIconButtonProps>
) => {
  // TODO: Make colors come from theme instead of hardcoding.
  // TODO: Adapt hover and icon color on chosen theme color.
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderRadius: 2,
        p: iconPadding,
        // color: iconColor,
        fontSize: iconSize,
        backgroundColor: color
        // "&:hover": {
        //   backgroundColor: theme => lighten(theme.appColors[color], .5)
        // },
      }}
    >
      {children}
    </IconButton>
  );
};

export default IconButtonComponent;
