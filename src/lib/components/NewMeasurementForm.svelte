<script lang="ts">
    import { tick } from 'svelte';

    const PROMPT =
        'What are the details? How does it relate to the goal? What are the success criteria?';

    let open = $state(false);
    let textareaElement: HTMLTextAreaElement | undefined = $state();

    async function openForm() {
        open = true;
        await tick();
        textareaElement?.focus();
    }

    function close() {
        open = false;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open) {
            event.preventDefault();
            close();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
    <form method="POST" action="?/createMeasurement" class="mx-auto max-w-2xl">
        <label for="measurement-description" class="block">
            What are you measuring?
        </label>
        <input
            id="measurement-description"
            name="measurement-description"
            class="input"
        />
        <label for="measurement-extended-description" class="mt-2 block italic">
            {PROMPT}
        </label>
        <textarea
            id="measurement-extended-description"
            name="measurement-extended-description"
            bind:this={textareaElement}
            class="input mt-1 w-full text-left"
            rows="6"
        ></textarea>
        <div class="mt-2 flex flex-wrap gap-x-4 text-sm">
            <input type="submit" value="Add Measurement" class="btn-link" />
            <button type="button" class="btn-cancel" onclick={close}>
                Cancel
            </button>
        </div>
    </form>
{:else}
    <button type="button" class="btn-link" onclick={openForm}>
        Add Measurement
    </button>
{/if}
