import { useRef } from "react";

import { ProfileDrawer } from "~/features/reference/profiles/components/profile-drawer/ProfileDrawer.tsx";
import { RuleDrawer } from "~/features/reference/rules/components/rule-drawer/RuleDrawer.tsx";

export function DrawerStack() {
  const positions = useRef(new Map<string, number>());

  return (
    <>
      <RuleDrawer scrollPositions={positions.current} />
      <ProfileDrawer scrollPositions={positions.current} />
    </>
  );
}
