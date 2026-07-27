<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import MilestoneList from './MilestoneList.svelte';

    export const milestoneData = [
        {
            id: 1,
            goalId: 1,
            description: 'Learn the six-step',
            dueDate: null,
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
        onUpdate: (id, description, dueDate) =>
            console.log('update', id, description, dueDate),
    }}
/>

<Story
    name="Default"
    args={{
        milestones: milestoneData,
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, dueDate) =>
            console.log('update', id, description, dueDate),
    }}
/>
