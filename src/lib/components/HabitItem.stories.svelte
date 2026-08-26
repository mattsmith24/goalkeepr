<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import HabitItem from './HabitItem.svelte';

    const { Story } = defineMeta({
        component: HabitItem,
        title: 'HabitItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Stretch for 10 minutes each morning',
            streak: 4,
            schedule: 'daily',
            count: 1,
            period: 1,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
/>

<Story
    name="DailySingularStreak"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Stretch',
            streak: 1,
            schedule: 'daily',
            count: 1,
            period: 1,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('1 day streak')).toBeInTheDocument();
    }}
/>

<Story
    name="WeeklyPluralStreak"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Review goals',
            streak: 4,
            schedule: 'weekly',
            count: 4,
            period: 1,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('4 weeks streak')).toBeInTheDocument();
        await expect(canvas.getByText(/4 times per week/i)).toBeInTheDocument();
    }}
/>

<Story
    name="WeeklySingularStreak"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Review goals',
            streak: 1,
            schedule: 'weekly',
            count: 1,
            period: 1,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('1 week streak')).toBeInTheDocument();
        await expect(
            canvas.queryByText(/1 time per week/i),
        ).not.toBeInTheDocument();
        await expect(
            canvas.getByRole('button', { name: /schedule: weekly/i }),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="MonthlyPluralStreak"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Take measurements',
            streak: 6,
            schedule: 'monthly',
            count: 2,
            period: 1,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('6 months streak')).toBeInTheDocument();
        await expect(
            canvas.getByText(/2 times per month/i),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="WeeklyOnceEveryTwoWeeks"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Deep clean kitchen',
            streak: 2,
            schedule: 'weekly',
            count: 1,
            period: 2,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('2 weeks streak')).toBeInTheDocument();
        await expect(
            canvas.getByText(/1 time per 2 weeks/i),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="MonthlyFourInTwoMonths"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Quarterly review',
            streak: 1,
            schedule: 'monthly',
            count: 4,
            period: 2,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(
            canvas.getByText(/4 times per 2 months/i),
        ).toBeInTheDocument();
    }}
/>

<Story
    name="NoStreak"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Stretch',
            streak: 0,
            schedule: 'daily',
            count: 1,
            period: 1,
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('No current streak')).toBeInTheDocument();
    }}
/>
