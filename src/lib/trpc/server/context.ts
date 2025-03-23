import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const session = await getServerSession(authOptions)

  return {
    session,
    headers: opts?.req.headers,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

