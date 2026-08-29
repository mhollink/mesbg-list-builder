import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function RulesHeader() {
  return (
    <Box
      component="header"
      sx={{
        px: {
          xs: 2,
          md: 3,
        },
        pt: 3,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{
          fontWeight: 700,
        }}
      >
        Rules
      </Typography>

      <Typography
        color="textSecondary"
        sx={{
          mt: 0.5,
        }}
      >
        Browse the rules and abilities used throughout the game.
      </Typography>
    </Box>
  );
}
