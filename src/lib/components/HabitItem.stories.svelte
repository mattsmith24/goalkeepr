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
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule) =>
            console.log('updateSchedule', id, schedule),
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
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule) =>
            console.log('updateSchedule', id, schedule),
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
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule) =>
            console.log('updateSchedule', id, schedule),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('4 weeks streak')).toBeInTheDocument();
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
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule) =>
            console.log('updateSchedule', id, schedule),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('1 week streak')).toBeInTheDocument();
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
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule) =>
            console.log('updateSchedule', id, schedule),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('6 months streak')).toBeInTheDocument();
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
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule) =>
            console.log('updateSchedule', id, schedule),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('No current streak')).toBeInTheDocument();
    }}
/>
