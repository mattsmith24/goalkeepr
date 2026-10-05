import { expect, type Locator, type Page } from '@playwright/test';

/** Titles given to freshly added items; every other field starts blank. */
export const DEFAULT_TITLE = {
    goal: 'New Goal',
    milestone: 'New Milestone',
    habit: 'New Habit',
    measurement: 'New Measurement',
} as const;

export type Child = 'milestone' | 'habit' | 'measurement';

const HEADINGS: Record<Child, string> = {
    milestone: 'Milestones',
    habit: 'Habits',
    measurement: 'Measurements',
};

/** The items of a goal page section, addressed by position so the locator
 * keeps resolving while a title is swapped for an input. */
export function sectionItems(page: Page, child: Child): Locator {
    return page
        .getByRole('heading', { name: HEADINGS[child], exact: true })
        .locator(
            'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " m-2 ")][1]',
        )
        .getByRole('listitem');
}

/** Renames an item in place using its inline editor. */
export async function renameItem(item: Locator, from: string, to: string) {
    await item.getByRole('button', { name: from, exact: true }).click();
    const input = item.getByRole('textbox');
    await expect(input).toBeFocused();
    await input.fill(to);
    await input.press('Enter');
    await expect(
        item.getByRole('button', { name: to, exact: true }),
    ).toBeVisible();
}

/** Adds a milestone/habit/measurement with a blank extended description. The
 * caller is left on the goal page. */
export async function addChild(
    page: Page,
    child: Child,
    description?: string,
): Promise<Locator> {
    await page
        .getByRole('button', { name: new RegExp(`^add ${child}$`, 'i') })
        .click();
    const item = sectionItems(page, child).last();
    const defaultTitle = DEFAULT_TITLE[child];
    await expect(
        item.getByRole('button', { name: defaultTitle, exact: true }),
    ).toBeVisible();
    if (description) {
        await renameItem(item, defaultTitle, description);
    }
    return item;
}

/** Adds a goal. The caller is left on the home page. */
export async function addGoal(page: Page, title?: string) {
    await page.goto('/');
    await page.getByRole('button', { name: /^add goal$/i }).click();
    if (title) {
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
    }
    await expect(
        page
            .getByRole('listitem')
            .filter({ hasText: title ?? DEFAULT_TITLE.goal }),
    ).toBeVisible();
}

/** Adds a goal and opens it. The caller is left on the goal page. */
export async function addGoalAndOpen(page: Page, title?: string) {
    await addGoal(page, title);
    await openGoal(page, title ?? DEFAULT_TITLE.goal);
}

export async function openGoal(page: Page, title: string) {
    await page.getByRole('link', { name: title, exact: true }).first().click();
    await expect(
        page.getByRole('heading', { level: 1, name: title, exact: true }),
    ).toBeVisible();
}
