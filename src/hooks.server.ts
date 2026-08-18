import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { error } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const PUBLIC_API_PREFIXES = ['/api/auth'];

const handleBetterAuth: Handle = async ({ event, resolve }) => {
    const session = await auth.api.getSession({
        headers: event.request.headers,
    });

    if (session) {
        event.locals.session = session.session;
        event.locals.user = session.user;
    }

    const path = event.url.pathname;
    const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) =>
        path.startsWith(prefix),
    );

    if (!event.locals.user && path.startsWith('/api/') && !isPublicApi) {
        throw error(401, 'Unauthorized');
    }

    return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
