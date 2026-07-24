<script lang="ts">
    import { tick } from 'svelte';
    import type { Goal } from '$lib/types';

    interface Props {
        goal: Goal;
        onUpdate: (id: number, description: string) => void;
    }

    const { goal, onUpdate }: Props = $props();

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

{#if editing}
    <input
        bind:this={inputElement}
        bind:value={draft}
        onkeydown={handleKeydown}
        onblur={cancelEdit}
        class="w-full border border-gray-800 px-2 py-1 text-2xl font-bold"
    />
{:else}
    <h1>
        <button
            type="button"
            class="cursor-text text-left text-2xl font-bold hover:bg-gray-100"
            onclick={startEdit}
        >
            {goal.description}
        </button>
    </h1>
{/if}
