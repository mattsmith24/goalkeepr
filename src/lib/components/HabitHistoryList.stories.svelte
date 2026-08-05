<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import HabitHistoryList from './HabitHistoryList.svelte';

    export const recordData = [
        {
            id: 1,
            habitId: 1,
            date: '2026-08-01',
            note: 'Felt great',
        },
        {
            id: 2,
            habitId: 1,
            date: '2026-07-30',
            note: null,
        },
    ];

    const { Story } = defineMeta({
        component: HabitHistoryList,
        title: 'HabitHistoryList',
        tags: ['autodocs'],
        excludeStories: /.*Data$/,
    });
</script>

<Story
    name="Empty"
    args={{
        records: [],
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, note) => console.log('update', id, date, note),
    }}
/>

<Story
    name="Default"
    args={{
        records: recordData,
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, note) => console.log('update', id, date, note),
    }}
/>
