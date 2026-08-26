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
        count: 1,
        period: 1,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
/>

<Story
    name="WeeklyFourTimes"
    args={{
        schedule: 'weekly',
        count: 4,
        period: 1,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
/>

<Story
    name="WeeklyOnce"
    args={{
        schedule: 'weekly',
        count: 1,
        period: 1,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
/>

<Story
    name="MonthlyTwice"
    args={{
        schedule: 'monthly',
        count: 2,
        period: 1,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
/>

<Story
    name="WeeklyOnceEveryTwoWeeks"
    args={{
        schedule: 'weekly',
        count: 1,
        period: 2,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
/>

<Story
    name="MonthlyFourInTwoMonths"
    args={{
        schedule: 'monthly',
        count: 4,
        period: 2,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
/>

<Story
    name="ExpandedWeekly"
    args={{
        schedule: 'weekly',
        count: 1,
        period: 1,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /schedule: weekly/i }).click();

        const select = canvas.getByLabelText(/^schedule$/i);
        await expect(select).toBeInTheDocument();
        await expect(select).toHaveValue('weekly');

        const count = canvas.getByLabelText(/times per week/i);
        await expect(count).toBeInTheDocument();
        await expect(count).toHaveValue(1);

        await expect(
            canvas.getByRole('button', { name: /^save$/i }),
        ).toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /^cancel$/i }),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="ExpandedDaily"
    args={{
        schedule: 'daily',
        count: 1,
        period: 1,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.getByRole('button', { name: /schedule: daily/i }).click();

        const select = canvas.getByLabelText(/^schedule$/i);
        await expect(select).toBeInTheDocument();

        await expect(
            canvas.queryByLabelText(/times per/i),
        ).not.toBeInTheDocument();
    }}
/>

<Story
    name="ExpandedWeeklyPeriod"
    args={{
        schedule: 'weekly',
        count: 1,
        period: 2,
        onUpdate: (s, c, p) => console.log('update', s, c, p),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas
            .getByRole('button', {
                name: /schedule: weekly, 1 time per 2 weeks/i,
            })
            .click();

        const count = canvas.getByLabelText(/times per week/i);
        await expect(count).toBeInTheDocument();
        await expect(count).toHaveValue(1);

        const period = canvas.getByLabelText(/period in weeks/i);
        await expect(period).toBeInTheDocument();
        await expect(period).toHaveValue(2);
    }}
/>
