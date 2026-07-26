import type { Page } from '@playwright/test';

export const TEST_PASSWORD = 'correct-horse-battery-staple';

export function uniqueEmail(prefix = 'tester'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export async function signUpAndSignIn(
    page: Page,
    { email = uniqueEmail(), name = 'Test User', password = TEST_PASSWORD } = {}
) {
    await page.goto('/sign-up');
    await page.getByLabel('Name', { exact: true }).fill(name);
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: /^sign up$/i }).click();
    await page.waitForURL('/');
}