<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import DeleteButton from './DeleteButton.svelte';

    const { Story } = defineMeta({
        component: DeleteButton,
        title: 'DeleteButton',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        onDelete: () => console.log('delete'),
    }}
/>

<Story
    name="CustomLabel"
    args={{
        label: 'Delete goal',
        onDelete: () => console.log('delete'),
    }}
/>
