import { useMemo } from "react";

import { useAppSelector } from "~/app/store/hooks.ts";
import { InvalidRoster } from "~/features/armies/rosters/builder/components/InvalidRoster.tsx";
import { RosterBuilder } from "~/features/armies/rosters/builder/components/layout/RosterBuilder.tsx";
import { mapGuestRoster } from "~/features/armies/rosters/builder/mappers/guest-roster.mapper.ts";
import { useGuestRosterPersistence } from "~/features/armies/rosters/builder/persistence/useGuestRosterPersistence.ts";
import { selectGuestRoster } from "~/features/armies/rosters/guest/guest-roster.selectors.ts";

export function GuestRosterPage() {
  const guestRoster = useAppSelector(selectGuestRoster);

  const persistence = useGuestRosterPersistence();

  const roster = useMemo(
    () => (guestRoster ? mapGuestRoster(guestRoster) : undefined),
    [guestRoster],
  );

  if (!roster) {
    return <InvalidRoster />;
  }

  return <RosterBuilder roster={roster} persistence={persistence} />;
}
