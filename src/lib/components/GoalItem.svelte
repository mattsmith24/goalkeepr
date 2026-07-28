<script lang="ts">
    import { tick } from 'svelte';
    import { resolve } from '$app/paths';
    import type { Goal } from '$lib/types';

    interface Props {
        goal: Goal;
        onDelete: (id: number) => void;
        onUpdate: (id: number, description: string) => void;
    }

    const { goal, onDelete, onUpdate }: Props = $props();

    let editing = $state(false);
    let draft = $state('');
    let inputElement: HTMLInputElement | undefined = $state();

    async function startEdit() {
        draft = goal.description;
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
        if (!trimmed || trimmed === goal.description) return;
        onUpdate(goal.id, trimmed);
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

<li class="flex items-center gap-2">
    {#if editing}
        <input
            bind:this={inputElement}
            bind:value={draft}
            onkeydown={handleKeydown}
            onblur={cancelEdit}
            class="flex-1 border border-gray-800 px-2 py-1"
        />
    {:else}
        <a
            href={resolve('/goals/[id]', { id: String(goal.id) })}
            class="flex-1 px-2 py-1 hover:underline">{goal.description}</a
        >
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
            onclick={() => onDelete(goal.id)}
        >
            Delete
        </button>
    {/if}
</li>
