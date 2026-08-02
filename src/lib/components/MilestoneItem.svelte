<script lang="ts">
    import { tick } from 'svelte';
    import EditableItem from './EditableItem.svelte';
    import type { Milestone } from '$lib/types';

    interface Props {
        milestone: Milestone;
        onDelete: (id: number) => void;
        onUpdate: (
            id: number,
            description: string,
            dueDate: string | null,
            doneDate: string | null,
            note: string | null,
        ) => void;
    }

    const { milestone, onDelete, onUpdate }: Props = $props();

    let editingDate = $state(false);
    let editingDoneDate = $state(false);
    let editingNote = $state(false);
    let draftDate = $state('');
    let draftDoneDate = $state('');
    let draftNote = $state('');
    let noteInputElement: HTMLInputElement | undefined = $state();

    function updateDescription(description: string) {
        onUpdate(
            milestone.id,
            description,
            milestone.dueDate,
            milestone.doneDate,
            milestone.note,
        );
    }

    function startEditDate() {
        draftDate = milestone.dueDate ?? '';
        editingDate = true;
    }

    function cancelEditDate() {
        editingDate = false;
        draftDate = '';
    }

    function saveEditDate() {
        const next = draftDate.trim() || null;
        editingDate = false;
        draftDate = '';
        if (next === milestone.dueDate) return;
        onUpdate(
            milestone.id,
            milestone.description,
            next,
            milestone.doneDate,
            milestone.note,
        );
    }

    function startEditDoneDate() {
        draftDoneDate = milestone.doneDate ?? '';
        editingDoneDate = true;
    }

    function cancelEditDoneDate() {
        editingDoneDate = false;
        draftDoneDate = '';
    }

    function saveEditDoneDate() {
        const next = draftDoneDate.trim() || null;
        editingDoneDate = false;
        draftDoneDate = '';
        if (next === milestone.doneDate) return;
        onUpdate(
            milestone.id,
            milestone.description,
            milestone.dueDate,
            next,
            milestone.note,
        );
    }

    async function startEditNote() {
        draftNote = milestone.note ?? '';
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
        if (next === milestone.note) return;
        onUpdate(
            milestone.id,
            milestone.description,
            milestone.dueDate,
            milestone.doneDate,
            next,
        );
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

<EditableItem
    description={milestone.description}
    onUpdateDescription={updateDescription}
    onDelete={() => onDelete(milestone.id)}
>
    {#if editingDate}
        <div class="flex items-center gap-2">
            <input
                type="date"
                bind:value={draftDate}
                aria-label="Due date"
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
        </div>
    {:else if milestone.dueDate}
        <button
            type="button"
            class="block px-2 py-1 hover:bg-gray-100"
            onclick={startEditDate}
        >
            Due Date: {milestone.dueDate}
        </button>
    {:else}
        <button
            type="button"
            class="block px-2 py-1 text-blue-600 hover:underline"
            onclick={startEditDate}
        >
            Add Due Date
        </button>
    {/if}
    {#if editingDoneDate}
        <div class="flex items-center gap-2">
            <input
                type="date"
                bind:value={draftDoneDate}
                aria-label="Done date"
                class="border border-gray-800 px-2 py-1"
            />
            <button
                type="button"
                class="text-sm text-blue-600 hover:underline"
                onclick={saveEditDoneDate}
            >
                Save
            </button>
            <button
                type="button"
                class="text-sm text-gray-600 hover:underline"
                onclick={cancelEditDoneDate}
            >
                Cancel
            </button>
        </div>
    {:else if milestone.doneDate}
        <button
            type="button"
            class="block px-2 py-1 hover:bg-gray-100"
            onclick={startEditDoneDate}
        >
            Done Date: {milestone.doneDate}
        </button>
    {:else}
        <button
            type="button"
            class="block px-2 py-1 text-blue-600 hover:underline"
            onclick={startEditDoneDate}
        >
            Add Done Date
        </button>
    {/if}
    {#if editingNote}
        <div>
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
        </div>
    {:else if milestone.note}
        <button
            type="button"
            class="block px-2 py-1 text-left hover:bg-gray-100"
            onclick={startEditNote}
        >
            Note: {milestone.note}
        </button>
    {:else}
        <button
            type="button"
            class="block px-2 py-1 text-left text-blue-600 hover:underline"
            onclick={startEditNote}
        >
            Add Note
        </button>
    {/if}
</EditableItem>
