<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import MeasurementRecordList from './MeasurementRecordList.svelte';

    export const recordData = [
        {
            id: 1,
            measurementId: 1,
            date: '2026-08-01',
            value: 70.5,
            note: 'Felt great',
        },
        {
            id: 2,
            measurementId: 1,
            date: '2026-07-30',
            value: 71.2,
            note: null,
        },
    ];

    const { Story } = defineMeta({
        component: MeasurementRecordList,
        title: 'MeasurementRecordList',
        tags: ['autodocs'],
        excludeStories: /.*Data$/,
    });
</script>

<Story
    name="Empty"
    args={{
        records: [],
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, value, note) =>
            console.log('update', id, date, value, note),
    }}
/>

<Story
    name="Default"
    args={{
        records: recordData,
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, value, note) =>
            console.log('update', id, date, value, note),
    }}
/>
