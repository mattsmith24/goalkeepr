import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const PUBLIC_PATHS = new Set(['/sign-in', '/sign-up']);

export const load: LayoutServerLoad = (event) => {
    if (!event.locals.user && !PUBLIC_PATHS.has(event.url.pathname)) {
        return redirect(302, '/sign-in');
    }
    return { user: event.locals.user };
};
