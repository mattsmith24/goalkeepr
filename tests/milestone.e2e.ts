import { test, expect } from '@playwright/test';
import { resetDb } from './db';
import { signUpAndSignIn } from './auth';
import { addChild, addGoalAndOpen, renameItem, DEFAULT_TITLE } from './add';

test.beforeEach(async ({ page }) => {
    resetDb();
    await signUpAndSignIn(page);
});

test('a milestone can be added, edited and deleted', async ({ page }) => {
    const goal = `E2E milestone goal ${Date.now()}`;
    const edited = `E2E edited milestone ${Date.now()}`;

    await addGoalAndOpen(page, goal);

    // Add
    await expect(page.getByText(/no milestones yet/i)).toBeVisible();
    const item = await addChild(page, 'milestone');

    // Edit
    await renameItem(item, DEFAULT_TITLE.milestone, edited);

    // Delete
    await item.getByRole('button', { name: 'Delete', exact: true }).click();
    await item.getByRole('button', { name: 'Yes', exact: true }).click();

    // The empty-state message only renders when the list is empty, so it
    // also proves the deleted card is gone.
    await expect(page.getByText(/no milestones yet/i)).toBeVisible();
});

test('a milestone due date can be set, edited and cleared', async ({
    page,
}) => {
    const goal = `E2E milestone date goal ${Date.now()}`;
    const dueDate = '2026-12-31';
    const newDueDate = '2027-01-15';

    await addGoalAndOpen(page, goal);

    // Create
    const item = await addChild(page, 'milestone');

    await expect(
        item.getByRole('button', { name: /add due date/i }),
    ).toBeVisible();

    // Set
    await item.getByRole('button', { name: /add due date/i }).click();
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
        item.getByRole('button', { name: /add due date/i }),
    ).toBeVisible();
});

test('a milestone done date can be set, edited and cleared', async ({
    page,
}) => {
    const goal = `E2E milestone done date goal ${Date.now()}`;
    const doneDate = '2026-08-15';
    const newDoneDate = '2026-08-20';

    await addGoalAndOpen(page, goal);

    // Create
    const item = await addChild(page, 'milestone');

    await expect(
        item.getByRole('button', { name: /mark as done/i }),
    ).toBeVisible();

    // Set
    await item.getByRole('button', { name: /mark as done/i }).click();
    const dateInput = item.getByLabel(/done date/i);
    await dateInput.fill(doneDate);
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: new RegExp(doneDate) }),
    ).toBeVisible();

    // Edit
    await item.getByRole('button', { name: new RegExp(doneDate) }).click();
    await item.getByLabel(/done date/i).fill(newDoneDate);
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: new RegExp(newDoneDate) }),
    ).toBeVisible();
    await expect(
        item.getByRole('button', { name: new RegExp(doneDate) }),
    ).not.toBeVisible();

    // Clear
    await item.getByRole('button', { name: new RegExp(newDoneDate) }).click();
    await item.getByLabel(/done date/i).fill('');
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: /mark as done/i }),
    ).toBeVisible();
});

test('a milestone note can be set, edited and cleared', async ({ page }) => {
    const goal = `E2E milestone note goal ${Date.now()}`;
    const note = `E2E note ${Date.now()}`;
    const editedNote = `${note} edited`;

    await addGoalAndOpen(page, goal);

    // Create
    const item = await addChild(page, 'milestone');

    await expect(item.getByRole('button', { name: /add note/i })).toBeVisible();

    // Set
    await item.getByRole('button', { name: /add note/i }).click();
    const input = item.getByLabel(/note/i);
    await expect(input).toBeFocused();
    await input.fill(note);
    await input.press('Enter');

    await expect(
        item.getByRole('button', { name: new RegExp(note) }),
    ).toBeVisible();

    // Edit
    await item.getByRole('button', { name: new RegExp(note) }).click();
    const editInput = item.getByLabel(/note/i);
    await expect(editInput).toBeFocused();
    await editInput.fill(editedNote);
    await editInput.press('Enter');

    await expect(
        item.getByRole('button', { name: new RegExp(editedNote) }),
    ).toBeVisible();
    await expect(
        item.getByRole('button', { name: new RegExp(`^Note: ${note}$`) }),
    ).not.toBeVisible();

    // Clear
    await item.getByRole('button', { name: new RegExp(editedNote) }).click();
    const clearInput = item.getByLabel(/note/i);
    await clearInput.fill('');
    await clearInput.press('Enter');

    await expect(item.getByRole('button', { name: /add note/i })).toBeVisible();
});

test('a milestone extended description can be added, edited and cleared inline', async ({
    page,
}) => {
    const goal = `E2E milestone extended goal ${Date.now()}`;
    const description = `E2E extended milestone ${Date.now()}`;
    const extended = `E2E extended description ${Date.now()}`;
    const editedExtended = `${extended} edited`;

    await addGoalAndOpen(page, goal);

    // Add, then fill in the fields inline
    const item = await addChild(page, 'milestone', description);
    await expect(
        item.getByRole('button', { name: /add extended description/i }),
    ).toBeVisible();

    await item
        .getByRole('button', { name: /add extended description/i })
        .click();
    const textarea = item.getByLabel(/how does it relate to the goal/i);
    await expect(textarea).toBeFocused();
    await textarea.fill(extended);
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: new RegExp(extended) }),
    ).toBeVisible();

    // Edit inline
    await item.getByRole('button', { name: new RegExp(extended) }).click();
    const editTextarea = item.getByLabel(/how does it relate to the goal/i);
    await expect(editTextarea).toBeFocused();
    await editTextarea.fill(editedExtended);
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: new RegExp(editedExtended) }),
    ).toBeVisible();

    // Clear inline
    await item
        .getByRole('button', { name: new RegExp(editedExtended) })
        .click();
    const clearTextarea = item.getByLabel(/how does it relate to the goal/i);
    await clearTextarea.fill('');
    await item.getByRole('button', { name: /^save$/i }).click();

    await expect(
        item.getByRole('button', { name: /add extended description/i }),
    ).toBeVisible();
});
