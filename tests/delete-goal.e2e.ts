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
    await page.getByRole('link', { name: description, exact: true }).click();
    await expect(page.getByRole('heading', { name: description })).toBeVisible();
}

test('deleting a goal removes it from the list', async ({ page }) => {
    const description = `E2E delete goal ${Date.now()}`;

    await addGoal(page, description);
    await openGoal(page, description);

    await page.getByRole('button', { name: 'Delete goal', exact: true }).click();

    await expect(page).toHaveURL('/');
    await expect(
        page.getByRole('listitem').filter({ hasText: description }),
    ).not.toBeVisible();
});

test('deleting one goal leaves others intact', async ({ page }) => {
    const goal1 = `E2E keep me ${Date.now()}`;
    const goal2 = `E2E delete me ${Date.now()}`;

    await addGoal(page, goal1);
    await addGoal(page, goal2);
    await openGoal(page, goal2);

    await page.getByRole('button', { name: 'Delete goal', exact: true }).click();

    await expect(page).toHaveURL('/');
    await expect(
        page.getByRole('listitem').filter({ hasText: goal2 }),
    ).not.toBeVisible();
    await expect(
        page.getByRole('listitem').filter({ hasText: goal1 }),
    ).toBeVisible();
});