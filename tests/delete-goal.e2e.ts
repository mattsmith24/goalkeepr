import { test, expect } from '@playwright/test';
import { resetDb } from './db';

test.beforeEach(() => {
    resetDb();
});

async function addGoal(page: import('@playwright/test').Page, description: string) {
    await page.goto('/');
    await page.getByLabel(/what is your goal\?/i).fill(description);
    await page.getByRole('button', { name: /add goal/i }).click();
    await expect(page.getByRole('listitem').filter({ hasText: description })).toBeVisible();
}

test('deleting a goal removes it from the list', async ({ page }) => {
    const description = `E2E delete goal ${Date.now()}`;

    await addGoal(page, description);

    const item = page.getByRole('listitem').filter({ hasText: description });
    await item.getByRole('button', { name: /delete/i }).click();

    await expect(item).not.toBeVisible();
});

test('deleting one goal leaves others intact', async ({ page }) => {
    const goal1 = `E2E keep me ${Date.now()}`;
    const goal2 = `E2E delete me ${Date.now()}`;

    await addGoal(page, goal1);
    await addGoal(page, goal2);

    const target = page.getByRole('listitem').filter({ hasText: goal2 });
    const other = page.getByRole('listitem').filter({ hasText: goal1 });

    await target.getByRole('button', { name: /delete/i }).click();

    await expect(target).not.toBeVisible();
    await expect(other).toBeVisible();
});
