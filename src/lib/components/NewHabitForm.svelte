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
    <form method="POST" action="?/createHabit" class="mx-auto max-w-2xl">
        <label for="habit-description" class="block">
            What is your habit?
        </label>
        <input id="habit-description" name="habit-description" class="input" />
        <label for="habit-extended-description" class="mt-2 block italic">
            {PROMPT}
        </label>
        <textarea
            id="habit-extended-description"
            name="habit-extended-description"
            bind:this={textareaElement}
            class="input mt-1 w-full text-left"
            rows="6"
        ></textarea>
        <div class="mt-2 flex flex-wrap gap-x-4 text-sm">
            <input type="submit" value="Add Habit" class="btn-link" />
            <button type="button" class="btn-cancel" onclick={close}>
                Cancel
            </button>
        </div>
    </form>
{:else}
    <button type="button" class="btn-link" onclick={openForm}>
        Add Habit
    </button>
{/if}
