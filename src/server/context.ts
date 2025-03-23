import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth"
import { createContainer } from "./container"

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const session = await getServerSession(authOptions)
  const container = createContainer(opts);
  return {
    ...container,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

