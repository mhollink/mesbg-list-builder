import { describe, expect, it } from "vitest";

import { mapGuestRoster } from "./guest-roster.mapper.ts";
import type { GuestRoster } from "../../guest/guest-roster.types.ts";

describe("mapGuestRoster", () => {
    it("maps a guest roster to the shared builder model", () => {
        const roster: GuestRoster = {
            id: "guest",
            name: "Mordor",
            armyListId: "mordor",
            pointsLimit: 500,
            tags: ["test"],
            armyOptionIds: ["some-option"],
            generalUnitId: "leader-1",
            warbands: [
                {
                    id: "warband-1",
                    leader: {
                        id: "leader-1",
                        profileId: "gothmog",
                        quantity: 1,
                        optionIds: ["warg"],
                    },
                    followers: [
                        {
                            id: "follower-1",
                            profileId: "orc-warrior",
                            quantity: 6,
                            optionIds: ["shield"],
                        },
                    ],
                },
            ],
            createdAt: "",
            updatedAt: "",
        };

        expect(mapGuestRoster(roster)).toEqual({
            id: "guest",
            name: "Mordor",
            armyListId: "mordor",
            pointsLimit: 500,
            tags: ["test"],
            locked: false,
            armyOptionIds: ["some-option"],
            generalUnitId: "leader-1",
            warbands: [
                {
                    id: "warband-1",
                    leader: {
                        id: "leader-1",
                        profileId: "gothmog",
                        quantity: 1,
                        optionIds: ["warg"],
                    },
                    followers: [
                        {
                            id: "follower-1",
                            profileId: "orc-warrior",
                            quantity: 6,
                            optionIds: ["shield"],
                        },
                    ],
                },
            ],
        });
    });
});