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
    await page.getByRole('link', { name: description, exact: true }).click();
    await expect(
        page.getByRole('heading', { name: description }),
    ).toBeVisible();
}

test('adding a description saves it to the goal', async ({ page }) => {
    const goalTitle = `E2E desc goal ${Date.now()}`;
    const description = 'I want to feel healthier and more energetic.';

    await addGoalAndOpen(page, goalTitle);

    await expect(page.getByText(/describe this goal/i)).not.toBeVisible();
    await page.getByRole('button', { name: /add description/i }).click();
    await expect(page.getByLabel(/describe this goal/i)).toBeVisible();

    await page.getByLabel(/describe this goal/i).fill(description);
    await page.getByRole('button', { name: /^save$/i }).click();

    await expect(page.getByText(description)).toBeVisible();
    await expect(
        page.getByRole('button', { name: /add description/i }),
    ).not.toBeVisible();
    await expect(
        page.getByRole('button', { name: /edit description/i }),
    ).toBeVisible();
});

test('a description can be edited', async ({ page }) => {
    const goalTitle = `E2E desc edit goal ${Date.now()}`;
    const original = 'Original motivation text.';
    const updated = 'Revised motivation text.';

    await addGoalAndOpen(page, goalTitle);

    await page.getByRole('button', { name: /add description/i }).click();
    await page.getByLabel(/describe this goal/i).fill(original);
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page.getByText(original)).toBeVisible();

    await page.getByRole('button', { name: /edit description/i }).click();
    const textarea = page.getByLabel(/describe this goal/i);
    await expect(textarea).toHaveValue(original);
    await textarea.fill(updated);
    await page.getByRole('button', { name: /^save$/i }).click();

    await expect(page.getByText(updated)).toBeVisible();
    await expect(page.getByText(original)).not.toBeVisible();
});

test('a description shows on the home page after being added', async ({
    page,
}) => {
    const goalTitle = `E2E desc home goal ${Date.now()}`;
    const description = 'I want to feel healthier and more energetic.';

    await addGoalAndOpen(page, goalTitle);

    await page.getByRole('button', { name: /add description/i }).click();
    await page.getByLabel(/describe this goal/i).fill(description);
    await page.getByRole('button', { name: /^save$/i }).click();

    await page.goto('/');
    const card = page.getByRole('listitem').filter({ hasText: goalTitle });
    await expect(card).toBeVisible();
    await expect(card.getByText(description)).toBeVisible();
});

test('cancel discards changes to a description', async ({ page }) => {
    const goalTitle = `E2E desc cancel goal ${Date.now()}`;
    const original = 'Original description.';
    const draft = 'Should be discarded.';

    await addGoalAndOpen(page, goalTitle);

    await page.getByRole('button', { name: /add description/i }).click();
    await page.getByLabel(/describe this goal/i).fill(original);
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page.getByText(original)).toBeVisible();

    await page.getByRole('button', { name: /edit description/i }).click();
    await page.getByLabel(/describe this goal/i).fill(draft);
    await page.getByRole('button', { name: /^cancel$/i }).click();

    await expect(page.getByText(original)).toBeVisible();
    await expect(page.getByText(draft)).not.toBeVisible();
});

test('escape cancels editing a description', async ({ page }) => {
    const goalTitle = `E2E desc escape goal ${Date.now()}`;
    const original = 'Original description.';

    await addGoalAndOpen(page, goalTitle);

    await page.getByRole('button', { name: /add description/i }).click();
    await page.getByLabel(/describe this goal/i).fill(original);
    await page.getByRole('button', { name: /^save$/i }).click();

    await page.getByRole('button', { name: /edit description/i }).click();
    await page.keyboard.press('Escape');

    await expect(page.getByLabel(/describe this goal/i)).not.toBeVisible();
    await expect(page.getByText(original)).toBeVisible();
});
