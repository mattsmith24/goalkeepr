<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import EditableItem from './EditableItem.svelte';

    const { Story } = defineMeta({
        component: EditableItem,
        title: 'EditableItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        description: 'Stretch for 10 minutes each morning',
        onUpdateDescription: (description) =>
            console.log('update', description),
        onDelete: () => console.log('delete'),
    }}
/>
