import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateRosterDialog } from "./CreateRosterDialog.tsx";
import { GuestRosterAlreadyExistsError } from "~/features/armies/rosters/management/hooks/useCreateRoster.ts";

const mocks = vi.hoisted(() => ({
  createRoster: vi.fn(),
  navigate: vi.fn(),
  guestRoster: null as null | { id: "guest"; name: string },
  state: { isLoading: false, isError: false },
}));

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock("~/app/store/hooks.ts", () => ({
  useAppSelector: () => mocks.guestRoster,
}));

vi.mock("~/features/armies/rosters/management/hooks/useCreateRoster.ts", () => {
  class GuestRosterAlreadyExistsError extends Error {
    constructor() {
      super("A guest roster already exists.");
      this.name = "GuestRosterAlreadyExistsError";
    }
  }

  return {
    GuestRosterAlreadyExistsError,

    useCreateRoster: () => ({
      createRoster: mocks.createRoster,
      ...mocks.state,
    }),
  };
});

vi.mock("~/features/reference/army-lists/hooks/useGameArmyLists.ts", () => ({
  useGameArmyLists: () => ({
    armyLists: [
      {
        id: "mordor",
        name: "Mordor",
        alignment: "evil",
        source: { book: "armies-of-middle-earth", page: 1 },
      },
    ],
  }),
}));

vi.mock("~/components/heraldry/HeraldryIcon.tsx", () => ({
  HeraldryIcon: () => <span data-testid="heraldry-icon" />,
}));

vi.mock("~/components/heraldry/heraldry.const.ts", () => ({
  getArmyListHeraldry: () => "mordor",
}));

describe("CreateRosterDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.guestRoster = null;
    mocks.state = { isLoading: false, isError: false };
    mocks.createRoster.mockResolvedValue("/armies/rosters/42");
  });

  it("creates a roster from the entered values and navigates to it", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <CreateRosterDialog
        open
        onClose={onClose}
        tagSuggestions={[]}
        groupId={12}
      />,
    );

    await user.type(screen.getByLabelText("Roster name *"), "  My Mordor  ");
    await selectMordor(user);
    await user.type(screen.getByLabelText("Point limit"), "750");
    await user.click(screen.getByRole("button", { name: "Create roster" }));

    expect(mocks.createRoster).toHaveBeenCalledWith({
      name: "My Mordor",
      armyListId: "mordor",
      pointsLimit: 750,
      tags: [],
      groupId: 12,
    });
    expect(onClose).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledWith("/armies/rosters/42");
  });

  it("switches to the replacement flow when a guest roster already exists", async () => {
    const user = userEvent.setup();
    mocks.guestRoster = { id: "guest", name: "Existing roster" };
    mocks.createRoster
      .mockRejectedValueOnce(new GuestRosterAlreadyExistsError())
      .mockResolvedValueOnce("/armies/rosters/guest");

    render(<CreateRosterDialog open onClose={vi.fn()} tagSuggestions={[]} />);

    await user.type(screen.getByLabelText("Roster name *"), "Replacement");
    await selectMordor(user);
    await user.click(screen.getByRole("button", { name: "Create roster" }));

    expect(
      await screen.findByText("Replace your guest roster?"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Replace roster" }));

    expect(mocks.createRoster).toHaveBeenLastCalledWith(
      {
        name: "Replacement",
        armyListId: "mordor",
        tags: [],
        groupId: undefined,
      },
      { replaceGuestRoster: true },
    );
    expect(mocks.navigate).toHaveBeenCalledWith("/armies/rosters/guest");
  });

  it("renders a server creation error", () => {
    mocks.state = { isLoading: false, isError: true };

    render(<CreateRosterDialog open onClose={vi.fn()} tagSuggestions={[]} />);

    expect(
      screen.getByText("The roster could not be created."),
    ).toBeInTheDocument();
  });
});

async function selectMordor(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("combobox", { name: "Army list" }));
  await user.click(await screen.findByRole("option", { name: "Mordor" }));
}
