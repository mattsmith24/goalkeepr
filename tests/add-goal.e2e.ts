import { test, expect } from '@playwright/test';
import { resetDb } from './db';
import { signUpAndSignIn } from './auth';
import { addGoal, DEFAULT_TITLE } from './add';

test.beforeEach(async ({ page }) => {
    resetDb();
    await signUpAndSignIn(page);
});

test('adding a goal creates one with a default title', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/no goals yet/i)).toBeVisible();

    await page.getByRole('button', { name: /^add goal$/i }).click();

    const item = page
        .getByRole('listitem')
        .filter({ hasText: DEFAULT_TITLE.goal });
    await expect(item).toBeVisible();
    await expect(page.getByText(/no goals yet/i)).not.toBeVisible();
});

test('the default title can be renamed', async ({ page }) => {
    const title = `E2E renamed goal ${Date.now()}`;

    await addGoal(page);
    await page
        .getByRole('link', { name: DEFAULT_TITLE.goal, exact: true })
        .click();

    await page
        .getByRole('button', { name: DEFAULT_TITLE.goal, exact: true })
        .click();
    const input = page.getByRole('textbox');
    await expect(input).toBeFocused();
    await input.fill(title);
    await input.press('Enter');

    await expect(
        page.getByRole('heading', { level: 1, name: title, exact: true }),
    ).toBeVisible();

    await page.goto('/');
    await expect(
        page.getByRole('listitem').filter({ hasText: title }),
    ).toBeVisible();
    await expect(
        page.getByRole('listitem').filter({ hasText: DEFAULT_TITLE.goal }),
    ).not.toBeVisible();
});

test('a new goal starts with a blank description', async ({ page }) => {
    const title = `E2E blank desc goal ${Date.now()}`;

    await addGoal(page, title);
    await page.getByRole('link', { name: title, exact: true }).click();

    await expect(page.getByText(/describe this goal/i)).not.toBeVisible();
    await expect(
        page.getByRole('button', { name: /add description/i }),
    ).toBeVisible();
});
