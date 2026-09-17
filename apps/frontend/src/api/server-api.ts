import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import type { ApiError } from "./api-error.ts";

export const serverApi = createApi({
  reducerPath: "serverApi",

  baseQuery: fakeBaseQuery<ApiError>(),

  tagTypes: ["Roster", "RosterGroup"],

  endpoints: () => ({}),
});
