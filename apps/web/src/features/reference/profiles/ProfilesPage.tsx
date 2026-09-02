import Stack from "@mui/material/Stack";

import profilesData from "~/generated/game-data/profiles.json" with { type: "json" };
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";


export function ProfilesPage() {
    const { t } = useTranslation("game-data", {keyPrefix: "profiles"})

    return (
        <Stack>
            { profilesData.map(profile => (
                <Stack direction="row" sx={{justifyContent: "space-between"}}>
                    <Typography>
                        {t(`origins.${profile.origin}`)}
                    </Typography>
                    <Typography>
                        {t(`profiles.${profile.profile}.name`)}
                    </Typography>

                    <Box>
                        {JSON.stringify(profile.stats)}
                    </Box>
                </Stack>
            ))}

        </Stack>
    )
}