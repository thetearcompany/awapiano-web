import { z } from "zod"
import { router, publicProcedure } from "../index"
import { protectedProcedure } from "../procedures/protectedProcedure"

export const audioRouter = router({
  getNowPlaying: publicProcedure.query(({ ctx: { audioService } }) => {
    return audioService.getNowPlaying()
  }),

  getRadioSchedule: publicProcedure
    .input(
      z.object({
        day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).optional(),
      }),
    )
    .query(({ input, ctx: { audioService } }) => {
      return audioService.getRadioSchedule(input.day)
    }),

  getRecentEpisodes: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input, ctx: { audioService } }) => {
      return audioService.getRecentEpisodes(input.limit, input.cursor)
    }),

  getPopularTracks: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input, ctx: { audioService } }) => {
      return audioService.getPopularTracks(input.limit, input.cursor)
    }),

  getTrackById: publicProcedure
    .input(
      z.object({
        trackId: z.string(),
      }),
    )
    .query(({ input, ctx: { audioService } }) => {
      return audioService.getTrackById(input.trackId)
    }),

  likeTrack: protectedProcedure
    .input(
      z.object({
        trackId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { audioService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return audioService.likeTrack(userId, input.trackId)
    }),

  unlikeTrack: protectedProcedure
    .input(
      z.object({
        trackId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { audioService, sessionService } }) => {
      const current = await sessionService.current()
      const userId = current.user.id
      return audioService.unlikeTrack(userId, input.trackId)
    }),
})

