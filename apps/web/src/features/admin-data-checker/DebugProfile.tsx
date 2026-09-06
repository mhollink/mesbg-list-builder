import { memo } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { DebugKeyword, DebugSection, DebugValue } from "./DebugSection";
import { DebugProfileRules } from "~/features/admin-data-checker/DebugProfileRules.tsx";
import { ProfileStats } from "~/features/reference/profiles/components/profile-drawer/ProfileStats.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";
import type { Rule } from "~/features/reference/rules/rules.types.ts";

function DebugProfile({
  profile,
  rules,
  checked,
  onCheckedChange,
}: {
  profile: LocalizedProfile;
  checked: boolean;
  onCheckedChange: (profile: string, checked: boolean) => void;
  rules: Map<string, Rule>;
}) {
  const { t } = useTranslation("game-data", { keyPrefix: "profiles" });

  return (
    <Paper
      id={`profile-${profile.profile}`}
      variant="outlined"
      sx={{
        overflow: "hidden",
        scrollMarginTop: 100,
        opacity: checked ? 0.35 : 1,
        transition: "opacity 150ms",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "100px minmax(0, 1fr) 150px",
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "action.hover",
            borderRight: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography
            variant="overline"
            color="textSecondary"
            sx={{ display: "block" }}
          >
            Page
          </Typography>

          <Typography variant="h4">{profile.source.page}</Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.66rem",
              textDecoration: "underline",
              textDecorationColor: (theme) => theme.palette.text.disabled,
            }}
          >
            {profile.profile}
          </Typography>
          <Typography variant="h5" component="h2">
            {profile.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {profile.originName}
          </Typography>
        </Box>

        <FormControlLabel
          sx={{ mr: 2 }}
          control={
            <Checkbox
              checked={checked}
              onChange={(event) =>
                onCheckedChange(profile.profile, event.target.checked)
              }
            />
          }
          label="Checked"
        />
      </Box>

      <Collapse title="data" in={!checked}>
        <ProfileStats stats={profile.stats} />

        <Box sx={{ p: 2 }}>
          <Stack spacing={1}>
            <DebugKeyword title="Points">
              <DebugValue value={[profile.points]} />
            </DebugKeyword>
            <DebugKeyword title="Race">
              <DebugValue value={profile.race} />
            </DebugKeyword>
            <DebugKeyword title="Factions">
              <DebugValue value={profile.factions} />
            </DebugKeyword>
            <DebugKeyword title="Unit type">
              <DebugValue value={profile.unitTypes} />
            </DebugKeyword>
            <DebugKeyword title="Base size">
              <DebugValue value={[profile.baseSize || "-"]} />
            </DebugKeyword>
            <DebugKeyword title="Wargear">
              <DebugValue value={profile.wargear} />
            </DebugKeyword>
            <DebugSection title="Heroic actions">
              <DebugValue
                value={profile.heroicActions?.map(
                  (ha) => rules.get(ha)?.name ?? ha,
                )}
              />
            </DebugSection>
            <DebugSection title="Options">
              <DebugValue
                value={profile.options?.map(({ id, ...rest }) => ({
                  name: t(`options.${id}`),
                  ...rest,
                }))}
              />
            </DebugSection>
            <DebugSection title="Special rules">
              <DebugValue
                value={profile.specialRules?.map((sr) => {
                  const rule = rules.get(sr.id);
                  const parameter = sr.parameter ? ` (${sr.parameter})` : "";
                  if (!rule) {
                    return `${sr.id + parameter} ⚠`;
                  }
                  return rule.name + parameter;
                })}
              />
            </DebugSection>
            <DebugProfileRules
              profile={profile.profile}
              value={profile.profileRules}
            />
            <DebugSection title="Magic powers">
              <DebugValue
                value={profile.magicPowers?.map((mp) => {
                  const magicalPower = rules.get(mp.id);
                  return {
                    name: magicalPower?.name ?? `${mp.id} ⚠`,
                    cast: mp.cast,
                    range: mp.range,
                    ...(mp.target ? { target: mp.target } : {}),
                  };
                })}
              />
            </DebugSection>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
}

export default memo(DebugProfile);
