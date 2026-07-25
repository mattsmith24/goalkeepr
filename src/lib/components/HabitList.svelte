<script lang="ts">
    import type { Habit } from '$lib/types';
    import HabitItem from './HabitItem.svelte';
    import NewHabitForm from './NewHabitForm.svelte';

    interface Props {
        habits: Habit[];
        onDelete: (id: number) => void;
        onUpdate: (id: number, description: string) => void;
    }

    const {
        habits = [],
        onDelete,
        onUpdate,
    }: Props = $props();
</script>

<div class="m-2 p-2">
<h2>Habits</h2>
<ul>
    {#each habits as habit (habit.id)}
        <HabitItem {habit} {onDelete} {onUpdate} />
    {:else}
        <li class="italic">No habits yet. Build a routine!</li>
    {/each}
</ul>
<NewHabitForm />
</div>
