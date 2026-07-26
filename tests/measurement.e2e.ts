import { test, expect } from '@playwright/test';
import { resetDb } from './db';
import { signUpAndSignIn } from './auth';

test.beforeEach(async ({ page }) => {
    resetDb();
    await signUpAndSignIn(page);
});

async function addGoalAndOpen(page: import('@playwright/test').Page, description: string) {
    await page.goto('/');
    await page.getByRole('button', { name: /add goal/i }).click();
    await page.getByLabel(/what is your goal\?/i).fill(description);
    await page.getByRole('button', { name: /^add goal$/i }).click();
    await page.getByRole('link', { name: description }).click();
    await expect(page.getByRole('heading', { level: 1, name: description })).toBeVisible();
}

test('a measurement can be added, edited and deleted', async ({ page }) => {
    const goal = `E2E measurement goal ${Date.now()}`;
    const measurement = `E2E measurement ${Date.now()}`;
    const edited = `E2E edited measurement ${Date.now()}`;

    await addGoalAndOpen(page, goal);

    // Add
    await expect(page.getByText(/no measurements yet/i)).toBeVisible();
    await page.getByRole('button', { name: /add measurement/i }).click();
    await page.getByLabel(/what are you measuring\?/i).fill(measurement);
    await page.getByRole('button', { name: /^add measurement$/i }).click();

    const item = page.getByRole('listitem').filter({ hasText: measurement });
    await expect(item).toBeVisible();

    // Edit
    await item.getByRole('button', { name: 'Edit', exact: true }).click();
    const input = page.getByRole('list').getByRole('textbox');
    await expect(input).toBeFocused();
    await input.fill(edited);
    await input.press('Enter');

    await expect(page.getByRole('listitem').filter({ hasText: edited })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: measurement })).not.toBeVisible();

    // Delete
    const editedItem = page.getByRole('listitem').filter({ hasText: edited });
    await editedItem.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(editedItem).not.toBeVisible();
    await expect(page.getByText(/no measurements yet/i)).toBeVisible();
});