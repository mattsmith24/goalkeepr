<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import MeasurementItem from './MeasurementItem.svelte';

    const { Story } = defineMeta({
        component: MeasurementItem,
        title: 'MeasurementItem',
        tags: ['autodocs'],
    });

    const records = [
        { date: '2026-08-15', value: 20 },
        { date: '2026-08-17', value: 21 },
        { date: '2026-08-18', value: 19 },
        { date: '2026-08-19', value: 19 },
    ];
</script>

<Story
    name="Default"
    args={{
        measurement: {
            id: 1,
            goalId: 1,
            description: 'Body weight',
            records: records,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onRecord: (id, date, value, note) =>
            console.log('record', id, date, value, note),
    }}
/>
