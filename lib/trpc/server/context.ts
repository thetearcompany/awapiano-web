import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContext(opts: FetchCreateContextFnOptions) {
    return {
        // Add any context properties you need
        req: opts.req,
        resHeaders: opts.resHeaders,
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>; 