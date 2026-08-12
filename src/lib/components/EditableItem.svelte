<script lang="ts">
    import { tick } from 'svelte';
    import type { Snippet } from 'svelte';
    import DeleteButton from './DeleteButton.svelte';

    interface Props {
        description: string;
        onUpdateDescription: (description: string) => void;
        onDelete: () => void;
        children?: Snippet;
    }

    const { description, onUpdateDescription, onDelete, children }: Props =
        $props();

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

<li class="my-2 rounded-lg border border-gray-300 px-2 py-1 shadow">
    <div class="flex items-center gap-2">
        <div>
            {#if editing}
                <div>
                    <input
                        bind:this={inputElement}
                        bind:value={draft}
                        onkeydown={handleKeydown}
                        onblur={cancelEdit}
                        class="flex-1 border border-gray-800 px-2 py-1"
                    />
                </div>
            {:else}
                <h3>
                    <button
                        type="button"
                        class="px-2 py-1 hover:bg-gray-100"
                        onclick={startEdit}
                    >
                        {description}
                    </button>
                </h3>
            {/if}
            {#if children}
                {@render children()}
            {/if}
            <div>
                <DeleteButton {onDelete} />
            </div>
        </div>
    </div>
</li>
