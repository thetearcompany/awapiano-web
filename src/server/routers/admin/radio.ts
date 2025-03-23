import { z } from "zod"
import { router } from "@/server/index"
import { adminProcedure } from "@/server/procedures/adminProcedure"
import { TRPCError } from "@trpc/server"

export const adminRadioRouter = router({
  // Get all radio shows with pagination
  getShows: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["title", "startTime", "createdAt"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const shows = await ctx.prisma.radioShow.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          _count: {
            select: {
              episodes: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (shows.length > limit) {
        const nextItem = shows.pop()
        nextCursor = nextItem?.id
      }

      return {
        shows,
        nextCursor,
      }
    }),

  // Get radio show by ID
  getShowById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const show = await ctx.prisma.radioShow.findUnique({
        where: { id: input.id },
        include: {
          episodes: {
            orderBy: {
              airDate: "desc",
            },
          },
        },
      })

      if (!show) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Radio show not found",
        })
      }

      return show
    }),

  // Create radio show
  createShow: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        startTime: z.date(),
        endTime: z.date(),
        isRecurring: z.boolean().default(false),
        recurringDays: z.string().optional(),
        hostId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validate that endTime is after startTime
      if (input.endTime <= input.startTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "End time must be after start time",
        })
      }

      // Create radio show
      const show = await ctx.prisma.radioShow.create({
        data: input,
      })

      return show
    }),

  // Update radio show
  updateShow: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        isRecurring: z.boolean().optional(),
        recurringDays: z.string().optional(),
        hostId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      // Check if radio show exists
      const existingShow = await ctx.prisma.radioShow.findUnique({
        where: { id },
      })

      if (!existingShow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Radio show not found",
        })
      }

      // Validate that endTime is after startTime if both are provided
      if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "End time must be after start time",
        })
      }

      // Update radio show
      const show = await ctx.prisma.radioShow.update({
        where: { id },
        data,
      })

      return show
    }),

  // Delete radio show
  deleteShow: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if radio show exists
      const existingShow = await ctx.prisma.radioShow.findUnique({
        where: { id: input.id },
      })

      if (!existingShow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Radio show not found",
        })
      }

      // Delete radio show and its episodes
      await ctx.prisma.radioShow.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get all radio episodes with pagination
  getEpisodes: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        showId: z.string().optional(),
        isLive: z.boolean().optional(),
        sortBy: z.enum(["title", "airDate", "createdAt"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, showId, isLive, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(showId && { showId }),
        ...(isLive !== undefined && { isLive }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const episodes = await ctx.prisma.radioEpisode.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          show: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (episodes.length > limit) {
        const nextItem = episodes.pop()
        nextCursor = nextItem?.id
      }

      return {
        episodes,
        nextCursor,
      }
    }),

  // Get radio episode by ID
  getEpisodeById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const episode = await ctx.prisma.radioEpisode.findUnique({
        where: { id: input.id },
        include: {
          show: true,
        },
      })

      if (!episode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Radio episode not found",
        })
      }

      return episode
    }),

  // Create radio episode
  createEpisode: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        audioUrl: z.string().optional(),
        imageUrl: z.string().optional(),
        airDate: z.date(),
        duration: z.number().min(0),
        isLive: z.boolean().default(false),
        showId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if show exists
      const show = await ctx.prisma.radioShow.findUnique({
        where: { id: input.showId },
      })

      if (!show) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Radio show not found",
        })
      }

      // Create radio episode
      const episode = await ctx.prisma.radioEpisode.create({
        data: input,
      })

      return episode
    }),

  // Update radio episode
  updateEpisode: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        audioUrl: z.string().optional(),
        imageUrl: z.string().optional(),
        airDate: z.date().optional(),
        duration: z.number().min(0).optional(),
        isLive: z.boolean().optional(),
        showId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      // Check if radio episode exists
      const existingEpisode = await ctx.prisma.radioEpisode.findUnique({
        where: { id },
      })

      if (!existingEpisode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Radio episode not found",
        })
      }

      // If showId is provided, check if show exists
      if (data.showId) {
        const show = await ctx.prisma.radioShow.findUnique({
          where: { id: data.showId },
        })

        if (!show) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Radio show not found",
          })
        }
      }

      // Update radio episode
      const episode = await ctx.prisma.radioEpisode.update({
        where: { id },
        data,
      })

      return episode
    }),

  // Delete radio episode
  deleteEpisode: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if radio episode exists
      const existingEpisode = await ctx.prisma.radioEpisode.findUnique({
        where: { id: input.id },
      })

      if (!existingEpisode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Radio episode not found",
        })
      }

      // Delete radio episode
      await ctx.prisma.radioEpisode.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get radio schedule
  getSchedule: adminProcedure
    .input(
      z.object({
        date: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const date = input.date || new Date()

      // Get start and end of the week
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay()) // Sunday
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Saturday
      endOfWeek.setHours(23, 59, 59, 999)

      // Get all episodes for the week
      const episodes = await ctx.prisma.radioEpisode.findMany({
        where: {
          airDate: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
        include: {
          show: true,
        },
        orderBy: {
          airDate: "asc",
        },
      })

      // Get recurring shows
      const recurringShows = await ctx.prisma.radioShow.findMany({
        where: {
          isRecurring: true,
        },
      })

      // Organize by day
      const schedule: Record<string, any[]> = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      }

      // Add episodes to schedule
      for (const episode of episodes) {
        const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
          episode.airDate.getDay()
        ]
        schedule[day].push({
          type: "episode",
          id: episode.id,
          title: episode.title,
          showTitle: episode.show.title,
          startTime: episode.airDate,
          duration: episode.duration,
          isLive: episode.isLive,
        })
      }

      // Add recurring shows to schedule
      for (const show of recurringShows) {
        if (show.recurringDays) {
          const days = show.recurringDays.split(",").map((d) => Number.parseInt(d.trim()))

          for (const day of days) {
            const dayName = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][day]

            // Check if there's already an episode for this show on this day
            const hasEpisode = schedule[dayName].some(
              (item) => item.type === "episode" && item.showTitle === show.title,
            )

            if (!hasEpisode) {
              schedule[dayName].push({
                type: "recurring",
                id: show.id,
                title: show.title,
                startTime: show.startTime,
                endTime: show.endTime,
                description: show.description,
              })
            }
          }
        }
      }

      return {
        startOfWeek,
        endOfWeek,
        schedule,
      }
    }),

  // Get radio stats
  getRadioStats: adminProcedure.query(async ({ ctx }) => {
    // Get total shows
    const totalShows = await ctx.prisma.radioShow.count()

    // Get total episodes
    const totalEpisodes = await ctx.prisma.radioEpisode.count()

    // Get live episodes
    const liveEpisodes = await ctx.prisma.radioEpisode.count({
      where: { isLive: true },
    })

    // Get upcoming episodes (next 7 days)
    const now = new Date()
    const nextWeek = new Date(now)
    nextWeek.setDate(now.getDate() + 7)

    const upcomingEpisodes = await ctx.prisma.radioEpisode.count({
      where: {
        airDate: {
          gte: now,
          lte: nextWeek,
        },
      },
    })

    // Get most recent episodes
    const recentEpisodes = await ctx.prisma.radioEpisode.findMany({
      take: 5,
      orderBy: {
        airDate: "desc",
      },
      include: {
        show: true,
      },
    })

    return {
      totalShows,
      totalEpisodes,
      liveEpisodes,
      upcomingEpisodes,
      recentEpisodes,
    }
  }),
})

