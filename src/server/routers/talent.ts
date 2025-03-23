import { z } from "zod"
import { router, publicProcedure } from "../index"
import { TalentService } from "@/services/talent.service"

const talentService = new TalentService()

export const talentRouter = router({
  getSpotlightArtist: publicProcedure.query(() => {
    return talentService.getSpotlightArtist()
  }),

  getSubmissions: publicProcedure
    .input(
      z.object({
        type: z.enum(["all", "mixes", "originals", "remixes"]).default("all"),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
        sortBy: z.enum(["recent", "popular", "rating"]).default("recent"),
      }),
    )
    .query(({ input }) => {
      return talentService.getSubmissions(input)
    }),

  getTopRated: publicProcedure
    .input(
      z.object({
        period: z.enum(["week", "month", "allTime"]).default("month"),
        limit: z.number().min(1).max(10).default(3),
      }),
    )
    .query(({ input }) => {
      return talentService.getTopRated(input.period, input.limit)
    }),

  getSubmissionById: publicProcedure
    .input(
      z.object({
        submissionId: z.string(),
      }),
    )
    .query(({ input }) => {
      return talentService.getSubmissionById(input.submissionId)
    }),

  submitFeedback: publicProcedure
    .input(
      z.object({
        submissionId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(10),
        ratings: z
          .object({
            originality: z.number().min(0).max(100).optional(),
            productionQuality: z.number().min(0).max(100).optional(),
            arrangement: z.number().min(0).max(100).optional(),
            danceability: z.number().min(0).max(100).optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return talentService.submitFeedback(userId, input)
    }),

  createSubmission: publicProcedure
    .input(
      z.object({
        title: z.string().min(3).max(100),
        description: z.string().min(10).max(500),
        type: z.enum(["mix", "original", "remix"]),
        audioUrl: z.string().url(),
        coverImageUrl: z.string().url().optional(),
        tags: z.array(z.string()).optional(),
        duration: z.number().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return talentService.createSubmission(userId, input)
    }),
})

