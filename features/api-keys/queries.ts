import { listApiKeys } from "./actions"

export const API_KEYS_KEY = "admin-api-keys"

export const apiKeysQuery = {
  key: API_KEYS_KEY,
  fetcher: listApiKeys,
}
