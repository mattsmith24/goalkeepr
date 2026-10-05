import { test, expect } from '@playwright/test';
import { resetDb } from './db';
import { signUpAndSignIn } from './auth';
import { addGoal, openGoal } from './add';

test.beforeEach(async ({ page }) => {
    resetDb();
    await signUpAndSignIn(page);
});

test('deleting a goal removes it from the list', async ({ page }) => {
    const description = `E2E delete goal ${Date.now()}`;

    await addGoal(page, description);
    await openGoal(page, description);

    await page
        .getByRole('button', { name: 'Delete goal', exact: true })
        .click();
    await page.getByRole('button', { name: 'Yes', exact: true }).click();

    await expect(page).toHaveURL('/');
    await expect(
        page.getByRole('listitem').filter({ hasText: description }),
    ).not.toBeVisible();
});

test('deleting one goal leaves others intact', async ({ page }) => {
    const goal1 = `E2E keep me ${Date.now()}`;
    const goal2 = `E2E delete me ${Date.now()}`;

    await addGoal(page, goal1);
    await addGoal(page, goal2);
    await openGoal(page, goal2);

    await page
        .getByRole('button', { name: 'Delete goal', exact: true })
        .click();
    await page.getByRole('button', { name: 'Yes', exact: true }).click();

    await expect(page).toHaveURL('/');
    await expect(
        page.getByRole('listitem').filter({ hasText: goal2 }),
    ).not.toBeVisible();
    await expect(
        page.getByRole('listitem').filter({ hasText: goal1 }),
    ).toBeVisible();
});

test('cancelling the confirmation keeps the goal', async ({ page }) => {
    const description = `E2E cancel delete ${Date.now()}`;

    await addGoal(page, description);
    await openGoal(page, description);

    await page
        .getByRole('button', { name: 'Delete goal', exact: true })
        .click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    await expect(page.getByText('Are you sure?')).not.toBeVisible();
    await expect(
        page.getByRole('heading', { name: description }),
    ).toBeVisible();
});
