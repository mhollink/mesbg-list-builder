import { Box, Typography } from "@mui/material";

type PolicySectionProps = {
  id?: string;
  title: string;
  description?: string;
  items?: string[];
  children?: React.ReactNode;
};

export function PolicySection({
  id,
  title,
  description,
  items,
  children,
}: PolicySectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        scrollMarginTop: 96,
      }}
    >
      <Typography
        component="h3"
        variant="h5"
        sx={{
          mb: 1,
          fontWeight: 700,
          lineHeight: 1.25,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          color="text.secondary"
          sx={{
            lineHeight: 1.75,
          }}
        >
          {description}
        </Typography>
      )}

      {items && (
        <Box
          component="ul"
          sx={{
            m: 0,
            mt: description ? 2 : 0,
            pl: 3,
            color: "text.secondary",
            "& li": {
              pl: 0.5,
              mb: 1,
              lineHeight: 1.7,
            },
            "& li:last-of-type": {
              mb: 0,
            },
          }}
        >
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Box>
      )}

      {children}
    </Box>
  );
}
