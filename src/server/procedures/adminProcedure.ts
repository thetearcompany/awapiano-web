import { TRPCError } from "@trpc/server"
import { middleware } from "@/server/index"
import { UserRole } from "@prisma/client"
import { publicProcedure } from "@/server/index"
import { isAuthenticated } from "./protectedProcedure"

export const isAdmin = middleware(async ({ ctx, next }) => {
  const current = await ctx.sessionService.current()
  const userId = current.user.id

  // Fetch user with role from database
  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource",
    })
  }

  return next({
    ctx,
  })
})

export const adminProcedure = publicProcedure.use(isAuthenticated).use(isAdmin)

