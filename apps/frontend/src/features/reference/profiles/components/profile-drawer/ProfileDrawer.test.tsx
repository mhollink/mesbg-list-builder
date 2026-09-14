import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { LocalizedProfile } from "../../profiles.types.ts";
import { ProfileDrawer } from "./ProfileDrawer.tsx";
import type { ProfileDrawerContent } from "./profile-drawer.types.ts";

const mocks = vi.hoisted(() => ({
  useProfileDrawer: vi.fn(),
}));

vi.mock("../../hooks/useProfileDrawer", () => ({
  useProfileDrawer: mocks.useProfileDrawer,
}));

vi.mock("@mui/material/Drawer", () => ({
  default: ({
    open,
    onClose,
    children,
  }: {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
  }) =>
    open ? (
      <div data-testid="profile-drawer">
        <button type="button" onClick={onClose}>
          drawer-close
        </button>
        {children}
      </div>
    ) : null,
}));

vi.mock("./ProfileDrawerHeader", () => ({
  ProfileDrawerHeader: ({
    profile,
    onBack,
    onClose,
  }: {
    profile: LocalizedProfile;
    onBack: () => void;
    onClose: () => void;
  }) => (
    <div>
      <span>{profile.name}</span>
      <button type="button" onClick={onBack}>
        header-back
      </button>
      <button type="button" onClick={onClose}>
        header-close
      </button>
    </div>
  ),
}));

vi.mock("./ProfileStats", () => ({
  ProfileStats: () => <div>profile-stats</div>,
}));

vi.mock("./ProfileValueList", () => ({
  ProfileValueList: ({
    title,
    values,
  }: {
    title: string;
    values: string[];
  }) => (
    <div>
      {title}:{values.join(",")}
    </div>
  ),
}));

vi.mock("./ProfileRuleLinks", () => ({
  ProfileRuleLinks: ({
    title,
    rules,
    onOpenRule,
  }: {
    title: string;
    rules: { id: string; name: string }[];
    onOpenRule: (ruleId: string) => void;
  }) => (
    <div>
      <span>{title}</span>
      {rules.map((rule) => (
        <button key={rule.id} type="button" onClick={() => onOpenRule(rule.id)}>
          {rule.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("./ProfileProfileRules", () => ({
  ProfileProfileRules: () => <div>profile-rules</div>,
}));

vi.mock("./ProfileOptions", () => ({
  ProfileOptions: () => <div>profile-options</div>,
}));

vi.mock("./ProfileMagicPowers", () => ({
  ProfileMagicPowers: () => <div>magic-powers</div>,
}));

vi.mock("./ProfileRelatedProfiles", () => ({
  ProfileRelatedProfiles: ({
    profiles,
    onOpenProfile,
  }: {
    profiles: { id: string; name: string }[];
    onOpenProfile: (profileId: string) => void;
  }) => (
    <div>
      {profiles.map((profile) => (
        <button
          key={profile.id}
          type="button"
          onClick={() => onOpenProfile(profile.id)}
        >
          {profile.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("./ProfileSource", () => ({
  ProfileSource: () => <div>profile-source</div>,
}));

const content = {
  profile: {
    profile: "aragorn",
    name: "Aragorn",
    stats: {
      type: "hero",
    },
    wargear: ["Andúril"],
    source: {
      book: "armies-of-the-lord-of-the-rings",
      page: 42,
    },
  } as LocalizedProfile,
  additionalText: ["Additional text"],
  heroicActions: [{ id: "heroic-strike", name: "Heroic Strike" }],
  specialRules: [{ id: "terror", name: "Terror" }],
  profileRules: [],
  magicalPowers: [],
  options: [],
  additionalProfiles: [
    {
      id: "aragorn-mounted",
      name: "Aragorn (Mounted)",
    },
  ],
} as ProfileDrawerContent;

describe("ProfileDrawer", () => {
  beforeEach(() => {
    mocks.useProfileDrawer.mockReset();
  });

  test("renders nothing when the drawer is closed", () => {
    mocks.useProfileDrawer.mockReturnValue({
      open: false,
      content: undefined,
      close: vi.fn(),
      canGoBack: false,
      goBack: vi.fn(),
      openRule: vi.fn(),
      openProfile: vi.fn(),
    });

    render(<ProfileDrawer />);

    expect(screen.queryByTestId("profile-drawer")).not.toBeInTheDocument();
  });

  test("renders profile drawer content", () => {
    mocks.useProfileDrawer.mockReturnValue({
      open: true,
      content,
      close: vi.fn(),
      canGoBack: true,
      goBack: vi.fn(),
      openRule: vi.fn(),
      openProfile: vi.fn(),
    });

    render(<ProfileDrawer />);

    expect(screen.getByText("Aragorn")).toBeInTheDocument();
    expect(screen.getByText("profile-stats")).toBeInTheDocument();
    expect(
      screen.getByText("Additional Information:Additional text"),
    ).toBeInTheDocument();
    expect(screen.getByText("Wargear:Andúril")).toBeInTheDocument();
    expect(screen.getByText("Special Rules")).toBeInTheDocument();
    expect(screen.getByText("Heroic Actions")).toBeInTheDocument();
    expect(screen.getByText("profile-source")).toBeInTheDocument();
  });

  test("forwards drawer navigation actions", async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    const goBack = vi.fn();
    const openRule = vi.fn();
    const openProfile = vi.fn();

    mocks.useProfileDrawer.mockReturnValue({
      open: true,
      content,
      close,
      canGoBack: true,
      goBack,
      openRule,
      openProfile,
    });

    render(<ProfileDrawer />);

    await user.click(screen.getByRole("button", { name: "header-back" }));
    await user.click(screen.getByRole("button", { name: "Terror" }));
    await user.click(screen.getByRole("button", { name: "Aragorn (Mounted)" }));
    await user.click(screen.getByRole("button", { name: "header-close" }));

    expect(goBack).toHaveBeenCalledOnce();
    expect(openRule).toHaveBeenCalledWith("terror");
    expect(openProfile).toHaveBeenCalledWith("aragorn-mounted");
    expect(close).toHaveBeenCalledOnce();
  });
});
