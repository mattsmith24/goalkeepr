<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import NewMeasurementForm from './NewMeasurementForm.svelte';

    const { Story } = defineMeta({
        component: NewMeasurementForm,
        title: 'NewMeasurementForm',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = canvas.getByRole('button', { name: /add measurement/i });
        await expect(button).toBeInTheDocument();

        await expect(
            canvas.queryByLabelText(/what are you measuring\?/i),
        ).not.toBeInTheDocument();
    }}
/>

<Story
    name="Expanded"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /add measurement/i }).click();

        const input = canvas.getByLabelText(/what are you measuring\?/i);
        await expect(input).toBeInTheDocument();
        await expect(input).toHaveAttribute('name', 'measurement-description');

        const form = canvasElement.querySelector('form');
        await expect(form).not.toBeNull();
        await expect(form).toHaveAttribute('method', 'POST');

        await expect(
            canvas.getByRole('button', { name: /^add measurement$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>
