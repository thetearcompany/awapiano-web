import { router } from "../../../index"
import { adminProcedure } from "../../middlewares/admin"

export const adminDashboardRouter = router({
  // Get dashboard metrics
  getMetrics: adminProcedure.query(async ({ ctx }) => {
    // Get user count
    const userCount = await ctx.prisma.user.count()

    // Get active listeners (users who have played a track in the last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const activeListeners = await ctx.prisma.playback.count({
      where: {
        createdAt: {
          gte: oneDayAgo,
        },
      },
      distinct: ["userId", "ipAddress"],
    })

    // Get total revenue
    const totalRevenue = await ctx.prisma.order.aggregate({
      where: {
        status: "PAID",
      },
      _sum: {
        total: true,
      },
    })

    // Get content count
    const trackCount = await ctx.prisma.track.count()
    const articleCount = await ctx.prisma.article.count()
    const contentCount = trackCount + articleCount

    // Get recent orders
    const recentOrders = await ctx.prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Get popular content
    const popularTracks = await ctx.prisma.playback.groupBy({
      by: ["trackId"],
      _count: {
        trackId: true,
      },
      orderBy: {
        _count: {
          trackId: "desc",
        },
      },
      take: 5,
    })

    const trackIds = popularTracks.map((track) => track.trackId)
    const tracks = await ctx.prisma.track.findMany({
      where: {
        id: {
          in: trackIds,
        },
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const popularArticles = await ctx.prisma.pageView.groupBy({
      by: ["path"],
      _count: {
        path: true,
      },
      where: {
        path: {
          startsWith: "/blog/",
        },
      },
      orderBy: {
        _count: {
          path: "desc",
        },
      },
      take: 5,
    })

    // Get recent activity
    const recentActivity = await ctx.prisma.event.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return {
      metrics: {
        userCount,
        activeListeners,
        revenue: totalRevenue._sum.total || 0,
        contentCount,
      },
      recentOrders,
      popularContent: {
        tracks: tracks.map((track) => ({
          ...track,
          plays: popularTracks.find((t) => t.trackId === track.id)?._count.trackId || 0,
        })),
        articles: popularArticles,
      },
      recentActivity,
    }
  }),

  // Get user growth data for chart
  getUserGrowthData: adminProcedure.query(async ({ ctx }) => {
    // Get user signups by day for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const userSignups = await ctx.prisma.user.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
    })

    // Format data for chart
    const formattedData = userSignups.map((signup) => ({
      date: signup.createdAt.toISOString().split("T")[0],
      count: signup._count,
    }))

    return formattedData
  }),

  // Get content creation data for chart
  getContentData: adminProcedure.query(async ({ ctx }) => {
    // Get content creation by day for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const trackCreation = await ctx.prisma.track.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
    })

    const articleCreation = await ctx.prisma.article.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
    })

    // Format data for chart
    const formattedTrackData = trackCreation.map((track) => ({
      date: track.createdAt.toISOString().split("T")[0],
      type: "track",
      count: track._count,
    }))

    const formattedArticleData = articleCreation.map((article) => ({
      date: article.createdAt.toISOString().split("T")[0],
      type: "article",
      count: article._count,
    }))

    return [...formattedTrackData, ...formattedArticleData]
  }),

  // Get revenue data for chart
  getRevenueData: adminProcedure.query(async ({ ctx }) => {
    // Get revenue by day for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const orders = await ctx.prisma.order.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        status: "PAID",
      },
      select: {
        createdAt: true,
        total: true,
      },
    })

    // Group by day
    const revenueByDay = orders.reduce(
      (acc, order) => {
        const date = order.createdAt.toISOString().split("T")[0]
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += order.total
        return acc
      },
      {} as Record<string, number>,
    )

    // Format data for chart
    const formattedData = Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }))

    return formattedData
  }),
})

