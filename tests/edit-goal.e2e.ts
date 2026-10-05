import { test, expect } from '@playwright/test';
import { resetDb } from './db';
import { signUpAndSignIn } from './auth';
import { addGoal, openGoal } from './add';

test.beforeEach(async ({ page }) => {
    resetDb();
    await signUpAndSignIn(page);
});

test('editing a goal updates its description', async ({ page }) => {
    const original = `E2E edit goal ${Date.now()}`;
    const updated = `E2E edited goal ${Date.now()}`;

    await addGoal(page, original);
    await openGoal(page, original);

    await page.getByRole('button', { name: original, exact: true }).click();

    const input = page.getByRole('textbox');
    await expect(input).toBeFocused();
    await input.fill(updated);
    await input.press('Enter');

    await expect(
        page.getByRole('heading', { name: updated, exact: true }),
    ).toBeVisible();

    await page.goto('/');
    await expect(
        page.getByRole('listitem').filter({ hasText: updated }),
    ).toBeVisible();
    await expect(
        page.getByRole('listitem').filter({ hasText: original }),
    ).not.toBeVisible();
});

test('escape cancels an edit and keeps the original description', async ({
    page,
}) => {
    const original = `E2E escape goal ${Date.now()}`;

    await addGoal(page, original);
    await openGoal(page, original);

    await page.getByRole('button', { name: original, exact: true }).click();

    const input = page.getByRole('textbox');
    await input.fill('this should be discarded');
    await input.press('Escape');

    await expect(
        page.getByRole('heading', { name: original, exact: true }),
    ).toBeVisible();
});
