import type {
    LocalizedArmyList,
    LocalizedArmyListProfile,
} from "~/features/reference/army-lists/army-lists.types.ts";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

export interface BuilderGameData {
    armyList: LocalizedArmyList;
    profilesById: ReadonlyMap<string, LocalizedProfile>;
    armyListProfilesById: ReadonlyMap<
        string,
        LocalizedArmyListProfile
    >;
    armyListProfilesByProfileId: ReadonlyMap<
        string,
        readonly LocalizedArmyListProfile[]
    >;
}