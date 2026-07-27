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

test('a milestone can be added, edited and deleted', async ({ page }) => {
    const goal = `E2E milestone goal ${Date.now()}`;
    const milestone = `E2E milestone ${Date.now()}`;
    const edited = `E2E edited milestone ${Date.now()}`;

    await addGoalAndOpen(page, goal);

    // Add
    await expect(page.getByText(/no milestones yet/i)).toBeVisible();
    await page.getByRole('button', { name: /add milestone/i }).click();
    await page.getByLabel(/what is your milestone\?/i).fill(milestone);
    await page.getByRole('button', { name: /^add milestone$/i }).click();

    const item = page.getByRole('listitem').filter({ hasText: milestone });
    await expect(item).toBeVisible();

    // Edit
    await item.getByRole('button', { name: milestone, exact: true }).click();
    const input = page.getByRole('textbox');
    await expect(input).toBeFocused();
    await input.fill(edited);
    await input.press('Enter');

    await expect(
        page.getByRole('listitem').filter({ hasText: edited }),
    ).toBeVisible();
    await expect(
        page.getByRole('listitem').filter({ hasText: milestone }),
    ).not.toBeVisible();

    // Delete
    const editedItem = page.getByRole('listitem').filter({ hasText: edited });
    await editedItem
        .getByRole('button', { name: 'Delete', exact: true })
        .click();

    await expect(editedItem).not.toBeVisible();
    await expect(page.getByText(/no milestones yet/i)).toBeVisible();
});

test('a milestone due date can be set, edited and cleared', async ({
    page,
}) => {
    const goal = `E2E milestone date goal ${Date.now()}`;
    const milestone = `E2E dated milestone ${Date.now()}`;
    const dueDate = '2026-12-31';
    const newDueDate = '2027-01-15';

    await addGoalAndOpen(page, goal);

    // Create
    await page.getByRole('button', { name: /add milestone/i }).click();
    await page.getByLabel(/what is your milestone\?/i).fill(milestone);
    await page.getByRole('button', { name: /^add milestone$/i }).click();

    const item = page.getByRole('listitem').filter({ hasText: milestone });
    await expect(
        item.getByRole('button', { name: /due date: none/i }),
    ).toBeVisible();

    // Set
    await item.getByRole('button', { name: /due date: none/i }).click();
    const dateInput = item.getByLabel(/due date/i);
    await dateInput.fill(dueDate);
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: new RegExp(dueDate) }),
    ).toBeVisible();

    // Edit
    await item.getByRole('button', { name: new RegExp(dueDate) }).click();
    await item.getByLabel(/due date/i).fill(newDueDate);
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: new RegExp(newDueDate) }),
    ).toBeVisible();
    await expect(
        item.getByRole('button', { name: new RegExp(dueDate) }),
    ).not.toBeVisible();

    // Clear
    await item.getByRole('button', { name: new RegExp(newDueDate) }).click();
    await item.getByLabel(/due date/i).fill('');
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: /due date: none/i }),
    ).toBeVisible();
});
