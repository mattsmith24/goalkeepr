<script lang="ts">
    import type { Habit } from '$lib/types';
    import HabitItem from './HabitItem.svelte';
    import NewHabitForm from './NewHabitForm.svelte';

    interface Props {
        habits: Habit[];
        onDelete: (id: number) => void;
        onUpdate: (id: number, description: string) => void;
        onMarkDone: (id: number, date: string, note: string | null) => void;
        onUpdateSchedule?: (
            id: number,
            schedule: 'daily' | 'weekly' | 'monthly',
            count: number,
            period: number,
        ) => void;
    }

    const {
        habits = [],
        onDelete,
        onUpdate,
        onMarkDone,
        onUpdateSchedule = () => {},
    }: Props = $props();
</script>

<div class="m-2 p-2">
    <h2>Habits</h2>
    <NewHabitForm />
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {#each habits as habit (habit.id)}
            <HabitItem
                {habit}
                {onDelete}
                {onUpdate}
                {onMarkDone}
                {onUpdateSchedule}
            />
        {:else}
            <li class="italic">No habits yet. Build a routine!</li>
        {/each}
    </ul>
</div>
