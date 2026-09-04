<script lang="ts">
    import { tick } from 'svelte';
    import type { Snippet } from 'svelte';
    import DeleteButton from './DeleteButton.svelte';

    interface Props {
        description: string;
        onUpdateDescription: (description: string) => void;
        onDelete: () => void;
        children?: Snippet;
        actions?: Snippet;
    }

    const {
        description,
        onUpdateDescription,
        onDelete,
        children,
        actions,
    }: Props = $props();

    let editing = $state(false);
    let draft = $state('');
    let inputElement: HTMLInputElement | undefined = $state();

    async function startEdit() {
        draft = description;
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
        if (!trimmed || trimmed === description) return;
        onUpdateDescription(trimmed);
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

<li
    class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
>
    {#if editing}
        <div>
            <input
                bind:this={inputElement}
                bind:value={draft}
                onkeydown={handleKeydown}
                onblur={cancelEdit}
                class="input flex-1 text-3xl"
            />
        </div>
    {:else}
        <button
            type="button"
            class="btn-edit px-2 py-1 text-3xl"
            onclick={startEdit}
        >
            {description}
        </button>
    {/if}
    {#if children}
        {@render children()}
    {/if}
    <div class="actions flex">
        {#if actions}
            {@render actions()}
        {/if}
        <DeleteButton {onDelete} />
    </div>
</li>
