import { router } from "../index"
import { userRouter } from "./user"
import { audioRouter } from "./audio"
import { contentRouter } from "./content"
import { shopRouter } from "./shop"
import { talentRouter } from "./talent"
import { communityRouter } from "./community"

export const appRouter = router({
  user: userRouter,
  audio: audioRouter,
  content: contentRouter,
  shop: shopRouter,
  talent: talentRouter,
  community: communityRouter,
})

export type AppRouter = typeof appRouter

