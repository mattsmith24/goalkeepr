<script lang="ts">
    import { tick } from 'svelte';
    import type { HabitRecord } from '$lib/types';

    interface Props {
        record: HabitRecord;
        onDelete: (id: number) => void;
        onUpdate: (id: number, date: string, note: string | null) => void;
    }

    const { record, onDelete, onUpdate }: Props = $props();

    let editingDate = $state(false);
    let editingNote = $state(false);
    let draftDate = $state('');
    let draftNote = $state('');
    let noteInputElement: HTMLInputElement | undefined = $state();

    function startEditDate() {
        draftDate = record.date;
        editingDate = true;
    }

    function cancelEditDate() {
        editingDate = false;
        draftDate = '';
    }

    function saveEditDate() {
        const next = draftDate.trim();
        editingDate = false;
        draftDate = '';
        if (!next || next === record.date) return;
        onUpdate(record.id, next, record.note);
    }

    async function startEditNote() {
        draftNote = record.note ?? '';
        editingNote = true;
        await tick();
        noteInputElement?.focus();
        noteInputElement?.select();
    }

    function cancelEditNote() {
        editingNote = false;
        draftNote = '';
    }

    function saveEditNote() {
        const next = draftNote.trim() || null;
        editingNote = false;
        draftNote = '';
        if (next === record.note) return;
        onUpdate(record.id, record.date, next);
    }

    function handleNoteKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveEditNote();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelEditNote();
        }
    }
</script>

<li
    class="my-2 flex items-center gap-2 rounded border border-gray-300 px-2 py-1"
>
    {#if editingDate}
        <input
            type="date"
            bind:value={draftDate}
            aria-label="Date"
            class="border border-gray-800 px-2 py-1"
        />
        <button
            type="button"
            class="text-sm text-blue-600 hover:underline"
            onclick={saveEditDate}
        >
            Save
        </button>
        <button
            type="button"
            class="text-sm text-gray-600 hover:underline"
            onclick={cancelEditDate}
        >
            Cancel
        </button>
    {:else}
        <button
            type="button"
            class="font-medium hover:bg-gray-100"
            onclick={startEditDate}
        >
            {record.date}
        </button>
    {/if}
    {#if editingNote}
        <input
            bind:this={noteInputElement}
            bind:value={draftNote}
            onkeydown={handleNoteKeydown}
            aria-label="Note"
            class="flex-1 border border-gray-800 px-2 py-1"
        />
        <button
            type="button"
            class="text-sm text-blue-600 hover:underline"
            onclick={saveEditNote}
        >
            Save
        </button>
        <button
            type="button"
            class="text-sm text-gray-600 hover:underline"
            onclick={cancelEditNote}
        >
            Cancel
        </button>
    {:else if record.note}
        <button
            type="button"
            class="flex-1 text-left text-gray-700 hover:bg-gray-100"
            onclick={startEditNote}
        >
            — {record.note}
        </button>
    {:else}
        <button
            type="button"
            class="flex-1 text-left text-sm text-blue-600 hover:underline"
            onclick={startEditNote}
        >
            Add note
        </button>
    {/if}
    {#if !editingDate && !editingNote}
        <button
            type="button"
            class="text-sm text-red-600 hover:underline"
            onclick={() => onDelete(record.id)}
        >
            Delete
        </button>
    {/if}
</li>
