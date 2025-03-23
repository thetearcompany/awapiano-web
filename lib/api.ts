'use client';
import { createTRPCReact } from '@trpc/react-query';

import { loggerLink } from '@trpc/client';
import {
    experimental_createTRPCNextAppDirClient,
} from '@trpc/next/app-dir/client';
import { experimental_nextHttpLink } from '@trpc/next/app-dir/links/nextHttp';
import type { AppRouter } from '@/server/routers/_app';
import { getUrl, transformer } from '@/utils/shared';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
    config() {
        return {
            links: [
                loggerLink({
                    enabled: (op) => true,
                }),
                experimental_nextHttpLink({
                    transformer,
                    batch: true,
                    url: getUrl(),
                    headers() {
                        return {
                            'x-trpc-source': 'client',
                        };
                    },
                }),
            ],
        };
    },
});

export const { createClient, Provider: APIProvider } = createTRPCReact<AppRouter>();

// Types for inputs/outputs of router
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>