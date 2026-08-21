<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import HabitSchedule from './HabitSchedule.svelte';

    const { Story } = defineMeta({
        component: HabitSchedule,
        title: 'HabitSchedule',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Daily"
    args={{
        schedule: 'daily',
        onUpdate: (s) => console.log('update', s),
    }}
/>

<Story
    name="Weekly"
    args={{
        schedule: 'weekly',
        onUpdate: (s) => console.log('update', s),
    }}
/>

<Story
    name="Monthly"
    args={{
        schedule: 'monthly',
        onUpdate: (s) => console.log('update', s),
    }}
/>

<Story
    name="Expanded"
    args={{
        schedule: 'daily',
        onUpdate: (s) => console.log('update', s),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /schedule: daily/i }).click();

        const select = canvas.getByLabelText(/schedule/i);
        await expect(select).toBeInTheDocument();
        await expect(select).toHaveValue('daily');

        await expect(
            canvas.getByRole('button', { name: /^save$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>
