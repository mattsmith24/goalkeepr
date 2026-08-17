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
        <input id="goal-description" name="goal-description" class="input" />
        <input type="submit" value="Add Goal" class="btn-link" />
        <button type="button" class="btn-cancel" onclick={close}>
            Cancel
        </button>
    </form>
{:else}
    <button type="button" class="btn-link" onclick={() => (open = true)}>
        Add Goal
    </button>
{/if}
