import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "14ch",
      "&:focus": {
        width: "25ch",
      },
    },
  },
}));
