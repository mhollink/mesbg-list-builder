import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { RuleTranslationConfirmationDialog } from "./RuleTranslationConfirmationDialog";
import { useAppDispatch, useAppSelector } from "~/app/store/hooks.ts";
import { setTranslatedGameRules } from "~/features/settings/state/general/generalSettingsSlice.ts";

export function RuleTranslationSetting() {
  const { t, i18n } = useTranslation("settings");
  const dispatch = useAppDispatch();

  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const locale = getBaseLanguage(i18n.resolvedLanguage);
  const canTranslate = locale !== "en";

  const translatedRulesEnabled = useAppSelector(
    (state) => state.settings.translatedGameRules === true,
  );

  const handleChange = (checked: boolean) => {
    if (!checked) {
      dispatch(setTranslatedGameRules(false));
      return;
    }

    setConfirmationOpen(true);
  };

  const handleConfirm = () => {
    dispatch(setTranslatedGameRules(true));
    setConfirmationOpen(false);
  };

  return (
    <>
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={canTranslate && translatedRulesEnabled}
              disabled={!canTranslate}
              onChange={(_, checked) => handleChange(checked)}
            />
          }
          label={
            <Stack>
              <Typography>{t("rulesTranslation.label")}</Typography>

              <Typography variant="body2" color="textSecondary">
                {canTranslate
                  ? t("rulesTranslation.description")
                  : t("rulesTranslation.englishDescription")}
              </Typography>
            </Stack>
          }
        />
      </Stack>

      <RuleTranslationConfirmationDialog
        open={confirmationOpen}
        onCancel={() => setConfirmationOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function getBaseLanguage(locale?: string): string {
  return locale?.split("-")[0] ?? "en";
}
