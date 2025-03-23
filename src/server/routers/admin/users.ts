import { z } from "zod"
import { router } from "../../../index"
import { adminProcedure } from "../../middlewares/admin"
import { TRPCError } from "@trpc/server"
import { UserRole } from "@prisma/client"

export const adminUsersRouter = router({
  // Get all users with pagination and filtering
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        role: z.nativeEnum(UserRole).optional(),
        sortBy: z.enum(["name", "email", "createdAt", "role"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, role, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(role && { role }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const users = await ctx.prisma.user.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              tracks: true,
              articles: true,
              orders: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (users.length > limit) {
        const nextItem = users.pop()
        nextCursor = nextItem?.id
      }

      return {
        users,
        nextCursor,
      }
    }),

  // Get user by ID
  getUserById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          accounts: true,
          posts: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
          tracks: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
          articles: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
          orders: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              posts: true,
              tracks: true,
              articles: true,
              orders: true,
              followers: true,
              following: true,
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      return user
    }),

  // Update user
  updateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        role: z.nativeEnum(UserRole).optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        website: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      // Check if user exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { id },
      })

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      // Check if email is already taken by another user
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await ctx.prisma.user.findUnique({
          where: { email: data.email },
        })

        if (emailExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email is already taken",
          })
        }
      }

      // Update user
      const user = await ctx.prisma.user.update({
        where: { id },
        data,
      })

      return user
    }),

  // Delete user
  deleteUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      })

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      // Prevent deleting super admin
      if (existingUser.role === UserRole.SUPER_ADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete super admin user",
        })
      }

      // Delete user
      await ctx.prisma.user.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get user roles count
  getUserRolesCount: adminProcedure.query(async ({ ctx }) => {
    const roleCount = await ctx.prisma.user.groupBy({
      by: ["role"],
      _count: true,
    })

    const formattedRoleCount = Object.values(UserRole).map((role) => {
      const count = roleCount.find((r) => r.role === role)?._count || 0
      return { role, count }
    })

    return formattedRoleCount
  }),

  // Get user activity
  getUserActivity: adminProcedure
    .input(
      z.object({
        id: z.string(),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id, limit } = input

      // Get recent events for this user
      const events = await ctx.prisma.event.findMany({
        where: { userId: id },
        take: limit,
        orderBy: { createdAt: "desc" },
      })

      return events
    }),
})

