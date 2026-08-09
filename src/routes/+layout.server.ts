import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

const PUBLIC_ROUTE_IDS = new Set(['/sign-in', '/sign-up']);

export const load: LayoutServerLoad = (event) => {
    if (!event.locals.user && !PUBLIC_ROUTE_IDS.has(event.route.id ?? '')) {
        return redirect(302, resolve('/sign-in'));
    }
    return {
        user: event.locals.user,
        signupsEnabled: !(env.SIGNUPS_ENABLED === 'false' || env.SIGNUPS_ENABLED === '0'),
    };
};
