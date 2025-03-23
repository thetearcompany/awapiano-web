import { z } from "zod"
import { router, publicProcedure } from "../index"
import { protectedProcedure } from "../procedures/protectedProcedure"

export const userRouter = router({
  getProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx: { userService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return userService.getUserProfile(userId)
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        website: z.string().url().optional(),
        avatarUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input, ctx: { userService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return userService.updateUserProfile(userId, input)
    }),

  getFollowers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx: { userService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return userService.getUserFollowers(userId, input.limit, input.cursor)
    }),

  getFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx: { userService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return userService.getUserFollowing(userId, input.limit, input.cursor)
    }),

  followUser: protectedProcedure
    .input(
      z.object({
        targetUserId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { userService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return userService.followUser(userId, input.targetUserId)
    }),

  unfollowUser: protectedProcedure
    .input(
      z.object({
        targetUserId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { userService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return userService.unfollowUser(userId, input.targetUserId)
    }),
})

