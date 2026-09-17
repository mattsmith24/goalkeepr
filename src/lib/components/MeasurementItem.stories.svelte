<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import MeasurementItem from './MeasurementItem.svelte';

    const { Story } = defineMeta({
        component: MeasurementItem,
        title: 'MeasurementItem',
        tags: ['autodocs'],
    });

    const records = [
        { date: '2026-08-15', value: 20 },
        { date: '2026-08-17', value: 21 },
        { date: '2026-08-18', value: 19 },
        { date: '2026-08-19', value: 19 },
    ];
</script>

<Story
    name="Default"
    args={{
        measurement: {
            id: 1,
            goalId: 1,
            description: 'Body weight',
            records: records,
            extendedDescription: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, extendedDescription) =>
            console.log('update', id, description, extendedDescription),
        onRecord: (id, date, value, note) =>
            console.log('record', id, date, value, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.getByText('19')).toBeInTheDocument();
    }}
/>

<Story
    name="No records"
    args={{
        measurement: {
            id: 1,
            goalId: 1,
            description: 'Body weight',
            records: [],
            extendedDescription: null,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, extendedDescription) =>
            console.log('update', id, description, extendedDescription),
        onRecord: (id, date, value, note) =>
            console.log('record', id, date, value, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.queryByText('19')).not.toBeInTheDocument();
        await expect(canvas.queryByText('20')).not.toBeInTheDocument();
        await expect(canvas.queryByText('21')).not.toBeInTheDocument();
    }}
/>

<Story
    name="With extended description"
    args={{
        measurement: {
            id: 1,
            goalId: 1,
            description: 'Body weight',
            records: records,
            extendedDescription:
                'What: Morning weight in kg.\nHow it relates: Tracks overall fitness trend.\nHow measured: Same scale, after bathroom, before eating.',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, extendedDescription) =>
            console.log('update', id, description, extendedDescription),
        onRecord: (id, date, value, note) =>
            console.log('record', id, date, value, note),
    }}
/>

<Story
    name="Editing extended description"
    args={{
        measurement: {
            id: 1,
            goalId: 1,
            description: 'Body weight',
            records: records,
            extendedDescription: 'Original extended description.',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, extendedDescription) =>
            console.log('update', id, description, extendedDescription),
        onRecord: (id, date, value, note) =>
            console.log('record', id, date, value, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas
            .getByRole('button', { name: /original extended description/i })
            .click();

        const textarea = canvas.getByLabelText(
            /how does it relate to the goal/i,
        );
        await expect(textarea).toBeInTheDocument();
        await expect(textarea.tagName).toBe('TEXTAREA');
        await expect(textarea).toHaveFocus();
        await expect(textarea).toHaveValue('Original extended description.');

        await expect(
            canvas.getByRole('button', { name: /^save$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="ReadOnly"
    args={{
        measurement: {
            id: 1,
            goalId: 1,
            description: 'Body weight',
            records: records,
            extendedDescription:
                'What: Morning weight in kg.\nHow it relates: Tracks overall fitness trend.',
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description, extendedDescription) =>
            console.log('update', id, description, extendedDescription),
        onRecord: (id, date, value, note) =>
            console.log('record', id, date, value, note),
        readOnly: true,
    }}
/>
