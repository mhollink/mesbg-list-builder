import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface RulesResultCountProps {
  count: number;
}

export function RulesResultCount({ count }: RulesResultCountProps) {
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
        {count} {count === 1 ? "result" : "results"}
      </Typography>
    </Box>
  );
}
