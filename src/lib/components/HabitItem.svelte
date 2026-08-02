<script lang="ts">
    import { tick } from 'svelte';
    import { resolve } from '$app/paths';
    import type { Habit } from '$lib/types';

    interface Props {
        habit: Habit;
        onDelete: (id: number) => void;
        onUpdate: (id: number, description: string) => void;
        onMarkDone: (id: number, date: string, note: string | null) => void;
    }

    const { habit, onDelete, onUpdate, onMarkDone }: Props = $props();

    let editing = $state(false);
    let draft = $state('');
    let inputElement: HTMLInputElement | undefined = $state();

    let markingDone = $state(false);
    let draftDate = $state('');
    let draftNote = $state('');

    async function startEdit() {
        draft = habit.description;
        editing = true;
        await tick();
        inputElement?.focus();
        inputElement?.select();
    }

    function cancelEdit() {
        editing = false;
        draft = '';
    }

    function saveEdit() {
        const trimmed = draft.trim();
        editing = false;
        draft = '';
        if (!trimmed || trimmed === habit.description) return;
        onUpdate(habit.id, trimmed);
    }

    function startMarkDone() {
        draftDate = new Date().toISOString().slice(0, 10);
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

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveEdit();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelEdit();
        }
    }
</script>

<li class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
        {#if editing}
            <input
                bind:this={inputElement}
                bind:value={draft}
                onkeydown={handleKeydown}
                onblur={cancelEdit}
                class="flex-1 border border-gray-800 px-2 py-1"
            />
        {:else}
            <span class="flex-1 px-2 py-1">{habit.description}</span>
            <button
                type="button"
                class="text-sm text-blue-600 hover:underline"
                onclick={startEdit}
            >
                Edit
            </button>
            <button
                type="button"
                class="text-sm text-red-600 hover:underline"
                onclick={() => onDelete(habit.id)}
            >
                Delete
            </button>
        {/if}
    </div>
    {#if !editing}
        <div class="flex flex-wrap items-center gap-2 px-2">
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
                    <button
                        type="submit"
                        class="text-sm text-blue-600 hover:underline"
                    >
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
                    class="text-sm text-green-700 hover:underline"
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
                class="text-sm text-blue-600 hover:underline"
            >
                History
            </a>
        </div>
    {/if}
</li>
