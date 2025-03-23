import { router } from "../../../index"
import { adminUsersRouter } from "./users"
import { adminContentRouter } from "./content"
import { adminMusicRouter } from "./music"
import { adminRadioRouter } from "./radio"
import { adminShopRouter } from "./shop"
import { adminCommunityRouter } from "./community"
import { adminAnalyticsRouter } from "./analytics"
import { adminDashboardRouter } from "./dashboard"

export const adminRouter = router({
  users: adminUsersRouter,
  content: adminContentRouter,
  music: adminMusicRouter,
  radio: adminRadioRouter,
  shop: adminShopRouter,
  community: adminCommunityRouter,
  analytics: adminAnalyticsRouter,
  dashboard: adminDashboardRouter,
})

