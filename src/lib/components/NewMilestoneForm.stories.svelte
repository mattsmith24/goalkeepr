<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import NewMilestoneForm from './NewMilestoneForm.svelte';

    const { Story } = defineMeta({
        component: NewMilestoneForm,
        title: 'NewMilestoneForm',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = canvas.getByRole('button', { name: /add milestone/i });
        await expect(button).toBeInTheDocument();

        const form = canvasElement.querySelector('form');
        await expect(form).not.toBeNull();
        await expect(form).toHaveAttribute('method', 'POST');
        await expect(form).toHaveAttribute('action', '?/createMilestone');
    }}
/>
