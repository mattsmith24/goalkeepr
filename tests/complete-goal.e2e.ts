import { test, expect } from '@playwright/test';
import { resetDb } from './db';
import { signUpAndSignIn } from './auth';

test.beforeEach(async ({ page }) => {
    resetDb();
    await signUpAndSignIn(page);
});

async function addGoal(
    page: import('@playwright/test').Page,
    description: string,
) {
    await page.goto('/');
    await page.getByRole('button', { name: /add goal/i }).click();
    await page.getByLabel(/what is your goal\?/i).fill(description);
    await page.getByRole('button', { name: /^add goal$/i }).click();
    await expect(
        page.getByRole('listitem').filter({ hasText: description }),
    ).toBeVisible();
}

async function openGoal(
    page: import('@playwright/test').Page,
    description: string,
) {
    await page
        .getByRole('link', { name: description, exact: true })
        .first()
        .click();
    await expect(
        page.getByRole('heading', { name: description }),
    ).toBeVisible();
}

async function goalsSection(
    page: import('@playwright/test').Page,
    heading: string,
) {
    const headingEl = page.getByRole('heading', {
        name: heading,
        exact: true,
        level: 2,
    });
    return headingEl.locator('xpath=..');
}

test('marking a goal complete moves it from Goals to the Completed section', async ({
    page,
}) => {
    const title = `E2E complete me ${Date.now()}`;

    await addGoal(page, title);
    await openGoal(page, title);

    await page
        .getByRole('button', { name: /mark as complete/i, exact: true })
        .click();

    await expect(
        page.getByRole('button', { name: /reopen/i, exact: true }),
    ).toBeVisible();

    await page.goto('/');

    const activeSection = await goalsSection(page, 'Goals');
    const completedSection = await goalsSection(page, 'Completed');

    await expect(
        activeSection.getByRole('link', { name: title, exact: true }),
    ).toHaveCount(0);
    await expect(
        completedSection.getByRole('link', { name: title, exact: true }),
    ).toBeVisible();
});

test('reopening a completed goal returns it to the Goals section', async ({
    page,
}) => {
    const title = `E2E reopen-roundtrip me ${Date.now()}`;

    await addGoal(page, title);
    await openGoal(page, title);

    await page
        .getByRole('button', { name: 'Mark as Complete', exact: true })
        .click();
    await expect(
        page.getByRole('button', { name: 'Reopen', exact: true }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Reopen', exact: true }).click();

    await expect(
        page.getByRole('button', { name: 'Mark as Complete', exact: true }),
    ).toBeVisible();

    await page.goto('/');

    const activeSection = await goalsSection(page, 'Goals');
    const completedSection = await goalsSection(page, 'Completed');

    await expect(
        activeSection.getByRole('link', { name: title, exact: true }),
    ).toBeVisible();
    await expect(
        completedSection.getByRole('link', { name: title, exact: true }),
    ).toHaveCount(0);
});

test('completing some goals leaves others in the Goals section', async ({
    page,
}) => {
    const keep = `E2E keep me ${Date.now()}`;
    const complete1 = `E2E complete one ${Date.now()}`;
    const complete2 = `E2E complete two ${Date.now()}`;

    await addGoal(page, keep);
    await addGoal(page, complete1);
    await addGoal(page, complete2);

    await openGoal(page, complete1);
    await page
        .getByRole('button', { name: /mark as complete/i, exact: true })
        .click();
    await page.goto('/');

    await openGoal(page, complete2);
    await page
        .getByRole('button', { name: /mark as complete/i, exact: true })
        .click();
    await page.goto('/');

    const activeSection = await goalsSection(page, 'Goals');
    const completedSection = await goalsSection(page, 'Completed');

    await expect(
        activeSection.getByRole('link', { name: keep, exact: true }),
    ).toBeVisible();
    await expect(
        activeSection.getByRole('link', { name: complete1, exact: true }),
    ).toHaveCount(0);
    await expect(
        activeSection.getByRole('link', { name: complete2, exact: true }),
    ).toHaveCount(0);
    await expect(
        completedSection.getByRole('link', { name: complete1, exact: true }),
    ).toBeVisible();
    await expect(
        completedSection.getByRole('link', { name: complete2, exact: true }),
    ).toBeVisible();
    await expect(
        completedSection.getByRole('link', { name: keep, exact: true }),
    ).toHaveCount(0);
});

test('completed goals remain in the Completed section after a reload', async ({
    page,
}) => {
    const title = `E2E persist me ${Date.now()}`;

    await addGoal(page, title);
    await openGoal(page, title);

    await page
        .getByRole('button', { name: /mark as complete/i, exact: true })
        .click();
    await expect(
        page.getByRole('button', { name: /reopen/i, exact: true }),
    ).toBeVisible();

    await page.goto('/');

    const completedSection = await goalsSection(page, 'Completed');
    await expect(
        completedSection.getByRole('link', { name: title, exact: true }),
    ).toBeVisible();

    await page.reload();

    const completedAfterReload = await goalsSection(page, 'Completed');
    await expect(
        completedAfterReload.getByRole('link', { name: title, exact: true }),
    ).toBeVisible();
});
