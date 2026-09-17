import { AccountApi, RosterGroupsApi, RostersApi } from "@mlb/api-client";

import { apiConfiguration } from "./api-config.ts";

export const accountApi = new AccountApi(apiConfiguration);
export const rostersApi = new RostersApi(apiConfiguration);
export const rosterGroupsApi = new RosterGroupsApi(apiConfiguration);
