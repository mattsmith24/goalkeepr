import { test, expect } from '@playwright/test';
import { resetDb } from './db';
import { signUpAndSignIn } from './auth';

test.beforeEach(async ({ page }) => {
    resetDb();
    await signUpAndSignIn(page);
});

async function addGoalAndOpen(
    page: import('@playwright/test').Page,
    description: string,
) {
    await page.goto('/');
    await page.getByRole('button', { name: /add goal/i }).click();
    await page.getByLabel(/what is your goal\?/i).fill(description);
    await page.getByRole('button', { name: /^add goal$/i }).click();
    await page.getByRole('link', { name: description }).click();
    await expect(
        page.getByRole('heading', { level: 1, name: description }),
    ).toBeVisible();
}

async function addMilestone(
    page: import('@playwright/test').Page,
    description: string,
) {
    await page.getByRole('button', { name: /add milestone/i }).click();
    await page.getByLabel(/^what is the milestone\?$/i).fill(description);
    await page.getByRole('button', { name: /^add milestone$/i }).click();
    await expect(
        page.getByRole('listitem').filter({ hasText: description }),
    ).toBeVisible();
}

async function addHabit(
    page: import('@playwright/test').Page,
    description: string,
) {
    await page.getByRole('button', { name: /add habit/i }).click();
    await page.getByLabel(/^what is your habit\?$/i).fill(description);
    await page.getByRole('button', { name: /^add habit$/i }).click();
    await expect(
        page.getByRole('listitem').filter({ hasText: description }),
    ).toBeVisible();
}

async function addMeasurement(
    page: import('@playwright/test').Page,
    description: string,
) {
    await page.getByRole('button', { name: /add measurement/i }).click();
    await page.getByLabel(/^what are you measuring\?$/i).fill(description);
    await page.getByRole('button', { name: /^add measurement$/i }).click();
    await expect(
        page.getByRole('listitem').filter({ hasText: description }),
    ).toBeVisible();
}

test('completing a goal locks the goal page UI and rejects server edits', async ({
    page,
}) => {
    const goal = `E2E readonly goal ${Date.now()}`;
    const milestone = `E2E readonly milestone ${Date.now()}`;
    const habit = `E2E readonly habit ${Date.now()}`;
    const measurement = `E2E readonly measurement ${Date.now()}`;

    await addGoalAndOpen(page, goal);

    // Populate with a milestone, habit, measurement.
    await addMilestone(page, milestone);
    await addHabit(page, habit);
    await addMeasurement(page, measurement);

    // Complete the goal.
    await page
        .getByRole('button', { name: /mark as complete/i, exact: true })
        .click();
    await expect(
        page.getByRole('button', { name: /reopen/i, exact: true }),
    ).toBeVisible();

    // Goal title is plain text — no edit button.
    await expect(
        page.getByRole('heading', { level: 1, name: goal }),
    ).toBeVisible();
    await expect(
        page.getByRole('button', { name: goal, exact: true }),
    ).toHaveCount(0);

    // No add affordances for children.
    await expect(
        page.getByRole('button', { name: /^add milestone$/i }),
    ).toHaveCount(0);
    await expect(
        page.getByRole('button', { name: /^add habit$/i }),
    ).toHaveCount(0);
    await expect(
        page.getByRole('button', { name: /^add measurement$/i }),
    ).toHaveCount(0);

    // Existing milestone: no edit/delete affordances.
    const milestoneItem = page
        .getByRole('listitem')
        .filter({ hasText: milestone });
    await expect(
        milestoneItem.getByRole('button', { name: 'Delete', exact: true }),
    ).toHaveCount(0);
    await expect(
        milestoneItem.getByRole('button', { name: /add due date/i }),
    ).toHaveCount(0);
    await expect(
        milestoneItem.getByRole('button', { name: /add done date/i }),
    ).toHaveCount(0);
    await expect(
        milestoneItem.getByRole('button', { name: /add note/i }),
    ).toHaveCount(0);
    await expect(
        milestoneItem.getByRole('button', {
            name: /add extended description/i,
        }),
    ).toHaveCount(0);

    // Existing habit: no edit/delete/mark-done.
    const habitItem = page.getByRole('listitem').filter({ hasText: habit });
    await expect(
        habitItem.getByRole('button', { name: 'Delete', exact: true }),
    ).toHaveCount(0);
    await expect(
        habitItem.getByRole('button', { name: /^mark done$/i }),
    ).toHaveCount(0);

    // Existing measurement: no edit/delete/add-record.
    const measurementItem = page
        .getByRole('listitem')
        .filter({ hasText: measurement });
    await expect(
        measurementItem.getByRole('button', { name: 'Delete', exact: true }),
    ).toHaveCount(0);
    await expect(
        measurementItem.getByRole('button', { name: /^add record$/i }),
    ).toHaveCount(0);

    // Server-side guards are covered by src/lib/server/goal-guard.test.ts.
});

test('reopening a completed goal restores editability', async ({ page }) => {
    const goal = `E2E readonly reopen ${Date.now()}`;

    await addGoalAndOpen(page, goal);
    await page
        .getByRole('button', { name: /mark as complete/i, exact: true })
        .click();
    await expect(
        page.getByRole('button', { name: /reopen/i, exact: true }),
    ).toBeVisible();

    // Reopen.
    await page.getByRole('button', { name: /^reopen$/i, exact: true }).click();

    // Edit affordances are back.
    await expect(
        page.getByRole('button', { name: /^mark as complete$/i, exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole('button', { name: /^add milestone$/i }),
    ).toBeVisible();
    await expect(
        page.getByRole('button', { name: /^add habit$/i }),
    ).toBeVisible();
    await expect(
        page.getByRole('button', { name: /^add measurement$/i }),
    ).toBeVisible();
});
