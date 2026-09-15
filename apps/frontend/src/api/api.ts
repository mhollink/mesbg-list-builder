import { AccountApi } from "@mlb/api-client";

import { apiConfiguration } from "./api-config.ts";

export const accountApi = new AccountApi(apiConfiguration);
