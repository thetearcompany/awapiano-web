import { z } from "zod"
import { router, publicProcedure } from "../index"
import { AudioService } from "@/services/audio.service"

const audioService = new AudioService()

export const audioRouter = router({
  getNowPlaying: publicProcedure.query(() => {
    return audioService.getNowPlaying()
  }),

  getRadioSchedule: publicProcedure
    .input(
      z.object({
        day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).optional(),
      }),
    )
    .query(({ input }) => {
      return audioService.getRadioSchedule(input.day)
    }),

  getRecentEpisodes: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return audioService.getRecentEpisodes(input.limit, input.cursor)
    }),

  getPopularTracks: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return audioService.getPopularTracks(input.limit, input.cursor)
    }),

  getTrackById: publicProcedure
    .input(
      z.object({
        trackId: z.string(),
      }),
    )
    .query(({ input }) => {
      return audioService.getTrackById(input.trackId)
    }),

  likeTrack: publicProcedure
    .input(
      z.object({
        trackId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return audioService.likeTrack(userId, input.trackId)
    }),

  unlikeTrack: publicProcedure
    .input(
      z.object({
        trackId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return audioService.unlikeTrack(userId, input.trackId)
    }),
})

