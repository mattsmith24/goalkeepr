<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

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
        milestone: {
            id: 1,
            goalId: 1,
            description: 'Learn the six-step',
            dueDate: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, dueDate) =>
            console.log('update', id, description, dueDate),
    }}
/>

<Story
    name="With due date"
    args={{
        milestone: {
            id: 2,
            goalId: 1,
            description: 'Compete at regional tournament',
            dueDate: '2026-09-15',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, dueDate) =>
            console.log('update', id, description, dueDate),
    }}
/>

<Story
    name="Editing description"
    args={{
        milestone: {
            id: 1,
            goalId: 1,
            description: 'Learn the six-step',
            dueDate: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, dueDate) =>
            console.log('update', id, description, dueDate),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas
            .getByRole('button', { name: 'Learn the six-step' })
            .click();

        const input = canvas.getByRole('textbox');
        await expect(input).toBeInTheDocument();
        await expect(input).toHaveFocus();
        await expect(input).toHaveValue('Learn the six-step');
    }}
/>

<Story
    name="Editing date"
    args={{
        milestone: {
            id: 1,
            goalId: 1,
            description: 'Learn the six-step',
            dueDate: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, dueDate) =>
            console.log('update', id, description, dueDate),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /due date: none/i }).click();

        const dateInput = canvas.getByLabelText(/due date/i);
        await expect(dateInput).toBeInTheDocument();
        await expect(dateInput).toHaveAttribute('type', 'date');

        await expect(
            canvas.getByRole('button', { name: /^save$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>
