<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import GoalList from './GoalList.svelte';
    import NewGoalForm from './NewGoalForm.svelte';

    export const goalData = [
        {
            id: 1,
            title: 'Win Olympic gold for break dancing',
            description: 'I want to feel unstoppable.',
            doneDate: null,
        },
        {
            id: 2,
            title: 'Read 12 books',
            description: 'Done ahead of schedule.',
            doneDate: '2026-09-01',
        },
        {
            id: 3,
            title: 'Run a marathon',
            description: null,
            doneDate: '2026-08-15',
        },
    ];

    const { Story } = defineMeta({
        component: GoalList,
        title: 'GoalList',
        tags: ['autodocs'],
        excludeStories: /.*Data$/,
    });
</script>

<Story name="Empty" args={{ heading: 'Goals', goals: [] }} />

<Story name="Default" args={{ heading: 'Goals', goals: goalData }} />

<Story name="Mixed" args={{ heading: 'Goals', goals: goalData }} />

<Story
    name="Completed only"
    args={{
        heading: 'Completed',
        goals: goalData,
        emptyMessage: 'No completed goals yet.',
    }}
/>

<Story
    name="With Add Goal"
    args={{ heading: 'Goals', goals: goalData }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = canvas.getByRole('button', { name: /add goal/i });
        await expect(button).toBeInTheDocument();
        await expect(
            canvas.queryByLabelText(/what is your goal\?/i),
        ).not.toBeInTheDocument();

        await button.click();

        const input = canvas.getByLabelText(/what is your goal\?/i);
        await expect(input).toBeInTheDocument();

        const heading = canvas.getByRole('heading', { name: /goals/i });
        const goalTitles = canvas.getAllByRole('link', {
            name: /win olympic|read 12 books|run a marathon/i,
        });
        await expect(
            heading.compareDocumentPosition(input) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
        for (const goalTitle of goalTitles) {
            await expect(
                input.compareDocumentPosition(goalTitle) &
                    Node.DOCUMENT_POSITION_FOLLOWING,
            ).toBeTruthy();
        }

        await canvas.getByRole('button', { name: /^cancel$/i }).click();
        await expect(
            canvas.queryByLabelText(/what is your goal\?/i),
        ).not.toBeInTheDocument();
    }}
>
    {#snippet template(args)}
        <GoalList heading={args.heading} goals={args.goals}>
            <div class="mb-6 flex justify-center">
                <NewGoalForm />
            </div>
        </GoalList>
    {/snippet}
</Story>
