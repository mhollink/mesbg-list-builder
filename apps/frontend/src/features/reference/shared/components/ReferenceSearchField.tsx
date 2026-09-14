import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

export function ReferenceSearchField({
  search,
  onSearchChange,
  placeholder,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <Box
      sx={{
        px: {
          xs: 2,
          md: 3,
        },
        pt: 2,
      }}
    >
      <TextField
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholder}
        fullWidth
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
