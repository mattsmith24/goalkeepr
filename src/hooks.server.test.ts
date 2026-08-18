import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSession = vi.fn();

vi.mock('$lib/server/auth', () => ({
    auth: { api: { getSession } },
}));

const svelteKitHandler = vi.fn();

vi.mock('better-auth/svelte-kit', () => ({
    svelteKitHandler,
}));

const { handle } = await import('./hooks.server');

const resolve = vi.fn((event: { locals: Record<string, unknown> }) => {
    event.locals.response = new Response('resolved');
    return new Response('ok');
}) as unknown as Parameters<typeof handle>[0]['resolve'];

beforeEach(() => {
    getSession.mockReset();
    svelteKitHandler.mockReset();
    svelteKitHandler.mockImplementation(({ resolve: r, event }) => r(event));
});

function makeEvent(pathname: string): Parameters<typeof handle>[0]['event'] {
    return {
        url: new URL(`http://localhost${pathname}`),
        request: { headers: new Headers() },
        locals: {},
    } as unknown as Parameters<typeof handle>[0]['event'];
}

describe('handle (hooks.server)', () => {
    it('returns 401 for unauthenticated requests to a non-public /api/* path', async () => {
        getSession.mockResolvedValue(null);

        await expect(
            handle({ event: makeEvent('/api/export'), resolve }),
        ).rejects.toMatchObject({ status: 401 });

        expect(svelteKitHandler).not.toHaveBeenCalled();
    });

    it('lets unauthenticated requests through to /api/auth/*', async () => {
        getSession.mockResolvedValue(null);

        await handle({ event: makeEvent('/api/auth/sign-in'), resolve });

        expect(svelteKitHandler).toHaveBeenCalledOnce();
    });

    it('sets event.locals.user and session when a session is present', async () => {
        getSession.mockResolvedValue({
            session: { id: 's1' },
            user: { id: 'u1', email: 'u@example.com' },
        });

        const event = makeEvent('/api/whatever');
        await handle({ event, resolve });

        expect(event.locals.user).toEqual({
            id: 'u1',
            email: 'u@example.com',
        });
        expect(event.locals.session).toEqual({ id: 's1' });
    });

    it('does not 401 page routes for unauthenticated users (the layout handles the redirect)', async () => {
        getSession.mockResolvedValue(null);

        await handle({ event: makeEvent('/'), resolve });

        expect(svelteKitHandler).toHaveBeenCalledOnce();
    });
});
