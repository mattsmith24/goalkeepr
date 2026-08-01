<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import MilestoneList from './MilestoneList.svelte';

    export const milestoneData = [
        {
            id: 1,
            goalId: 1,
            description: 'Learn the six-step',
            dueDate: null,
            doneDate: null,
            note: null,
        },
        {
            id: 2,
            goalId: 1,
            description: 'Compete at regional tournament',
            dueDate: '2026-09-15',
            doneDate: '2026-09-10',
            note: 'Placed third overall.',
        },
    ];

    const { Story } = defineMeta({
        component: MilestoneList,
        title: 'MilestoneList',
        tags: ['autodocs'],
        excludeStories: /.*Data$/,
    });
</script>

<Story
    name="Empty"
    args={{
        milestones: [],
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, dueDate, doneDate, note) =>
            console.log('update', id, description, dueDate, doneDate, note),
    }}
/>

<Story
    name="Default"
    args={{
        milestones: milestoneData,
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, dueDate, doneDate, note) =>
            console.log('update', id, description, dueDate, doneDate, note),
    }}
/>
