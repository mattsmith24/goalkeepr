import { beforeEach, describe, expect, it, vi } from 'vitest';

const goals = [
    {
        id: 1,
        title: 'Get fit',
        description:
            'I want to feel stronger so I can keep up with my kids.',
        userId: 'u1',
    },
    { id: 2, title: 'Read more', description: null, userId: 'u1' },
];

const milestones = [
    {
        id: 10,
        goalId: 1,
        description: 'Run 5k',
        dueDate: null,
        doneDate: null,
        note: null,
    },
    {
        id: 11,
        goalId: 2,
        description: 'Read 12 books',
        dueDate: null,
        doneDate: null,
        note: null,
    },
];

const habits = [
    {
        id: 20,
        goalId: 1,
        description: 'Jog',
        schedule: 'daily',
        count: 1,
        period: 1,
    },
    {
        id: 21,
        goalId: 2,
        description: 'Read 20 min',
        schedule: 'weekly',
        count: 4,
        period: 1,
    },
];

const habitRecords = [
    { id: 100, habitId: 20, date: '2026-08-17', note: null },
    { id: 101, habitId: 20, date: '2026-08-16', note: null },
];

const measurements = [{ id: 30, goalId: 1, description: 'Weight' }];

const measurementRecords = [
    {
        id: 200,
        measurementId: 30,
        date: '2026-08-17',
        value: 70.5,
        note: null,
    },
];

const queue = [
    goals,
    milestones,
    habits,
    measurements,
    habitRecords,
    measurementRecords,
];

let callIndex = 0;

const chain = {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
};

chain.select.mockImplementation(() => chain);
chain.from.mockImplementation(() => chain);
chain.where.mockImplementation(() => Promise.resolve(queue[callIndex++]));

vi.mock('$lib/server/db', () => ({ db: chain }));

const { GET } = await import('../../routes/api/export/+server');

beforeEach(() => {
    callIndex = 0;
});

describe('GET /api/export', () => {
    it('returns the user’s goals nested with milestones, habits, and measurements', async () => {
        const response = await GET({
            locals: { user: { id: 'u1' } },
        } as unknown as Parameters<typeof GET>[0]);

        expect(response.status).toBe(200);
        expect(response.headers.get('content-disposition')).toBe(
            'attachment; filename="export.json"',
        );

        const body = await response.json();
        expect(body).toEqual([
            {
                title: 'Get fit',
                description:
                    'I want to feel stronger so I can keep up with my kids.',
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
                        records: [
                            { date: '2026-08-17', note: null },
                            { date: '2026-08-16', note: null },
                        ],
                    },
                ],
                measurements: [
                    {
                        description: 'Weight',
                        records: [
                            { date: '2026-08-17', value: 70.5, note: null },
                        ],
                    },
                ],
            },
            {
                title: 'Read more',
                description: null,
                milestones: [
                    {
                        description: 'Read 12 books',
                        dueDate: null,
                        doneDate: null,
                        note: null,
                    },
                ],
                habits: [
                    {
                        description: 'Read 20 min',
                        schedule: 'weekly',
                        count: 4,
                        period: 1,
                        records: [],
                    },
                ],
                measurements: [],
            },
        ]);
    });

    it('strips every internal id and foreign key from the response', async () => {
        const response = await GET({
            locals: { user: { id: 'u1' } },
        } as unknown as Parameters<typeof GET>[0]);
        const body = await response.json();
        const json = JSON.stringify(body);
        expect(json).not.toMatch(/"id"\s*:/);
        expect(json).not.toMatch(/"userId"\s*:/);
        expect(json).not.toMatch(/"goalId"\s*:/);
        expect(json).not.toMatch(/"habitId"\s*:/);
        expect(json).not.toMatch(/"measurementId"\s*:/);
    });
});
