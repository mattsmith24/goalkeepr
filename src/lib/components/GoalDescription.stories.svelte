<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import GoalDescription from './GoalDescription.svelte';

    const { Story } = defineMeta({
        component: GoalDescription,
        title: 'GoalDescription',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Empty"
    args={{
        description: null,
        onUpdateDescription: (description) =>
            console.log('update', description),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = canvas.getByRole('button', { name: /add description/i });
        await expect(button).toBeInTheDocument();
        await expect(
            canvas.queryByLabelText(/describe this goal/i),
        ).not.toBeInTheDocument();
    }}
/>

<Story
    name="Filled"
    args={{
        description:
            'I want to run a marathon because staying active helps me show up as a calmer parent and partner.',
        onUpdateDescription: (description) =>
            console.log('update', description),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(
            canvas.getByText(/i want to run a marathon/i),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /edit description/i }),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="Editing"
    args={{
        description: 'Existing description',
        onUpdateDescription: (description) =>
            console.log('update', description),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /edit description/i }).click();

        const textarea = canvas.getByLabelText(/describe this goal/i);
        await expect(textarea).toBeInTheDocument();
        await expect(textarea.tagName).toBe('TEXTAREA');

        await expect(
            canvas.getByRole('button', { name: /^save$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>
