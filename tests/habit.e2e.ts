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

test('a habit can be added, edited and deleted', async ({ page }) => {
    const goal = `E2E habit goal ${Date.now()}`;
    const habit = `E2E habit ${Date.now()}`;
    const edited = `E2E edited habit ${Date.now()}`;

    await addGoalAndOpen(page, goal);

    // Add
    await expect(page.getByText(/no habits yet/i)).toBeVisible();
    await page.getByRole('button', { name: /add habit/i }).click();
    await page.getByLabel(/what is your habit\?/i).fill(habit);
    await page.getByRole('button', { name: /^add habit$/i }).click();

    const item = page.getByRole('listitem').filter({ hasText: habit });
    await expect(item).toBeVisible();

    // Edit
    await item.getByRole('button', { name: 'Edit', exact: true }).click();
    const input = page.getByRole('list').getByRole('textbox');
    await expect(input).toBeFocused();
    await input.fill(edited);
    await input.press('Enter');

    await expect(
        page.getByRole('listitem').filter({ hasText: edited }),
    ).toBeVisible();
    await expect(
        page.getByRole('listitem').filter({ hasText: habit }),
    ).not.toBeVisible();

    // Delete
    const editedItem = page.getByRole('listitem').filter({ hasText: edited });
    await editedItem
        .getByRole('button', { name: 'Delete', exact: true })
        .click();

    await expect(editedItem).not.toBeVisible();
    await expect(page.getByText(/no habits yet/i)).toBeVisible();
});

test('a habit can be marked done, viewed on history page, and deleted', async ({
    page,
}) => {
    const goal = `E2E habit history goal ${Date.now()}`;
    const habit = `E2E history habit ${Date.now()}`;
    const note = `E2E history note ${Date.now()}`;

    await addGoalAndOpen(page, goal);

    // Add habit
    await expect(page.getByText(/no habits yet/i)).toBeVisible();
    await page.getByRole('button', { name: /add habit/i }).click();
    await page.getByLabel(/what is your habit\?/i).fill(habit);
    await page.getByRole('button', { name: /^add habit$/i }).click();

    const item = page.getByRole('listitem').filter({ hasText: habit });
    await expect(item).toBeVisible();

    // Mark done
    await item.getByRole('button', { name: /mark done/i }).click();
    const dateInput = item.getByLabel(/done date/i);
    const today = new Date().toISOString().slice(0, 10);
    await dateInput.fill(today);
    await item.getByLabel(/^note$/i).fill(note);
    await item.getByRole('button', { name: /^save$/i }).click();

    // Visit history page
    await item.getByRole('link', { name: /history/i }).click();
    await expect(page).toHaveURL(/\/goals\/\d+\/habits\/\d+$/);
    await expect(
        page.getByRole('heading', { level: 2, name: habit }),
    ).toBeVisible();

    const record = page
        .getByRole('listitem')
        .filter({ hasText: new RegExp(today) });
    await expect(record).toBeVisible();
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
        page.getByRole('listitem').filter({ hasText: habit }),
    ).toBeVisible();
});
