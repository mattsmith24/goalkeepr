import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { env } from '$env/dynamic/private';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = (event) => {
    if (event.locals.user) {
        return redirect(302, resolve('/'));
    }
    return {
        signupsEnabled: !(env.SIGNUPS_ENABLED === 'false' || env.SIGNUPS_ENABLED === '0'),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const email = data.get('email')?.toString().trim() ?? '';
        const password = data.get('password')?.toString() ?? '';

        if (!email || !password) {
            return fail(400, { message: 'Email and password are required.' });
        }

        try {
            await auth.api.signInEmail({
                body: { email, password },
            });
        } catch (err) {
            if (err instanceof APIError) {
                return fail(400, { message: err.message });
            }
            throw err;
        }

        return redirect(302, resolve('/'));
    },
};
