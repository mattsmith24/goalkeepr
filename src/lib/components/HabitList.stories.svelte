<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import HabitList from './HabitList.svelte';

    export const habitData = [{
        id: 1,
        goalId: 1,
        description: 'Stretch for 10 minutes each morning',
    }];

    const { Story } = defineMeta({
        component: HabitList,
        title: 'HabitList',
        tags: ['autodocs'],
        excludeStories: /.*Data$/,
    });
</script>

<Story
    name="Empty"
    args={{
        habits: [],
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
    }}
/>

<Story
    name="Default"
    args={{
        habits: habitData,
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
    }}
/>
