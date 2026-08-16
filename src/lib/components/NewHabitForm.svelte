<script lang="ts">
    let open = $state(false);

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
    <form method="POST" action="?/createHabit">
        <label for="habit-description">What is your habit?</label>
        <input
            id="habit-description"
            name="habit-description"
            class="border border-gray-500"
        />
        <input
            type="submit"
            value="Add Habit"
            class="btn-link"
        />
        <button
            type="button"
            class="btn-cancel"
            onclick={close}
        >
            Cancel
        </button>
    </form>
{:else}
    <button
        type="button"
        class="btn-link"
        onclick={() => (open = true)}
    >
        Add Habit
    </button>
{/if}
