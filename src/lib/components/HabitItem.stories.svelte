<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import HabitItem from './HabitItem.svelte';

    /** @param {number[]} daysAgo */
    function recentDates(daysAgo) {
        const dates = [];
        for (let i = 0; i < daysAgo.length; i++) {
            // eslint-disable-next-line svelte/prefer-svelte-reactivity
            const d = new Date();
            d.setDate(d.getDate() - daysAgo[i]);
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            dates.push(`${d.getFullYear()}-${month}-${day}`);
        }
        return dates.sort();
    }

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
            expiringSoon: false,
            schedule: 'daily',
            count: 1,
            period: 1,
            recordDates: recentDates([0, 1, 2, 3, 5, 7, 10, 14, 21, 30]),
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
            expiringSoon: false,
            schedule: 'daily',
            count: 1,
            period: 1,
            recordDates: recentDates([0]),
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
            expiringSoon: false,
            schedule: 'weekly',
            count: 4,
            period: 1,
            recordDates: recentDates([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19,
            ]),
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
            expiringSoon: false,
            schedule: 'weekly',
            count: 1,
            period: 1,
            recordDates: recentDates([0]),
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
            expiringSoon: false,
            schedule: 'monthly',
            count: 2,
            period: 1,
            recordDates: recentDates([
                0, 1, 2, 3, 4, 5, 30, 31, 32, 33, 34, 35, 60, 61, 62, 63, 64,
                65, 90, 91, 92, 93, 94, 95, 120, 121, 122, 123, 124, 125, 150,
                151, 152, 153, 154, 155,
            ]),
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
            expiringSoon: false,
            schedule: 'weekly',
            count: 1,
            period: 2,
            recordDates: recentDates([0, 14]),
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
            expiringSoon: false,
            schedule: 'monthly',
            count: 4,
            period: 2,
            recordDates: recentDates([0]),
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
            expiringSoon: false,
            schedule: 'daily',
            count: 1,
            period: 1,
            recordDates: [],
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

<Story
    name="ExpiringSoon"
    args={{
        habit: {
            id: 1,
            goalId: 1,
            description: 'Stretch',
            streak: 4,
            expiringSoon: true,
            schedule: 'daily',
            count: 1,
            period: 1,
            recordDates: recentDates([1, 2, 3, 4]),
        },
        onDelete: (id) => console.log('delete', id),
        onUpdate: (id, description) => console.log('update', id, description),
        onUpdateSchedule: (id, schedule, count, period) =>
            console.log('updateSchedule', id, schedule, count, period),
        onMarkDone: (id, date, note) => console.log('markDone', id, date, note),
    }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText(/⏳ 4 days streak/)).toBeInTheDocument();
    }}
/>
