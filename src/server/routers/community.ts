import { z } from "zod"
import { router, publicProcedure } from "../index"
import { protectedProcedure } from "../procedures/protectedProcedure"

export const communityRouter = router({
  getPosts: protectedProcedure
    .input(
      z.object({
        type: z.enum(["trending", "latest", "following"]).default("trending"),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx: { communityService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return communityService.getPosts(input.type, input.limit, input.cursor, userId)
    }),

  getPostById: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ input, ctx: { communityService } }) => {
      return communityService.getPostById(input.postId)
    }),

  createPost: publicProcedure
    .input(
      z.object({
        content: z.string().min(1).max(500),
        mediaUrl: z.string().url().optional(),
        mediaType: z.enum(["image", "audio", "link"]).optional(),
      }),
    )
    .mutation(async ({ input, ctx: { communityService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return communityService.createPost(userId, input)
    }),

  likePost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { communityService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return communityService.likePost(userId, input.postId)
    }),

  unlikePost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { communityService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return communityService.unlikePost(userId, input.postId)
    }),

  createComment: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1).max(300),
        parentCommentId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx: { communityService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return communityService.createComment(userId, input)
    }),

  getPopularGroups: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(5),
      }),
    )
    .query(async ({ input, ctx: { communityService } }) => {
      return communityService.getPopularGroups(input.limit)
    }),

  getTrendingTopics: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(5),
      }),
    )
    .query(async ({ input, ctx: { communityService } }) => {
      return communityService.getTrendingTopics(input.limit)
    }),
})

