<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import HabitItem from './HabitItem.svelte';

    const { Story } = defineMeta({
        component: HabitItem,
        title: 'HabitItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Stretch for 10 minutes each morning',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
    }}
/>
