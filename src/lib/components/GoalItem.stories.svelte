<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import GoalItem from './GoalItem.svelte';

    const { Story } = defineMeta({
        component: GoalItem,
        title: 'GoalItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{ goal: { id: 1, description: 'I want to win an Olympic gold medal for break dancing' } }}
/>
