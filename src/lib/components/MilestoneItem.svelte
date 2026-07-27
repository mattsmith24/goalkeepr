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
        ) => void;
    }

    const { milestone, onDelete, onUpdate }: Props = $props();

    let editing = $state(false);
    let editingDate = $state(false);
    let draft = $state('');
    let draftDate = $state('');
    let inputElement: HTMLInputElement | undefined = $state();

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
        onUpdate(milestone.id, trimmed, milestone.dueDate);
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
        onUpdate(milestone.id, milestone.description, next);
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
                        class="hover:bg-gray-100 px-2 py-1"
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
            {:else}
                <button
                    type="button"
                    class="hover:bg-gray-100 px-2 py-1"
                    onclick={startEditDate}
                >
                    Due Date: {milestone.dueDate ?? 'None'}
                </button>
            {/if}
            <div>
                <button
                    type="button"
                    class="text-sm text-red-600 hover:underline px-2 py-1"
                    onclick={() => onDelete(milestone.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
</li>
