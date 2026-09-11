<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import GoalList from './GoalList.svelte';

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
