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
    await item.getByRole('button', { name: measurement, exact: true }).click();
    const input = page.getByRole('list').getByRole('textbox');
    await expect(input).toBeFocused();
    await input.fill(edited);
    await input.press('Enter');

    await expect(
        page.getByRole('listitem').filter({ hasText: edited }),
    ).toBeVisible();
    await expect(
        page.getByRole('listitem').filter({ hasText: measurement }),
    ).not.toBeVisible();

    // Delete
    const editedItem = page.getByRole('listitem').filter({ hasText: edited });
    await editedItem
        .getByRole('button', { name: 'Delete', exact: true })
        .click();

    await expect(editedItem).not.toBeVisible();
    await expect(page.getByText(/no measurements yet/i)).toBeVisible();
});

test('a measurement can be recorded, viewed on history page, and deleted', async ({
    page,
}) => {
    const goal = `E2E measurement record goal ${Date.now()}`;
    const measurement = `E2E record measurement ${Date.now()}`;
    const note = `E2E record note ${Date.now()}`;
    const value = '72.5';

    await addGoalAndOpen(page, goal);

    // Add measurement
    await expect(page.getByText(/no measurements yet/i)).toBeVisible();
    await page.getByRole('button', { name: /add measurement/i }).click();
    await page.getByLabel(/what are you measuring\?/i).fill(measurement);
    await page.getByRole('button', { name: /^add measurement$/i }).click();

    const item = page.getByRole('listitem').filter({ hasText: measurement });
    await expect(item).toBeVisible();

    // Add record
    await item.getByRole('button', { name: /add record/i }).click();
    const dateInput = item.getByLabel(/^date$/i);
    const today = new Date().toISOString().slice(0, 10);
    await dateInput.fill(today);
    await item.getByLabel(/^value$/i).fill(value);
    await item.getByLabel(/^note$/i).fill(note);
    const recordResponse = page.waitForResponse((r) =>
        r.url().includes('recordMeasurement'),
    );
    await item.getByRole('button', { name: /^save$/i }).click();
    await recordResponse;

    // Visit history page
    await item.getByRole('link', { name: /history/i }).click();
    await expect(page).toHaveURL(/\/goals\/\d+\/measurements\/\d+$/);
    await expect(
        page.getByRole('heading', { level: 2, name: measurement }),
    ).toBeVisible();

    const record = page
        .getByRole('listitem')
        .filter({ hasText: new RegExp(today) });
    await expect(record).toBeVisible();
    await expect(record).toContainText(value);
    await expect(record).toContainText(note);

    // Delete
    await record.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(record).not.toBeVisible();
    await expect(page.getByText(/no records yet/i)).toBeVisible();

    // Back to goal page
    await page.getByRole('link', { name: /back/i }).click();
    await expect(
        page.getByRole('heading', { level: 1, name: goal }),
    ).toBeVisible();
    await expect(
        page.getByRole('listitem').filter({ hasText: measurement }),
    ).toBeVisible();
});
