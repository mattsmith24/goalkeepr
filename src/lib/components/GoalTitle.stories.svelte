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
        goal: { id: 1, description: 'I want to win an Olympic gold medal for break dancing' },
        onUpdate: (id, description) => console.log('update', id, description),
    }}
/>
