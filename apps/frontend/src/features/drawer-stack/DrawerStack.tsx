import { ProfileDrawer } from "~/features/reference/profiles/components/profile-drawer/ProfileDrawer.tsx";
import { RuleDrawer } from "~/features/reference/rules/components/rule-drawer/RuleDrawer.tsx";

export function DrawerStack() {
  return (
    <>
      <RuleDrawer />
      <ProfileDrawer />
    </>
  );
}
