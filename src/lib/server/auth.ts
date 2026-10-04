import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    advanced: {
        // Namespaces session cookies so running several instances (dev,
        // preview, production) on the same domain doesn't have them clobber
        // each other. Must live under `advanced` — a top-level key is ignored.
        cookiePrefix: env.AUTH_COOKIE_PREFIX || 'goalkeepr',
    },
    emailAndPassword: {
        enabled: true,
        disableSignUp:
            env.SIGNUPS_ENABLED === 'false' || env.SIGNUPS_ENABLED === '0',
    },
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        },
    },
    plugins: [
        sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
    ],
});
