<script lang="ts">
    import { tick } from 'svelte';
    import type { MeasurementRecord } from '$lib/types';

    interface Props {
        record: MeasurementRecord;
        onDelete: (id: number) => void;
        onUpdate: (
            id: number,
            date: string,
            value: number,
            note: string | null,
        ) => void;
    }

    const { record, onDelete, onUpdate }: Props = $props();

    let editingDate = $state(false);
    let editingValue = $state(false);
    let editingNote = $state(false);
    let draftDate = $state('');
    let draftValue = $state('');
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
        onUpdate(record.id, next, record.value, record.note);
    }

    function startEditValue() {
        draftValue = String(record.value);
        editingValue = true;
    }

    function cancelEditValue() {
        editingValue = false;
        draftValue = '';
    }

    function saveEditValue() {
        const raw = String(draftValue).trim();
        const next = Number(raw);
        editingValue = false;
        draftValue = '';
        if (raw === '' || Number.isNaN(next)) return;
        if (next === record.value) return;
        onUpdate(record.id, record.date, next, record.note);
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
        onUpdate(record.id, record.date, record.value, next);
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
    {#if editingValue}
        <input
            type="number"
            step="any"
            bind:value={draftValue}
            aria-label="Value"
            class="border border-gray-800 px-2 py-1"
        />
        <button
            type="button"
            class="text-sm text-blue-600 hover:underline"
            onclick={saveEditValue}
        >
            Save
        </button>
        <button
            type="button"
            class="text-sm text-gray-600 hover:underline"
            onclick={cancelEditValue}
        >
            Cancel
        </button>
    {:else}
        <button
            type="button"
            class="font-medium hover:bg-gray-100"
            onclick={startEditValue}
        >
            {record.value}
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
    {#if !editingDate && !editingValue && !editingNote}
        <button
            type="button"
            class="text-sm text-red-600 hover:underline"
            onclick={() => onDelete(record.id)}
        >
            Delete
        </button>
    {/if}
</li>
