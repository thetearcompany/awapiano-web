import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const session = await getServerSession(authOptions)

  return {
    session,
    headers: opts?.req.headers,
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

