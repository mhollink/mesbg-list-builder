import type { ReactNode } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface TeamMemberCardProps {
  name: string;
  role: string;
  avatarSrc?: string;
  avatarSide?: "left" | "right";
  bio: ReactNode;
  involvement: ReactNode;
  involvementTitle: string;
  footer?: ReactNode;
}

export function TeamMemberCard({
  name,
  role,
  avatarSrc,
  avatarSide = "left",
  bio,
  involvement,
  involvementTitle,
  footer,
}: TeamMemberCardProps) {
  return (
    <Card component="article" variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent
        sx={{
          p: { xs: 2, md: 3 },
          "&:last-child": { pb: { xs: 2, md: 3 } },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: avatarSide === "right" ? "row-reverse" : "row",
          }}
          spacing={{ xs: 2, md: 4 }}
          sx={{
            alignItems: "flex-start",
          }}
        >
          <Avatar
            src={avatarSrc}
            alt={name}
            variant="rounded"
            sx={{
              width: { xs: 112, md: 176 },
              height: { xs: 112, md: 176 },
              borderRadius: 3,
              bgcolor: "action.hover",
              color: "text.secondary",
              fontSize: 36,
              flexShrink: 0,
            }}
          >
            {name.charAt(0)}
          </Avatar>

          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            <Box>
              <Typography component="h3" variant="h5" sx={{ fontWeight: 700 }}>
                {name}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {role}
              </Typography>
            </Box>

            <Box>{bio}</Box>

            <Divider />

            <Box>
              <Typography
                component="h4"
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 700 }}
              >
                {involvementTitle}
              </Typography>
              {involvement}
            </Box>

            {footer && <Box>{footer}</Box>}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
