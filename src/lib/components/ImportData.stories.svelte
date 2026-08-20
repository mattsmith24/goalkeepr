<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import ImportData from './ImportData.svelte';

    const { Story } = defineMeta({
        component: ImportData,
        title: 'ImportData',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = canvas.getByRole('button', { name: /import data/i });
        await expect(button).toBeInTheDocument();

        await expect(canvas.queryByLabelText(/import file/i)).not.toBeInTheDocument();
    }}
/>

<Story
    name="Expanded"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /import data/i }).click();

        const input = canvas.getByLabelText(/import file/i);
        await expect(input).toBeInTheDocument();
        await expect(input).toHaveAttribute('type', 'file');

        await expect(
            canvas.getByRole('button', { name: /^import$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="Error"
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /import data/i }).click();
        await canvas.getByRole('button', { name: /^import$/i }).click();

        await expect(
            canvas.getByText(/please choose a file to import/i),
        ).toBeInTheDocument();
    }}
/>
