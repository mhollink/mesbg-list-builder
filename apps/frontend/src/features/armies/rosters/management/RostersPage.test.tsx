import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RostersPage } from "./RostersPage.tsx";

const mocks = vi.hoisted(() => ({
  keycloak: {
    authenticated: false,
  },
}));

vi.mock("~/features/account/auth/keycloak.ts", () => ({
  keycloak: mocks.keycloak,
}));

vi.mock("./AuthenticatedRostersPage.tsx", () => ({
  AuthenticatedRostersPage: () => <div>authenticated rosters</div>,
}));

vi.mock("./GuestRostersPage.tsx", () => ({
  GuestRostersPage: () => <div>guest rosters</div>,
}));

describe("RostersPage", () => {
  beforeEach(() => {
    mocks.keycloak.authenticated = false;
  });

  it("renders guest roster management for unauthenticated users", () => {
    render(<RostersPage />);

    expect(screen.getByText("guest rosters")).toBeInTheDocument();

    expect(screen.queryByText("authenticated rosters")).not.toBeInTheDocument();
  });

  it("renders authenticated roster management for signed in users", () => {
    mocks.keycloak.authenticated = true;

    render(<RostersPage />);

    expect(screen.getByText("authenticated rosters")).toBeInTheDocument();

    expect(screen.queryByText("guest rosters")).not.toBeInTheDocument();
  });
});
