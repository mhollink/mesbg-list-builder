import { Link as RouterLink } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

export const LinkStrip = () => {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: "center",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link component={RouterLink} to="/policies#privacy">
          Privacy
        </Link>

        <Link component={RouterLink} to="/policies#fair-use">
          Fair use
        </Link>

        <Link component={RouterLink} to="/support">
          Support
        </Link>
      </Stack>
    </Box>
  );
};
