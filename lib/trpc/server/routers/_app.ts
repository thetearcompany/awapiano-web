import { initTRPC } from '@trpc/server';
import { Context } from '../context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
    // Here we will add our routes for music and community
    blessing: publicProcedure.query(() => {
        return {
            message: "May your music bring light and healing to all who listen",
        };
    }),
});

export type AppRouter = typeof appRouter; 