import { TRPCError } from "@trpc/server"
import { middleware } from "../index"
import { UserRole } from "@prisma/client"

export const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  // Fetch user with role from database
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { role: true },
  })

  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource",
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: {
        ...ctx.session.user,
        role: user.role,
      },
    },
  })
})

export const adminProcedure = isAdmin

