<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import NewHabitForm from './NewHabitForm.svelte';

    const { Story } = defineMeta({
        component: NewHabitForm,
        title: 'NewHabitForm',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = canvas.getByRole('button', { name: /add habit/i });
        await expect(button).toBeInTheDocument();

        await expect(
            canvas.queryByLabelText(/what is your habit\?/i),
        ).not.toBeInTheDocument();
    }}
/>

<Story
    name="Expanded"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /add habit/i }).click();

        const input = canvas.getByLabelText(/what is your habit\?/i);
        await expect(input).toBeInTheDocument();
        await expect(input).toHaveAttribute('name', 'habit-description');

        const form = canvasElement.querySelector('form');
        await expect(form).not.toBeNull();
        await expect(form).toHaveAttribute('method', 'POST');

        await expect(
            canvas.getByRole('button', { name: /^add habit$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>
