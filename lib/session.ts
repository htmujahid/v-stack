import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth";

export const getCachedSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})