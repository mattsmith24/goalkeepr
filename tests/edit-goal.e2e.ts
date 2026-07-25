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

test('editing a goal updates its description', async ({ page }) => {
    const original = `E2E edit goal ${Date.now()}`;
    const updated = `E2E edited goal ${Date.now()}`;

    await addGoal(page, original);

    const goalItem = page.getByRole('listitem').filter({ hasText: original });
    await goalItem.getByRole('button', { name: 'Edit', exact: true }).click();

    const input = page.getByRole('list').getByRole('textbox');
    await expect(input).toBeFocused();
    await input.fill(updated);
    await input.press('Enter');

    await expect(page.getByRole('listitem').filter({ hasText: updated })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: original })).not.toBeVisible();
});

test('escape cancels an edit and keeps the original description', async ({ page }) => {
    const original = `E2E escape goal ${Date.now()}`;

    await addGoal(page, original);

    const goalItem = page.getByRole('listitem').filter({ hasText: original });
    await goalItem.getByRole('button', { name: 'Edit', exact: true }).click();

    const input = page.getByRole('list').getByRole('textbox');
    await input.fill('this should be discarded');
    await input.press('Escape');

    await expect(page.getByRole('listitem').filter({ hasText: original })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'discarded' })).not.toBeVisible();
});