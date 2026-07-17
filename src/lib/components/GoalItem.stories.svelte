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

<Story
    name="With delete handler"
    args={{
        goal: { id: 2, description: 'Learn to juggle' },
        onDelete: (id) => console.log('delete', id),
    }}
/>
