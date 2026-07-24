<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import MilestoneItem from './MilestoneItem.svelte';

    const { Story } = defineMeta({
        component: MilestoneItem,
        title: 'MilestoneItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        milestone: { id: 1, description: 'Learn the six-step' },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
    }}
/>
