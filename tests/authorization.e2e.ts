import {
    expect,
    test,
    type APIResponse,
    type BrowserContext,
    type Page,
} from '@playwright/test';
import Database from 'better-sqlite3';

import { signUpAndSignIn } from './auth';
import { TEST_DB } from './constants';
import { resetDb } from './db';

const BASE_URL = 'http://localhost:4173';
const GOAL = 'Alice private goal';
const MILESTONE = 'Alice private milestone';
const HABIT = 'Alice private habit';
const MEASUREMENT = 'Alice private measurement';
const RECORD_DATE = '2026-01-15';
const RECORD_NOTE = 'Alice private record note';

type ResourceTable = 'goals' | 'milestones' | 'habits' | 'measurements';
type ResourceRow = { id: number; description: string };
type HabitRecordRow = { id: number; date: string; note: string | null };

let aliceContext: BrowserContext | undefined;
let bobContext: BrowserContext | undefined;
let alice: Page;
let bob: Page;

function readResource(
    table: ResourceTable,
    id: number,
): ResourceRow | undefined {
    const db = new Database(TEST_DB, { readonly: true });
    try {
        return db
            .prepare(`SELECT id, description FROM ${table} WHERE id = ?`)
            .get(id) as ResourceRow | undefined;
    } finally {
        db.close();
    }
}

function readResourceByDescription(
    table: ResourceTable,
    description: string,
): ResourceRow {
    const db = new Database(TEST_DB, { readonly: true });
    try {
        const row = db
            .prepare(
                `SELECT id, description FROM ${table} WHERE description = ?`,
            )
            .get(description) as ResourceRow | undefined;
        if (!row) throw new Error(`${table} resource not found`);
        return row;
    } finally {
        db.close();
    }
}

function countResources(table: ResourceTable): number {
    const db = new Database(TEST_DB, { readonly: true });
    try {
        const row = db
            .prepare(`SELECT COUNT(*) AS count FROM ${table}`)
            .get() as { count: number };
        return row.count;
    } finally {
        db.close();
    }
}

function readHabitRecord(habitId: number): HabitRecordRow {
    const db = new Database(TEST_DB, { readonly: true });
    try {
        const row = db
            .prepare(
                `SELECT id, date, note FROM habit_records WHERE habitId = ?`,
            )
            .get(habitId) as HabitRecordRow | undefined;
        if (!row) throw new Error('habit record not found');
        return row;
    } finally {
        db.close();
    }
}

async function createGoal(page: Page): Promise<number> {
    await page.goto('/');
    await page.getByRole('button', { name: /add goal/i }).click();
    await page.getByLabel(/what is your goal\?/i).fill(GOAL);
    await page.getByRole('button', { name: /^add goal$/i }).click();

    const link = page.getByRole('link', { name: GOAL });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    const match = href?.match(/^\/goals\/(\d+)$/);
    if (!match) throw new Error('Goal URL did not contain an ID');
    return Number(match[1]);
}

async function createGoalTree(page: Page) {
    const goalId = await createGoal(page);
    await page.getByRole('link', { name: GOAL }).click();

    await page.getByRole('button', { name: /add milestone/i }).click();
    await page.getByLabel(/what is your milestone\?/i).fill(MILESTONE);
    await page.getByRole('button', { name: /^add milestone$/i }).click();
    await expect(
        page.getByRole('listitem').filter({ hasText: MILESTONE }),
    ).toBeVisible();

    await page.getByRole('button', { name: /add habit/i }).click();
    await page.getByLabel(/what is your habit\?/i).fill(HABIT);
    await page.getByRole('button', { name: /^add habit$/i }).click();
    await expect(
        page.getByRole('listitem').filter({ hasText: HABIT }),
    ).toBeVisible();

    await page.getByRole('button', { name: /add measurement/i }).click();
    await page.getByLabel(/what are you measuring\?/i).fill(MEASUREMENT);
    await page.getByRole('button', { name: /^add measurement$/i }).click();
    await expect(
        page.getByRole('listitem').filter({ hasText: MEASUREMENT }),
    ).toBeVisible();

    return {
        goalId,
        milestone: readResourceByDescription('milestones', MILESTONE),
        habit: readResourceByDescription('habits', HABIT),
        measurement: readResourceByDescription('measurements', MEASUREMENT),
    };
}

async function postAction(path: string, form: Record<string, string | number>) {
    return bob.request.post(new URL(path, BASE_URL).href, {
        form,
        headers: { origin: BASE_URL },
        maxRedirects: 0,
    });
}

async function expectNotFound(response: APIResponse) {
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
        type: 'failure',
        status: 404,
    });
}

