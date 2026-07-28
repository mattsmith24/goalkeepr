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
    <form method="POST" action="?/create">
        <label for="goal-description">What is your goal?</label>
        <input
            id="goal-description"
            name="goal-description"
            class="border border-gray-500"
        />
        <input
            type="submit"
            value="Add Goal"
            class="text-blue-800 hover:underline"
        />
        <button
            type="button"
            class="text-gray-600 hover:underline"
            onclick={close}
        >
            Cancel
        </button>
    </form>
{:else}
    <button
        type="button"
        class="text-blue-800 hover:underline"
        onclick={() => (open = true)}
    >
        Add Goal
    </button>
{/if}
