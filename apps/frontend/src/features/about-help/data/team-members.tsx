import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { TeamMemberCardProps } from "~/features/about-help/components/TeamMemberCard.tsx";

export default [
  {
    name: "Alex",
    role: "Founder & Original Developer",
    involvementTitle: "Project involvement",
    avatarSrc: "/team/alex.webp",
    bio: (
      <Stack spacing={1.5}>
        <Typography>
          Alex is the original creator of MESBG List Builder, having founded the
          project back in 2018. Long before the current application and its
          ongoing rebuild, he laid the groundwork for what would become a widely
          used tool within the Middle-earth Strategy Battle Game community.
        </Typography>

        <Typography>
          His original work gave players a dedicated place to build and manage
          their armies, establishing the foundation on which the project
          continues to grow today.
        </Typography>
      </Stack>
    ),
    involvement: (
      <Stack spacing={1.5}>
        <Typography>
          As the founder, Alex was responsible for creating the original MESBG
          List Builder and establishing the core concept behind the application.
        </Typography>

        <Typography>
          His work shaped the original army-building experience and provided the
          starting point for subsequent versions of the project.
        </Typography>

        <Typography>
          The current application continues to build upon that original vision,
          and his contribution remains an important part of the project's
          history.
        </Typography>
      </Stack>
    ),
  },
  {
    name: "Marcel",
    role: "Lead Developer & Maintainer",
    involvementTitle: "Project involvement",
    avatarSrc: "/team/marcel.webp",
    bio: (
      <Stack spacing={1.5}>
        <Typography>
          I'm a software developer and Middle-earth Strategy Battle Game
          enthusiast who enjoys combining technology with tabletop gaming.
          Building tools that make the hobby more accessible and enjoyable
          brings together two of my biggest interests.
        </Typography>

        <Typography>
          When I became involved with MESBG List Builder, I saw an opportunity
          to build upon an already established project and help it continue
          growing. What started as maintaining and improving the existing
          application has gradually evolved into a much larger undertaking.
        </Typography>

        <Typography>
          Today, I'm working on rebuilding the application with a more modern
          and maintainable foundation. My goal is to preserve what made the
          original List Builder useful while making it easier to improve, expand
          and maintain for years to come.
        </Typography>
      </Stack>
    ),
    involvement: (
      <Stack spacing={1.5}>
        <Typography>
          I'm responsible for the ongoing development, architecture and
          maintenance of MESBG List Builder, covering both the frontend and
          backend applications.
        </Typography>

        <Typography>
          This includes designing and implementing features, managing the
          infrastructure and hosting, preparing releases and keeping the
          application running.
        </Typography>

        <Typography>
          I also help shape the direction of the project, taking feedback from
          the community and turning ideas into improvements that make the List
          Builder more useful for everyone.
        </Typography>
      </Stack>
    ),
  },
] satisfies TeamMemberCardProps[];
