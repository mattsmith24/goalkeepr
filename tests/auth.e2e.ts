import { test, expect } from '@playwright/test';
import { signUpAndSignIn, uniqueEmail, TEST_PASSWORD } from './auth';

test('visiting / while signed out redirects to /sign-in', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/sign-in$/);
});

test('the /sign-in and /sign-up pages are reachable while signed out', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    await page.goto('/sign-up');
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
});

test('signing up lands on / and shows the user in the top bar', async ({ page }) => {
    await signUpAndSignIn(page, { name: 'Alex Tester' });
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Alex Tester')).toBeVisible();
});

test('signing up with an already-used email leaves you on /sign-up', async ({ page }) => {
    const email = uniqueEmail();
    await signUpAndSignIn(page, { email });

    await page.getByRole('button', { name: /^sign out$/i }).click();
    await expect(page).toHaveURL(/\/sign-in$/);

    await page.goto('/sign-up');
    await page.getByLabel('Name', { exact: true }).fill('Another User');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /^sign up$/i }).click();

    await expect(page).toHaveURL(/\/sign-up$/);
});

test('signing in with the wrong password leaves you on /sign-in', async ({ page }) => {
    const email = uniqueEmail();
    await signUpAndSignIn(page, { email });

    await page.getByRole('button', { name: /^sign out$/i }).click();
    await expect(page).toHaveURL(/\/sign-in$/);

    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill('definitely-wrong-password');
    await page.getByRole('button', { name: /^sign in$/i }).click();

    await expect(page).toHaveURL(/\/sign-in$/);
});

test('signing in with the right password lands on /', async ({ page }) => {
    const email = uniqueEmail();
    await signUpAndSignIn(page, { email });

    await page.getByRole('button', { name: /^sign out$/i }).click();
    await expect(page).toHaveURL(/\/sign-in$/);

    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /^sign in$/i }).click();

    await expect(page).toHaveURL(/\/$/);
});

test('signed-out users visiting / are redirected back to /sign-in', async ({ page }) => {
    await signUpAndSignIn(page);
    await page.getByRole('button', { name: /^sign out$/i }).click();
    await page.goto('/');
    await expect(page).toHaveURL(/\/sign-in$/);
});