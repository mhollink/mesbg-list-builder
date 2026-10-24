import { describe, expect, it, vi } from "vitest";

import type {
  BuilderUnit,
  BuilderWarband,
} from "../../../domain/roster.types.ts";
import type { RosterPersistence } from "../../../persistence/roster-persistence.types.ts";
import { saveFollowerLoadout } from "./unit-configuration.persistence.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

const regular: BuilderUnit = {
  id: 10,
  armyListProfileId: "rider",
  quantity: 8,
  optionIds: ["throwing-spears"],
};
const upgraded: BuilderUnit = {
  id: 11,
  armyListProfileId: "rider",
  quantity: 6,
  optionIds: ["upgrade-to-westfold-redshield"],
};
const warband = { id: 4, followers: [regular, upgraded] } as BuilderWarband;
const profile = {
  id: "rider",
  options: [
    { id: "banner", state: "available" },
    { id: "throwing-spears", state: "available" },
    {
      id: "upgrade-to-westfold-redshield",
      state: "available",
      category: "special-upgrade",
    },
  ],
} as unknown as LocalizedArmyListProfile;

function persistence() {
  return {
    addFollower: vi.fn(async () => {}),
    updateUnit: vi.fn(async () => {}),
  } as unknown as RosterPersistence;
}

describe("saveFollowerLoadout", () => {
  it("updates only the selected roster entry regardless of the profile ID", async () => {
    const actions = persistence();
    await saveFollowerLoadout(
      warband,
      profile,
      {
        quantity: 8,
        optionIds: ["banner"],
      },
      actions,
      regular,
    );
    expect(actions.updateUnit).toHaveBeenCalledTimes(1);
    expect(actions.updateUnit).toHaveBeenCalledWith(4, 10, {
      quantity: 8,
      optionIds: ["banner"],
    });
    expect(actions.addFollower).not.toHaveBeenCalled();
  });

  it("creates a new entry instead of replacing an existing variant", async () => {
    const actions = persistence();
    await saveFollowerLoadout(
      warband,
      profile,
      {
        quantity: 6,
        optionIds: ["upgrade-to-westfold-redshield", "banner"],
      },
      actions,
    );
    expect(actions.addFollower).toHaveBeenCalledTimes(1);
    expect(actions.addFollower).toHaveBeenCalledWith(4, "rider", 6, [
      "banner",
      "upgrade-to-westfold-redshield",
    ]);
    expect(actions.updateUnit).not.toHaveBeenCalled();
  });

  it("rejects a stale selection rather than editing a sibling entry", async () => {
    const actions = persistence();
    await expect(
      saveFollowerLoadout(
        warband,
        profile,
        {
          quantity: 8,
          optionIds: [],
        },
        actions,
        { ...regular, id: 999 },
      ),
    ).rejects.toThrow("no longer");
    expect(actions.updateUnit).not.toHaveBeenCalled();
  });
});
