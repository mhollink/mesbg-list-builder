import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { GROUP_ICONS, getGroupIcon } from "./group-icons.ts";

interface GroupIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function GroupIconPicker({ value, onChange }: GroupIconPickerProps) {
  return (
    <Autocomplete
      disableClearable
      options={GROUP_ICONS}
      value={getGroupIcon(value)}
      onChange={(_, option) => onChange(option.id)}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderOption={(props, option) => {
        const Icon = option.Icon;

        return (
          <Box
            component="li"
            {...props}
            key={option.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Icon fontSize="small" />
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => <TextField {...params} label="Group icon" />}
    />
  );
}
