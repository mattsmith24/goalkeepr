<script lang="ts">
    import { tick } from 'svelte';

    const PROMPT =
        'Describe this goal. Why do you want to do it? How will it improve your life? Or is there some negative consequence you want to avoid? How does this relate to your personal values (the kind of person you want to be)?';

    interface Props {
        description: string | null;
        onUpdateDescription: (description: string | null) => void;
    }

    const { description, onUpdateDescription }: Props = $props();

    let editing = $state(false);
    let draft = $state('');
    let textareaElement: HTMLTextAreaElement | undefined = $state();

    async function startEdit() {
        draft = description ?? '';
        editing = true;
        await tick();
        textareaElement?.focus();
        textareaElement?.setSelectionRange(draft.length, draft.length);
    }

    function cancelEdit() {
        editing = false;
        draft = '';
    }

    function saveEdit() {
        const trimmed = draft.trim();
        const next = trimmed === '' ? null : trimmed;
        editing = false;
        draft = '';
        if (next === description) return;
        onUpdateDescription(next);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            cancelEdit();
        } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            saveEdit();
        }
    }
</script>

{#if editing}
    <div class="mx-auto max-w-2xl text-center">
        <label for="goal-description" class="block italic">
            {PROMPT}
        </label>
        <textarea
            id="goal-description"
            bind:this={textareaElement}
            bind:value={draft}
            onkeydown={handleKeydown}
            class="input mt-1 w-full text-left"
            rows="6"
        ></textarea>
        <div class="mt-2 flex flex-wrap justify-center gap-x-4 text-sm">
            <button type="button" class="btn-link" onclick={saveEdit}>
                Save
            </button>
            <button type="button" class="btn-cancel" onclick={cancelEdit}>
                Cancel
            </button>
        </div>
    </div>
{:else if description}
    <div class="mx-auto max-w-2xl text-center">
        <p class="whitespace-pre-wrap italic">{description}</p>
        <div class="actions mt-2 flex flex-wrap justify-center">
            <button type="button" class="btn-link" onclick={startEdit}>
                Edit description
            </button>
        </div>
    </div>
{:else}
    <div class="text-center">
        <button type="button" class="btn-link" onclick={startEdit}>
            Add description
        </button>
    </div>
{/if}
