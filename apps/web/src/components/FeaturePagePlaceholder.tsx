import { Box, Typography } from "@mui/material";

interface FeaturePagePlaceholderProps {
  title: string;
  description?: string;
}

export const FeaturePagePlaceholder = ({
  title,
  description,
}: FeaturePagePlaceholderProps) => (
  <Box>
    <Typography variant="h4" component="h1" gutterBottom>
      {title}
    </Typography>

    {description && (
      <Typography color="text.secondary">{description}</Typography>
    )}
  </Box>
);
