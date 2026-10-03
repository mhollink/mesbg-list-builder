import {
  AccountApi,
  RosterCompositionApi,
  RosterGroupsApi,
  RostersApi,
  RosterUnitsApi,
  RosterWarbandsApi,
} from "@mlb/api-client";

import { apiConfiguration } from "./api-config.ts";

export const accountClient = new AccountApi(apiConfiguration);

export const rosterGroupsClient = new RosterGroupsApi(apiConfiguration);
export const rostersClient = new RostersApi(apiConfiguration);
export const rosterCompositionClient = new RosterCompositionApi(
  apiConfiguration,
);
export const rosterWarbandsClient = new RosterWarbandsApi(apiConfiguration);
export const rosterUnitsClient = new RosterUnitsApi(apiConfiguration);
