import { keycloak } from "~/features/account/auth/keycloak.ts";
import { AuthenticatedRostersPage } from "~/features/armies/rosters/management/AuthenticatedRostersPage.tsx";
import { GuestRostersPage } from "~/features/armies/rosters/management/GuestRostersPage.tsx";

export function RostersPage() {
  return keycloak.authenticated ? (
    <AuthenticatedRostersPage />
  ) : (
    <GuestRostersPage />
  );
}
