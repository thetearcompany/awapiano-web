import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/lib/trpc/server/routers/_app"
import { createContext } from "@/lib/trpc/server/context"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  })

export { handler as GET, handler as POST }

