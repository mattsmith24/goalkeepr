import { test, expect } from '@playwright/test';
import { resetDb } from './db';

test.beforeEach(() => {
    resetDb();
});

test('adding a goal appends it to the list', async ({ page }) => {
    const description = `E2E test goal ${Date.now()}`;

    await page.goto('/');

    await expect(page.getByText(/no goals yet/i)).toBeVisible();

    await page.getByLabel(/what is your goal\?/i).fill(description);
    await page.getByRole('button', { name: /add goal/i }).click();

    await expect(page.getByRole('listitem').filter({ hasText: description })).toBeVisible();
});
