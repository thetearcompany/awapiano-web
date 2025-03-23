import { z } from "zod"
import { router } from "@/server/index"
import { adminProcedure } from "@/server/procedures/adminProcedure"

export const adminAnalyticsRouter = router({
  // Get overview metrics
  getOverviewMetrics: adminProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { period } = input

      // Calculate date range based on period
      const now = new Date()
      let startDate: Date

      switch (period) {
        case "day":
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 1)
          break
        case "week":
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate = new Date(now)
          startDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          startDate = new Date(now)
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Get user metrics
      const totalUsers = await ctx.prisma.user.count()
      const newUsers = await ctx.prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      })

      // Get content metrics
      const totalTracks = await ctx.prisma.track.count()
      const newTracks = await ctx.prisma.track.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      })

      const totalArticles = await ctx.prisma.article.count()
      const newArticles = await ctx.prisma.article.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      })

      // Get engagement metrics
      const totalPlaybacks = await ctx.prisma.playback.count()
      const newPlaybacks = await ctx.prisma.playback.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      })

      const totalPageViews = await ctx.prisma.pageView.count()
      const newPageViews = await ctx.prisma.pageView.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      })

      // Get revenue metrics
      const totalRevenue = await ctx.prisma.order.aggregate({
        where: {
          status: "PAID",
        },
        _sum: {
          total: true,
        },
      })

      const periodRevenue = await ctx.prisma.order.aggregate({
        where: {
          status: "PAID",
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          total: true,
        },
      })

      return {
        users: {
          total: totalUsers,
          new: newUsers,
          growth: totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0,
        },
        content: {
          tracks: {
            total: totalTracks,
            new: newTracks,
            growth: totalTracks > 0 ? (newTracks / totalTracks) * 100 : 0,
          },
          articles: {
            total: totalArticles,
            new: newArticles,
            growth: totalArticles > 0 ? (newArticles / totalArticles) * 100 : 0,
          },
        },
        engagement: {
          playbacks: {
            total: totalPlaybacks,
            new: newPlaybacks,
            growth: totalPlaybacks > 0 ? (newPlaybacks / totalPlaybacks) * 100 : 0,
          },
          pageViews: {
            total: totalPageViews,
            new: newPageViews,
            growth: totalPageViews > 0 ? (newPageViews / totalPageViews) * 100 : 0,
          },
        },
        revenue: {
          total: totalRevenue._sum.total || 0,
          period: periodRevenue._sum.total || 0,
          growth:
            totalRevenue._sum.total && totalRevenue._sum.total > 0
              ? ((periodRevenue._sum.total || 0) / totalRevenue._sum.total) * 100
              : 0,
        },
      }
    }),

  // Get user analytics
  getUserAnalytics: adminProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { period, startDate: inputStartDate, endDate: inputEndDate } = input

      // Calculate date range based on period or use provided dates
      const now = new Date()
      const startDate = inputStartDate || new Date()
      const endDate = inputEndDate || now

      if (!inputStartDate) {
        switch (period) {
          case "day":
            startDate.setDate(now.getDate() - 1)
            break
          case "week":
            startDate.setDate(now.getDate() - 7)
            break
          case "month":
            startDate.setMonth(now.getMonth() - 1)
            break
          case "year":
            startDate.setFullYear(now.getFullYear() - 1)
            break
        }
      }

      // Get user signups by day
      const userSignups = await ctx.prisma.user.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
      })

      // Get user roles distribution
      const userRoles = await ctx.prisma.user.groupBy({
        by: ["role"],
        _count: true,
      })

      // Get active users (users who have logged in or performed actions)
      const activeUsers = await ctx.prisma.event.groupBy({
        by: ["userId"],
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          name: "user.login",
        },
        _count: true,
      })

      // Get user retention (users who have returned after initial signup)
      // This is a simplified version - in a real app, you'd need more complex logic
      const retentionData = await ctx.prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', "createdAt") as signup_date,
          COUNT(DISTINCT id) as total_users,
          COUNT(DISTINCT CASE WHEN EXISTS (
            SELECT 1 FROM "Event" 
            WHERE "Event"."userId" = "User".id 
            AND "Event"."createdAt" > "User"."createdAt" + INTERVAL '7 days'
          ) THEN id END) as retained_users
        FROM "User"
        WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
        GROUP BY signup_date
        ORDER BY signup_date
      `

      return {
        signups: userSignups.map((day) => ({
          date: day.createdAt,
          count: day._count,
        })),
        roles: userRoles.map((role) => ({
          role: role.role,
          count: role._count,
        })),
        activeUsers: activeUsers.length,
        retention: retentionData,
      }
    }),

  // Get content analytics
  getContentAnalytics: adminProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
        contentType: z.enum(["all", "tracks", "articles"]).default("all"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { period, contentType } = input

      // Calculate date range based on period
      const now = new Date()
      const startDate = new Date()

      switch (period) {
        case "day":
          startDate.setDate(now.getDate() - 1)
          break
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Get track metrics
      let trackMetrics = {}
      if (contentType === "all" || contentType === "tracks") {
        const trackCreation = await ctx.prisma.track.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: {
              gte: startDate,
            },
          },
          _count: true,
        })

        const trackPlaybacks = await ctx.prisma.playback.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: {
              gte: startDate,
            },
          },
          _count: true,
        })

        const popularTracks = await ctx.prisma.playback.groupBy({
          by: ["trackId"],
          where: {
            createdAt: {
              gte: startDate,
            },
          },
          _count: true,
          orderBy: {
            _count: {
              createdAt: "desc",
            },
          },
          take: 10,
        })

        const trackIds = popularTracks.map((item) => item.trackId)
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

        trackMetrics = {
          creation: trackCreation.map((day) => ({
            date: day.createdAt,
            count: day._count,
          })),
          playbacks: trackPlaybacks.map((day) => ({
            date: day.createdAt,
            count: day._count,
          })),
          popular: popularTracks.map((item) => ({
            trackId: item.trackId,
            count: item._count,
            track: tracks.find((t) => t.id === item.trackId),
          })),
        }
      }

      // Get article metrics
      let articleMetrics = {}
      if (contentType === "all" || contentType === "articles") {
        const articleCreation = await ctx.prisma.article.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: {
              gte: startDate,
            },
          },
          _count: true,
        })

        const articleViews = await ctx.prisma.pageView.groupBy({
          by: ["path", "createdAt"],
          where: {
            path: {
              startsWith: "/blog/",
            },
            createdAt: {
              gte: startDate,
            },
          },
          _count: true,
        })

        const popularArticlePaths = await ctx.prisma.pageView.groupBy({
          by: ["path"],
          where: {
            path: {
              startsWith: "/blog/",
            },
            createdAt: {
              gte: startDate,
            },
          },
          _count: true,
          orderBy: {
            _count: {
              createdAt: "desc",
            },
          },
          take: 10,
        })

        // Extract slugs from paths
        const slugs = popularArticlePaths.map((item) => {
          const parts = item.path.split("/")
          return parts[parts.length - 1]
        })

        const articles = await ctx.prisma.article.findMany({
          where: {
            slug: {
              in: slugs,
            },
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })

        articleMetrics = {
          creation: articleCreation.map((day) => ({
            date: day.createdAt,
            count: day._count,
          })),
          views: articleViews.map((item) => ({
            path: item.path,
            date: item.createdAt,
            count: item._count,
          })),
          popular: popularArticlePaths.map((item) => {
            const slug = item.path.split("/").pop()
            return {
              path: item.path,
              count: item._count,
              article: articles.find((a) => a.slug === slug),
            }
          }),
        }
      }

      return {
        tracks: trackMetrics,
        articles: articleMetrics,
      }
    }),

  // Get revenue analytics
  getRevenueAnalytics: adminProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { period } = input

      // Calculate date range based on period
      const now = new Date()
      const startDate = new Date()

      switch (period) {
        case "day":
          startDate.setDate(now.getDate() - 1)
          break
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Get orders by day
      const ordersByDay = await ctx.prisma.order.groupBy({
        by: ["createdAt", "status"],
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          total: true,
        },
        _count: true,
      })

      // Get revenue by product type
      const revenueByProductType = await ctx.prisma.$queryRaw`
        SELECT 
          p.type,
          SUM(oi.price * oi.quantity) as revenue
        FROM "OrderItem" oi
        JOIN "Product" p ON oi."productId" = p.id
        JOIN "Order" o ON oi."orderId" = o.id
        WHERE o.status = 'PAID' AND o."createdAt" >= ${startDate}
        GROUP BY p.type
      `

      // Get top selling products
      const topSellingProducts = await ctx.prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          order: {
            status: "PAID",
            createdAt: {
              gte: startDate,
            },
          },
        },
        _sum: {
          quantity: true,
          price: true,
        },
        orderBy: {
          _sum: {
            price: "desc",
          },
        },
        take: 10,
      })

      const productIds = topSellingProducts.map((item) => item.productId)
      const products = await ctx.prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      })

      return {
        ordersByDay: ordersByDay.map((item) => ({
          date: item.createdAt,
          status: item.status,
          count: item._count,
          total: item._sum.total || 0,
        })),
        revenueByProductType,
        topSellingProducts: topSellingProducts.map((item) => ({
          productId: item.productId,
          quantity: item._sum.quantity || 0,
          revenue: item._sum.price || 0,
          product: products.find((p) => p.id === item.productId),
        })),
      }
    }),

  // Get page views
  getPageViews: adminProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
        path: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { period, path } = input

      // Calculate date range based on period
      const now = new Date()
      const startDate = new Date()

      switch (period) {
        case "day":
          startDate.setDate(now.getDate() - 1)
          break
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Get page views by day
      const viewsByDay = await ctx.prisma.pageView.groupBy({
        by: ["createdAt"],
        where: {
          ...(path && { path }),
          createdAt: {
            gte: startDate,
          },
        },
        _count: true,
      })

      // Get top pages
      const topPages = await ctx.prisma.pageView.groupBy({
        by: ["path"],
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _count: true,
        orderBy: {
          _count: {
            createdAt: "desc",
          },
        },
        take: 10,
      })

      // Get referrers
      const referrers = await ctx.prisma.pageView.groupBy({
        by: ["referrer"],
        where: {
          createdAt: {
            gte: startDate,
          },
          referrer: {
            not: null,
          },
        },
        _count: true,
        orderBy: {
          _count: {
            referrer: "desc",
          },
        },
        take: 10,
      })

      return {
        viewsByDay: viewsByDay.map((day) => ({
          date: day.createdAt,
          count: day._count,
        })),
        topPages: topPages.map((page) => ({
          path: page.path,
          count: page._count,
        })),
        referrers: referrers.map((ref) => ({
          referrer: ref.referrer,
          count: ref._count,
        })),
      }
    }),
})

