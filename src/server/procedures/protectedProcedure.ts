import { middleware, publicProcedure } from "@/server/index"
import { TRPCError } from "@trpc/server"

export const isAuthenticated = middleware(async ({ ctx, next }) => {
    const current = await ctx.sessionService.current()
    if (!current) throw new TRPCError({ code: "UNAUTHORIZED" })
    return next({
        ctx: {
            ...ctx,
            user: current.user,
        }
    })
})

export const protectedProcedure = publicProcedure.use(isAuthenticated)