<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import MeasurementRecordItem from './MeasurementRecordItem.svelte';

    const { Story } = defineMeta({
        component: MeasurementRecordItem,
        title: 'MeasurementRecordItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        record: {
            id: 1,
            measurementId: 1,
            date: '2026-08-01',
            value: 70.5,
            note: 'Felt great',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, value, note) =>
            console.log('update', id, date, value, note),
    }}
/>

<Story
    name="Without note"
    args={{
        record: {
            id: 2,
            measurementId: 1,
            date: '2026-07-30',
            value: 71.2,
            note: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, value, note) =>
            console.log('update', id, date, value, note),
    }}
/>

<Story
    name="Editing date"
    args={{
        record: {
            id: 1,
            measurementId: 1,
            date: '2026-08-01',
            value: 70.5,
            note: 'Felt great',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, value, note) =>
            console.log('update', id, date, value, note),
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
    name="Editing value"
    args={{
        record: {
            id: 1,
            measurementId: 1,
            date: '2026-08-01',
            value: 70.5,
            note: 'Felt great',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, value, note) =>
            console.log('update', id, date, value, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: '70.5' }).click();

        const valueInput = canvas.getByLabelText(/^value$/i);
        await expect(valueInput).toBeInTheDocument();
        await expect(valueInput).toHaveAttribute('type', 'number');
        await expect(valueInput).toHaveValue(70.5);

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
            measurementId: 1,
            date: '2026-08-01',
            value: 70.5,
            note: 'Felt great',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, value, note) =>
            console.log('update', id, date, value, note),
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
            measurementId: 1,
            date: '2026-07-30',
            value: 71.2,
            note: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, date, value, note) =>
            console.log('update', id, date, value, note),
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
