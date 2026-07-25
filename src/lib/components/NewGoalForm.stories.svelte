<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import NewGoalForm from './NewGoalForm.svelte';

    const { Story } = defineMeta({
        component: NewGoalForm,
        title: 'NewGoalForm',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = canvas.getByRole('button', { name: /add goal/i });
        await expect(button).toBeInTheDocument();

        await expect(canvas.queryByLabelText(/what is your goal\?/i)).not.toBeInTheDocument();
    }}
/>

<Story
    name="Expanded"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /add goal/i }).click();

        const input = canvas.getByLabelText(/what is your goal\?/i);
        await expect(input).toBeInTheDocument();
        await expect(input).toHaveAttribute('name', 'goal-description');

        const form = canvasElement.querySelector('form');
        await expect(form).not.toBeNull();
        await expect(form).toHaveAttribute('method', 'POST');

        await expect(canvas.getByRole('button', { name: /^add goal$/i })).toBeInTheDocument();
        await expect(canvas.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    }}
/>