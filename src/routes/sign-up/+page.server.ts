import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

const signupsEnabled = () =>
    !(env.SIGNUPS_ENABLED === 'false' || env.SIGNUPS_ENABLED === '0');

export const load: PageServerLoad = (event) => {
    if (event.locals.user) {
        return redirect(302, '/');
    }
    if (!signupsEnabled()) {
        return redirect(302, '/sign-in');
    }
    return {};
};

export const actions: Actions = {
    default: async (event) => {
        if (!signupsEnabled()) {
            return fail(403, {
                message: 'Sign up is currently disabled.',
            });
        }

        const data = await event.request.formData();
        const name = data.get('name')?.toString().trim() ?? '';
        const email = data.get('email')?.toString().trim() ?? '';
        const password = data.get('password')?.toString() ?? '';

        if (!name || !email || !password) {
            return fail(400, {
                message: 'Name, email, and password are required.',
            });
        }

        try {
            await auth.api.signUpEmail({
                body: { name, email, password },
            });
        } catch (err) {
            if (err instanceof APIError) {
                return fail(400, { message: err.message });
            }
            throw err;
        }

        return redirect(302, '/');
    },
};
