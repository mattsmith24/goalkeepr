<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

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

<Story
    name="Confirming"
    args={{
        label: 'Delete',
        onDelete: () => console.log('delete'),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: 'Delete' }).click();

        const yesButton = canvas.getByRole('button', { name: 'Yes' })
        await expect(yesButton).toBeInTheDocument();

        const cancelButton = canvas.getByRole('button', { name: 'Cancel' })
        await expect(cancelButton).toBeInTheDocument();
    }}
/>
