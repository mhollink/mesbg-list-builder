import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LocalizedArmyListProfile } from "../../army-lists.types.ts";
import { ArmyListProfileOptions } from "./ArmyListProfileOptions.tsx";

interface ArmyListProfileProps {
  profile: LocalizedArmyListProfile;
  onOpenProfile: (profileId: string) => void;
}

export function ArmyListProfile({
  profile,
  onOpenProfile,
}: ArmyListProfileProps) {
  const includedOptions = profile.options.filter(
    (option) => option.state === "preselected",
  );

  const availableOptions = profile.options.filter(
    (option) => option.state === "available",
  );

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack sx={{ gap: 0.25 }}>
        <ButtonBase
          onClick={() => onOpenProfile(profile.profileId)}
          sx={{
            alignSelf: "flex-start",
            textAlign: "left",
            borderRadius: 1,

            "&:hover .army-list-profile-name": {
              color: "primary.main",
            },
          }}
        >
          <Typography
            className="army-list-profile-name"
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              transition: (theme) =>
                theme.transitions.create("color", {
                  duration: theme.transitions.duration.shortest,
                }),
            }}
          >
            {profile.profile.name}
          </Typography>
        </ButtonBase>

        {includedOptions.length > 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontStyle: "italic",
            }}
          >
            with{" "}
            {formatOptionList(includedOptions.map((option) => option.name))}
          </Typography>
        )}
      </Stack>

      <ArmyListProfileOptions options={availableOptions} />
    </Stack>
  );
}

function formatOptionList(options: string[]): string {
  if (options.length === 1) {
    return options[0];
  }

  if (options.length === 2) {
    return `${options[0]} and ${options[1]}`;
  }

  return `${options.slice(0, -1).join(", ")} and ${options.at(-1)}`;
}
