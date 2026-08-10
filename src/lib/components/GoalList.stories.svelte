<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import GoalList from './GoalList.svelte';

    export const goalData = [
        {
            id: 1,
            description:
                'I want to win an Olympic gold medal for break dancing',
        },
    ];

    const { Story } = defineMeta({
        component: GoalList,
        title: 'GoalList',
        tags: ['autodocs'],
        excludeStories: /.*Data$/,
    });
</script>

<Story name="Empty" args={{ goals: [] }} />

<Story name="Default" args={{ goals: goalData }} />