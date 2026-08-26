<script lang="ts">
    import { resolve } from '$app/paths';
    import EditableItem from './EditableItem.svelte';
    import HabitSchedule from './HabitSchedule.svelte';
    import type { Habit } from '$lib/types';
    import { toDateString } from '$lib/dates';

    interface Props {
        habit: Habit;
        onDelete: (id: number) => void;
        onUpdate: (id: number, description: string) => void;
        onUpdateSchedule: (
            id: number,
            schedule: 'daily' | 'weekly' | 'monthly',
            count: number,
            period: number,
        ) => void;
        onMarkDone: (id: number, date: string, note: string | null) => void;
    }

    const { habit, onDelete, onUpdate, onUpdateSchedule, onMarkDone }: Props =
        $props();

    let markingDone = $state(false);
    let draftDate = $state('');
    let draftNote = $state('');

    function updateDescription(description: string) {
        onUpdate(habit.id, description);
    }

    function updateSchedule(
        schedule: 'daily' | 'weekly' | 'monthly',
        count: number,
        period: number,
    ) {
        onUpdateSchedule(habit.id, schedule, count, period);
    }

    function periodUnit(schedule: Habit['schedule'], count: number): string {
        const base =
            schedule === 'daily'
                ? 'day'
                : schedule === 'weekly'
                  ? 'week'
                  : 'month';
        return count === 1 ? base : `${base}s`;
    }

    function startMarkDone() {
        draftDate = toDateString();
        draftNote = '';
        markingDone = true;
    }

    function cancelMarkDone() {
        markingDone = false;
        draftDate = '';
        draftNote = '';
    }

    function saveMarkDone() {
        const date = draftDate.trim();
        const note = draftNote.trim() || null;
        markingDone = false;
        draftDate = '';
        draftNote = '';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
        onMarkDone(habit.id, date, note);
    }
</script>

<EditableItem
    description={habit.description}
    onUpdateDescription={updateDescription}
    onDelete={() => onDelete(habit.id)}
>
    <p class="px-2 py-1 text-sm text-gray-600">
        {habit.streak === 0
            ? 'No current streak'
            : `${habit.streak} ${periodUnit(habit.schedule, habit.streak)} streak`}
    </p>
    <HabitSchedule
        schedule={habit.schedule}
        count={habit.count}
        period={habit.period}
        onUpdate={updateSchedule}
    />
    {#if markingDone}
        <form
            class="flex flex-wrap items-center gap-2"
            onsubmit={(e) => {
                e.preventDefault();
                saveMarkDone();
            }}
        >
            <input
                type="date"
                bind:value={draftDate}
                aria-label="Done date"
                required
                class="input"
            />
            <input
                type="text"
                bind:value={draftNote}
                placeholder="Note (optional)"
                aria-label="Note"
                class="input"
            />
            <button type="submit" class="btn-link text-sm"> Save </button>
            <button
                type="button"
                class="btn-cancel text-sm"
                onclick={cancelMarkDone}
            >
                Cancel
            </button>
        </form>
    {:else}
        <button
            type="button"
            class="btn-link block px-2 py-1"
            onclick={startMarkDone}
        >
            Mark done
        </button>
    {/if}
    <a
        href={resolve('/goals/[id]/habits/[habitId]', {
            id: String(habit.goalId),
            habitId: String(habit.id),
        })}
        class="btn-link block px-2 py-1"
    >
        History
    </a>
</EditableItem>
