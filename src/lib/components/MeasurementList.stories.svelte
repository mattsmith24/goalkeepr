<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import MeasurementList from './MeasurementList.svelte';

    export const measurementData = [{
        id: 1,
        goalId: 1,
        description: 'Body weight',
    }];

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
    }}
/>

<Story
    name="Default"
    args={{
        measurements: measurementData,
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
    }}
/>