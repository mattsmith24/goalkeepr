<script lang="ts">
    import type { Habit } from '$lib/types';
    import HabitItem from './HabitItem.svelte';
    import NewHabitForm from './NewHabitForm.svelte';

    interface Props {
        habits: Habit[];
        onDelete: (id: number) => void;
        onUpdate: (
            id: number,
            description: string,
            extendedDescription: string | null,
        ) => void;
        onMarkDone: (id: number, date: string, note: string | null) => void;
        onUpdateSchedule?: (
            id: number,
            schedule: 'daily' | 'weekly' | 'monthly',
            count: number,
            period: number,
        ) => void;
        readOnly?: boolean;
    }

    const {
        habits = [],
        onDelete,
        onUpdate,
        onMarkDone,
        onUpdateSchedule = () => {},
        readOnly = false,
    }: Props = $props();
</script>

<div class="m-2 p-2">
    {#if !readOnly}
        <div class="flex items-center justify-between gap-4">
            <h2 class="text-[x-large]">Habits</h2>
            <NewHabitForm />
        </div>
    {:else}
        <h2>Habits</h2>
    {/if}
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {#each habits as habit (habit.id)}
            <HabitItem
                {habit}
                {onDelete}
                {onUpdate}
                {onMarkDone}
                {onUpdateSchedule}
                {readOnly}
            />
        {:else}
            <li class="italic">No habits yet. Build a routine!</li>
        {/each}
    </ul>
</div>
