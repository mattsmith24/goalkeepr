import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    goalsTable,
    habitRecordsTable,
    habitsTable,
    measurementsTable,
    measurementRecordsTable,
    milestonesTable,
} from '$lib/server/db/schema';

const chain: Record<string, ReturnType<typeof vi.fn>> = {};

chain.delete = vi.fn(() => chain);
chain.insert = vi.fn(() => chain);
chain.values = vi.fn(() => chain);
chain.where = vi.fn(() => chain);
chain.returning = vi.fn(() => chain);
chain.run = vi.fn(() => ({ changes: 1 }));

let nextId = 0;
chain.all = vi.fn(() => [{ id: ++nextId }]);

const dbMock = {
    transaction: vi.fn((cb: (tx: typeof chain) => void) => cb(chain)),
};

vi.mock('$lib/server/db', () => ({ db: dbMock }));

const { POST } = await import('../../routes/api/import/+server');

beforeEach(() => {
    for (const fn of Object.values(chain)) {
        fn.mockClear();
    }
    dbMock.transaction.mockClear();
    nextId = 0;
});

function makeRequest(body: unknown): Request {
    return new Request('http://localhost/api/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: typeof body === 'string' ? body : JSON.stringify(body),
    });
}

const event = (request: Request) =>
    ({
        request,
        locals: { user: { id: 'u1' } },
    }) as unknown as Parameters<typeof POST>[0];

describe('POST /api/import', () => {
    it('returns 400 when the request body is not valid JSON', async () => {
        const response = await POST(event(makeRequest('{not valid')));
        expect(response.status).toBe(400);
        expect(dbMock.transaction).not.toHaveBeenCalled();
    });

    it('returns 400 when the import shape is invalid', async () => {
        const response = await POST(
            event(makeRequest({ description: 'no arrays here' })),
        );
        expect(response.status).toBe(400);
        expect(dbMock.transaction).not.toHaveBeenCalled();
    });

    it('overwrites with an empty array by deleting only the authenticated user’s goals', async () => {
        const response = await POST(event(makeRequest([])));
        expect(response.status).toBe(200);

        expect(dbMock.transaction).toHaveBeenCalledOnce();
        expect(chain.delete).toHaveBeenCalledOnce();
        expect(chain.delete.mock.calls[0][0]).toBe(goalsTable);
        expect(chain.where).toHaveBeenCalledOnce();
        expect(chain.run).toHaveBeenCalledOnce();
        expect(chain.insert).not.toHaveBeenCalled();
    });

    it('imports goals, milestones, habits, measurements, and records with new ids threaded from the authenticated user', async () => {
        const payload = [
            {
                title: 'Get fit',
                description: 'I want to feel healthier',
                milestones: [
                    {
                        description: 'Run 5k',
                        dueDate: null,
                        doneDate: null,
                        note: null,
                    },
                ],
                habits: [
                    {
                        description: 'Jog',
                        schedule: 'daily',
                        count: 1,
                        period: 1,
                        records: [{ date: '2026-08-17', note: null }],
                    },
                ],
                measurements: [
                    {
                        description: 'Weight',
                        records: [
                            {
                                date: '2026-08-17',
                                value: 70.5,
                                note: null,
                            },
                        ],
                    },
                ],
            },
        ];

        const response = await POST(event(makeRequest(payload)));
        expect(response.status).toBe(200);

        expect(chain.insert.mock.calls.map((c) => c[0])).toEqual([
            goalsTable,
            milestonesTable,
            habitsTable,
            habitRecordsTable,
            measurementsTable,
            measurementRecordsTable,
        ]);

        const valuesArgs = chain.values.mock.calls.map((c) => c[0]);
        expect(valuesArgs[0]).toEqual({
            title: 'Get fit',
            description: 'I want to feel healthier',
            userId: 'u1',
        });
        expect(valuesArgs[1]).toEqual([
            {
                goalId: 1,
                description: 'Run 5k',
                dueDate: null,
                doneDate: null,
                note: null,
            },
        ]);
        expect(valuesArgs[2]).toEqual({
            goalId: 1,
            description: 'Jog',
            schedule: 'daily',
            count: 1,
            period: 1,
        });
        expect(valuesArgs[3]).toEqual([
            { habitId: 2, date: '2026-08-17', note: null },
        ]);
        expect(valuesArgs[4]).toEqual({
            goalId: 1,
            description: 'Weight',
        });
        expect(valuesArgs[5]).toEqual([
            {
                measurementId: 3,
                date: '2026-08-17',
                value: 70.5,
                note: null,
            },
        ]);
    });
});
