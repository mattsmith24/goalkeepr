<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import MeasurementItem from './MeasurementItem.svelte';

    const { Story } = defineMeta({
        component: MeasurementItem,
        title: 'MeasurementItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        measurement: { id: 1, goalId: 1, description: 'Body weight' },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
    }}
/>