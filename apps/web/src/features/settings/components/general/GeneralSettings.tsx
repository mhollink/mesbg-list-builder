import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks.ts";
import { SUPPORTED_LANGUAGES } from "../../state/general/generalSettings.constants";
import type { AppLanguage } from "../../state/general/generalSettings.types";
import { setLanguage } from "../../state/general//generalSettingsSlice";

export function GeneralSettings() {
  const { t } = useTranslation("settings");
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.settings.language);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          {t("general.title")}
        </Typography>

        <Typography color="textSecondary">
          {t("general.description")}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: 480,
          }}
        >
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              {t("general.language.title")}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              {t("general.language.description")}
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel id="language-label">
              {t("general.language.label")}
            </InputLabel>

            <Select
              labelId="language-label"
              value={language}
              label={t("general.language.label")}
              onChange={(event) => {
                dispatch(setLanguage(event.target.value as AppLanguage));
              }}
            >
              {SUPPORTED_LANGUAGES.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>

            <FormHelperText>{t("general.language.helperText")}</FormHelperText>
          </FormControl>
        </Stack>
      </Stack>
    </Stack>
  );
}
