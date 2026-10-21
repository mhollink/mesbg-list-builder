import Typography from "@mui/material/Typography";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TeamMemberCard, type TeamMemberCardProps } from "./TeamMemberCard.tsx";

const member: TeamMemberCardProps = {
  name: "Marcel Hollink",
  role: "Lead Developer & Maintainer",
  avatarSrc: "/team/marcel.webp",
  involvementTitle: "Project involvement",
  bio: (
    <>
      <Typography>First paragraph about tabletop gaming.</Typography>
      <Typography>
        Second paragraph with <strong>rich content</strong>.
      </Typography>
    </>
  ),
  involvement: <Typography>Frontend and backend development.</Typography>,
};

describe("TeamMemberCard", () => {
  it("renders the member's name, role, bio and involvement semantically", () => {
    render(<TeamMemberCard {...member} />);

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Marcel Hollink" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lead Developer & Maintainer")).toBeInTheDocument();
    expect(
      screen.getByText("First paragraph about tabletop gaming."),
    ).toBeInTheDocument();
    expect(screen.getByText("rich content")).toHaveProperty(
      "tagName",
      "STRONG",
    );
    expect(
      screen.getByRole("heading", { level: 4, name: "Project involvement" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Frontend and backend development."),
    ).toBeInTheDocument();
  });

  it("renders the supplied avatar image with an accessible name", () => {
    render(<TeamMemberCard {...member} />);

    expect(screen.getByRole("img", { name: "Marcel Hollink" })).toHaveAttribute(
      "src",
      "/team/marcel.webp",
    );
  });

  it("uses the member's initial when no avatar URL is available", () => {
    render(<TeamMemberCard {...member} avatarSrc={undefined} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByText("M", { selector: ".MuiAvatar-root" }),
    ).toBeInTheDocument();
  });

  it("renders optional footer content only when supplied", () => {
    const { rerender } = render(<TeamMemberCard {...member} />);

    expect(
      screen.queryByRole("link", { name: "GitHub profile" }),
    ).not.toBeInTheDocument();

    rerender(
      <TeamMemberCard
        {...member}
        footer={<a href="https://github.com/example">GitHub profile</a>}
      />,
    );

    expect(
      screen.getByRole("link", { name: "GitHub profile" }),
    ).toHaveAttribute("href", "https://github.com/example");
  });

  it.each(["left", "right"] as const)(
    "renders the content when the avatar is placed on the %s",
    (avatarSide) => {
      render(<TeamMemberCard {...member} avatarSide={avatarSide} />);

      expect(
        screen.getByRole("heading", { name: member.name }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: member.name }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Frontend and backend development."),
      ).toBeInTheDocument();
    },
  );
});
