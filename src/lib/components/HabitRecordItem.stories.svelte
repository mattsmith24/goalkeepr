<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import HabitRecordItem from './HabitRecordItem.svelte';

    const { Story } = defineMeta({
        component: HabitRecordItem,
        title: 'HabitRecordItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        record: {
            id: 1,
            habitId: 1,
            date: '2026-08-01',
            note: 'Felt great',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, note) => console.log('update', id, date, note),
    }}
/>

<Story
    name="Without note"
    args={{
        record: {
            id: 2,
            habitId: 1,
            date: '2026-07-30',
            note: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, note) => console.log('update', id, date, note),
    }}
/>

<Story
    name="Editing date"
    args={{
        record: {
            id: 1,
            habitId: 1,
            date: '2026-08-01',
            note: 'Felt great',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, note) => console.log('update', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: '2026-08-01' }).click();

        const dateInput = canvas.getByLabelText(/^date$/i);
        await expect(dateInput).toBeInTheDocument();
        await expect(dateInput).toHaveAttribute('type', 'date');
        await expect(dateInput).toHaveValue('2026-08-01');

        await expect(
            canvas.getByRole('button', { name: /^save$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="Editing note"
    args={{
        record: {
            id: 1,
            habitId: 1,
            date: '2026-08-01',
            note: 'Felt great',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, note) => console.log('update', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /felt great/i }).click();

        const input = canvas.getByLabelText(/^note$/i);
        await expect(input).toBeInTheDocument();
        await expect(input).toHaveFocus();
        await expect(input).toHaveValue('Felt great');

        await expect(
            canvas.getByRole('button', { name: /^save$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="Adding a note"
    args={{
        record: {
            id: 2,
            habitId: 1,
            date: '2026-07-30',
            note: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, note) => console.log('update', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /add note/i }).click();

        const input = canvas.getByLabelText(/^note$/i);
        await expect(input).toBeInTheDocument();
        await expect(input).toHaveFocus();
        await expect(input).toHaveValue('');
    }}
/>
