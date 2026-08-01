<script lang="ts">
    import { tick } from 'svelte';
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

    let editing = $state(false);
    let editingDate = $state(false);
    let editingDoneDate = $state(false);
    let editingNote = $state(false);
    let draft = $state('');
    let draftDate = $state('');
    let draftDoneDate = $state('');
    let draftNote = $state('');
    let inputElement: HTMLInputElement | undefined = $state();
    let noteInputElement: HTMLInputElement | undefined = $state();

    async function startEditDescription() {
        draft = milestone.description;
        editing = true;
        await tick();
        inputElement?.focus();
        inputElement?.select();
    }

    function cancelEditDescription() {
        editing = false;
        draft = '';
    }

    function saveEditDescription() {
        const trimmed = draft.trim();
        editing = false;
        draft = '';
        if (!trimmed || trimmed === milestone.description) return;
        onUpdate(
            milestone.id,
            trimmed,
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

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveEditDescription();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelEditDescription();
        }
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

<li class="my-2 rounded-lg border border-gray-300 px-2 py-1 shadow">
    <div class="flex items-center gap-2">
        <div>
            {#if editing}
                <div>
                    <input
                        bind:this={inputElement}
                        bind:value={draft}
                        onkeydown={handleKeydown}
                        onblur={cancelEditDescription}
                        class="flex-1 border border-gray-800 px-2 py-1"
                    />
                </div>
            {:else}
                <h3>
                    <button
                        type="button"
                        class="px-2 py-1 hover:bg-gray-100"
                        onclick={startEditDescription}
                    >
                        {milestone.description}
                    </button>
                </h3>
            {/if}
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
                        onblur={cancelEditNote}
                        aria-label="Note"
                        class="flex-1 border border-gray-800 px-2 py-1"
                    />
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
            <div>
                <button
                    type="button"
                    class="px-2 py-1 text-sm text-red-600 hover:underline"
                    onclick={() => onDelete(milestone.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
</li>
