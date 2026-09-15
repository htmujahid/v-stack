import type { Messages } from "../types"
import admin from "./admin"
import auth from "./auth"
import common from "./common"
import marketing from "./marketing"
import organization from "./organization"
import organizations from "./organizations"

export default {
  ...common,
  ...marketing,
  ...auth,
  ...admin,
  ...organization,
  ...organizations,
} satisfies Messages
