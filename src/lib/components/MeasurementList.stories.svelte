<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import MeasurementList from './MeasurementList.svelte';

    export const measurementData = [
        {
            id: 1,
            goalId: 1,
            description: 'Body weight',
            records: [
                { date: '2026-08-15', value: 20 },
                { date: '2026-08-17', value: 21 },
                { date: '2026-08-18', value: 19 },
                { date: '2026-08-19', value: 19 },
            ],
        },
        {
            id: 2,
            goalId: 1,
            description: 'Height',
            records: [
                { date: '2026-08-11', value: 160 },
                { date: '2026-08-17', value: 161 },
                { date: '2026-08-18', value: 169 },
                { date: '2026-08-30', value: 169 },
            ],
        },
    ];

    const { Story } = defineMeta({
        component: MeasurementList,
        title: 'MeasurementList',
        tags: ['autodocs'],
        excludeStories: /.*Data$/,
    });
</script>

<Story
    name="Empty"
    args={{
        measurements: [],
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onRecord: (id, date, value, note) =>
            console.log('record', id, date, value, note),
    }}
/>

<Story
    name="Default"
    args={{
        measurements: measurementData,
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onRecord: (id, date, value, note) =>
            console.log('record', id, date, value, note),
    }}
/>
