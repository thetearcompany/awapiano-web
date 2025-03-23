import { z } from "zod"
import { router, publicProcedure } from "../index"
import { UserService } from "@/services/user.service"

const userService = new UserService()

export const userRouter = router({
  getProfile: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = input.userId || ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return userService.getUserProfile(userId)
    }),

  updateProfile: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        website: z.string().url().optional(),
        avatarUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return userService.updateUserProfile(userId, input)
    }),

  getFollowers: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return userService.getUserFollowers(input.userId, input.limit, input.cursor)
    }),

  getFollowing: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return userService.getUserFollowing(input.userId, input.limit, input.cursor)
    }),

  followUser: publicProcedure
    .input(
      z.object({
        targetUserId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return userService.followUser(userId, input.targetUserId)
    }),

  unfollowUser: publicProcedure
    .input(
      z.object({
        targetUserId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return userService.unfollowUser(userId, input.targetUserId)
    }),
})

