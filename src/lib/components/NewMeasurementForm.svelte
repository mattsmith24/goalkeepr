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
    <form method="POST" action="?/createMeasurement">
        <label for="measurement-description">What are you measuring?</label>
        <input
            id="measurement-description"
            name="measurement-description"
            class="input"
        />
        <input type="submit" value="Add Measurement" class="btn-link" />
        <button type="button" class="btn-cancel" onclick={close}>
            Cancel
        </button>
    </form>
{:else}
    <button type="button" class="btn-link" onclick={() => (open = true)}>
        Add Measurement
    </button>
{/if}