test.beforeEach(async ({ browser }) => {
    resetDb();
    aliceContext = await browser.newContext({ baseURL: BASE_URL });
    bobContext = await browser.newContext({ baseURL: BASE_URL });
    alice = await aliceContext.newPage();
    bob = await bobContext.newPage();
    await signUpAndSignIn(alice, { name: 'Alice' });
    await signUpAndSignIn(bob, { name: 'Bob' });
});

test.afterEach(async () => {
    await Promise.all([aliceContext?.close(), bobContext?.close()]);
    aliceContext = undefined;
    bobContext = undefined;
});

test("a user cannot view another user's goal", async () => {
    const goalId = await createGoal(alice);

    await bob.goto('/');
    await expect(bob.getByRole('link', { name: GOAL })).toHaveCount(0);

    const response = await bob.goto(`/goals/${goalId}`);
    expect(response?.status()).toBe(404);
});

test("a user cannot update or delete another user's goal", async () => {
    const goalId = await createGoal(alice);

    const rootUpdate = await postAction('/?/update', {
        id: goalId,
        description: 'Bob changed this goal',
    });
    await expectNotFound(rootUpdate);
    expect(readResource('goals', goalId)).toEqual({
        id: goalId,
        description: GOAL,
    });

    const detailUpdate = await postAction(`/goals/${goalId}?/update`, {
        id: goalId,
        description: 'Bob changed this goal again',
    });
    await expectNotFound(detailUpdate);
    expect(readResource('goals', goalId)).toEqual({
        id: goalId,
        description: GOAL,
    });

    const deletion = await postAction('/?/delete', { id: goalId });
    await expectNotFound(deletion);
    expect(readResource('goals', goalId)).toEqual({
        id: goalId,
        description: GOAL,
    });
});

test("a user cannot create resources under another user's goal", async () => {
    const goalId = await createGoal(alice);
    const attempts = [
        {
            action: 'createMilestone',
            field: 'milestone-description',
            value: 'Bob milestone',
            table: 'milestones',
        },
        {
            action: 'createHabit',
            field: 'habit-description',
            value: 'Bob habit',
            table: 'habits',
        },
        {
            action: 'createMeasurement',
            field: 'measurement-description',
            value: 'Bob measurement',
            table: 'measurements',
        },
    ] as const;

    for (const attempt of attempts) {
        const response = await postAction(
            `/goals/${goalId}?/${attempt.action}`,
            {
                [attempt.field]: attempt.value,
            },
        );
        await expectNotFound(response);
        expect(countResources(attempt.table)).toBe(0);
    }
});

test("a user cannot update or delete another user's resources", async () => {
    const { goalId, milestone, habit, measurement } =
        await createGoalTree(alice);
    const resources = [
        {
            table: 'milestones',
            row: milestone,
            updateAction: 'updateMilestone',
            deleteAction: 'deleteMilestone',
        },
        {
            table: 'habits',
            row: habit,
            updateAction: 'updateHabit',
            deleteAction: 'deleteHabit',
        },
        {
            table: 'measurements',
            row: measurement,
            updateAction: 'updateMeasurement',
            deleteAction: 'deleteMeasurement',
        },
    ] as const;

    for (const resource of resources) {
        const update = await postAction(
            `/goals/${goalId}?/${resource.updateAction}`,
            {
                id: resource.row.id,
                description: 'Bob changed this resource',
            },
        );
        await expectNotFound(update);
        expect(readResource(resource.table, resource.row.id)).toEqual(
            resource.row,
        );

        const deletion = await postAction(
            `/goals/${goalId}?/${resource.deleteAction}`,
            {
                id: resource.row.id,
            },
        );
        await expectNotFound(deletion);
        expect(readResource(resource.table, resource.row.id)).toEqual(
            resource.row,
        );
    }
});

test("a user cannot update another user's habit record", async () => {
    const { goalId, habit } = await createGoalTree(alice);

    const item = alice.getByRole('listitem').filter({ hasText: HABIT });
    await item.getByRole('button', { name: /mark done/i }).click();
    await item.getByLabel(/done date/i).fill(RECORD_DATE);
    await item.getByLabel(/^note$/i).fill(RECORD_NOTE);
    await item.getByRole('button', { name: /^save$/i }).click();
    await expect(item.getByRole('link', { name: /history/i })).toBeVisible();

    const record = readHabitRecord(habit.id);

    const update = await postAction(
        `/goals/${goalId}/habits/${habit.id}?/updateHabitRecord`,
        {
            id: record.id,
            date: '2020-01-01',
            note: 'Bob changed this record',
        },
    );
    await expectNotFound(update);
    expect(readHabitRecord(habit.id)).toEqual(record);
});
