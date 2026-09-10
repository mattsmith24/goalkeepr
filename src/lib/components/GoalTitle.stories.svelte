<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import GoalTitle from './GoalTitle.svelte';

    const { Story } = defineMeta({
        component: GoalTitle,
        title: 'GoalTitle',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        goal: {
            id: 1,
            title: 'I want to win an Olympic gold medal for break dancing',
            description: null,
        },
        onUpdate: (id, title) => console.log('update', id, title),
    }}
/>
