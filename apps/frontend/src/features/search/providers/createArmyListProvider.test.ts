import { describe, expect, it } from "vitest";

import { createArmyListProvider } from "./createArmyListProvider.ts";
import type { LocalizedArmyList } from "~/features/reference/army-lists/army-lists.types.ts";

describe("createArmyListProvider", () => {
  it("returns an army list when its profile matches the query", () => {
    const list = {
      id: "riders-of-theoden",
      name: "Riders of Théoden",
      sourceName: "Armies of Middle-earth",
      profiles: [{ profile: { name: "Éomer" } }],
      specialRules: [],
      additionalRules: [],
    } as LocalizedArmyList;
    const provider = createArmyListProvider([list]);
    const response = provider.search({
      query: "eomer",
      normalizedQuery: "eomer",
      limit: 5,
    });

    expect(provider).toMatchObject({ id: "armies", category: "armies" });
    expect(response).toMatchObject({
      total: 1,
      results: [
        {
          category: "armies",
          target: {
            type: "route",
            path: "/reference/armylists/riders-of-theoden",
          },
        },
      ],
    });
  });
});
