import { useParams } from "react-router";

import { AuthenticatedRosterPage } from "~/features/armies/rosters/builder/AuthenticatedRosterPage.tsx";
import { InvalidRoster } from "~/features/armies/rosters/builder/components/InvalidRoster.tsx";
import { GuestRosterPage } from "~/features/armies/rosters/builder/GuestRosterPage.tsx";

export function RosterPage() {
  const { rosterId } = useParams();

  if (rosterId === "guest") {
    return <GuestRosterPage />;
  }

  const id = Number(rosterId);
  const validRosterId = Number.isInteger(id);
  if (!validRosterId) {
    return <InvalidRoster />;
  }

  return <AuthenticatedRosterPage rosterId={id} />;
}
