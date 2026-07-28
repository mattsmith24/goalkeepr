import { test, expect } from '@playwright/test';
import { resetDb } from './db';
import { signUpAndSignIn } from './auth';

test.beforeEach(async ({ page }) => {
    resetDb();
    await signUpAndSignIn(page);
});

test('adding a goal appends it to the list', async ({ page }) => {
    const description = `E2E test goal ${Date.now()}`;

    await page.goto('/');

    await expect(page.getByText(/no goals yet/i)).toBeVisible();

    await page.getByRole('button', { name: /add goal/i }).click();
    await page.getByLabel(/what is your goal\?/i).fill(description);
    await page.getByRole('button', { name: /^add goal$/i }).click();

    await expect(
        page.getByRole('listitem').filter({ hasText: description }),
    ).toBeVisible();
});

test('the new-goal form can be cancelled', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /add goal/i }).click();
    await expect(page.getByLabel(/what is your goal\?/i)).toBeVisible();

    await page
        .getByRole('button', { name: /^cancel$/i })
        .first()
        .click();
    await expect(page.getByLabel(/what is your goal\?/i)).not.toBeVisible();
});

test('escape closes the new-goal form', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /add goal/i }).click();
    await expect(page.getByLabel(/what is your goal\?/i)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByLabel(/what is your goal\?/i)).not.toBeVisible();
});
