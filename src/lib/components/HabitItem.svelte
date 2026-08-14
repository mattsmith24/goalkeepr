<script lang="ts">
    import { resolve } from '$app/paths';
    import EditableItem from './EditableItem.svelte';
    import type { Habit } from '$lib/types';
    import { toDateString } from '$lib/dates';

    interface Props {
        habit: Habit;
        onDelete: (id: number) => void;
        onUpdate: (id: number, description: string) => void;
        onMarkDone: (id: number, date: string, note: string | null) => void;
    }

    const { habit, onDelete, onUpdate, onMarkDone }: Props = $props();

    let markingDone = $state(false);
    let draftDate = $state('');
    let draftNote = $state('');

    function updateDescription(description: string) {
        onUpdate(habit.id, description);
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
            : `${habit.streak} day streak`}
    </p>
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
                class="border border-gray-800 px-2 py-1"
            />
            <input
                type="text"
                bind:value={draftNote}
                placeholder="Note (optional)"
                aria-label="Note"
                class="border border-gray-800 px-2 py-1"
            />
            <button type="submit" class="text-sm text-blue-600 hover:underline">
                Save
            </button>
            <button
                type="button"
                class="text-sm text-gray-600 hover:underline"
                onclick={cancelMarkDone}
            >
                Cancel
            </button>
        </form>
    {:else}
        <button
            type="button"
            class="block px-2 py-1 text-green-700 hover:underline"
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
        class="block px-2 py-1 text-blue-600 hover:underline"
    >
        History
    </a>
</EditableItem>
