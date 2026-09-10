import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ProfilesResultCountProps {
  count: number;
}

export function ProfilesResultCount({ count }: ProfilesResultCountProps) {
  const { t } = useTranslation("profiles");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: {
          xs: 2,
          md: 3,
        },
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        {count} {count === 1 ? t("search.result") : t("search.results")}
      </Typography>
    </Box>
  );
}
