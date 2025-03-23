import { Temporal } from '@js-temporal/polyfill';
import {
    defaultShouldDehydrateQuery,
    QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
}

export function getUrl() {
    return getBaseUrl() + '/api/trpc';
}

superjson.registerCustom(
    {
        isApplicable: (v): v is Temporal.PlainDate =>
            v instanceof Temporal.PlainDate,
        serialize: (v) => v.toJSON(),
        deserialize: (v) => Temporal.PlainDate.from(v),
    },
    'Temporal.PlainDate',
);

superjson.registerCustom(
    {
        isApplicable: (v): v is Temporal.PlainDateTime =>
            v instanceof Temporal.PlainDateTime,
        serialize: (v) => v.toJSON(),
        deserialize: (v) => Temporal.PlainDateTime.from(v),
    },
    'Temporal.PlainDateTime',
);

export const transformer = superjson;

export const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 30,
            },
            dehydrate: {
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
                serializeData: transformer.serialize,
            },
            hydrate: {
                deserializeData: transformer.deserialize,
            },
        },
    });