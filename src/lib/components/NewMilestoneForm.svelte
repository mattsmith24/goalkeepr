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
    <form method="POST" action="?/createMilestone">
        <label for="milestone-description">What is your milestone?</label>
        <input id="milestone-description" name="milestone-description" class="border border-gray-500"/>
        <input type="submit" value="Add Milestone" class="text-blue-800 hover:underline"/>
        <button type="button" class="text-gray-600 hover:underline" onclick={close}>
            Cancel
        </button>
    </form>
{:else}
    <button type="button" class="text-blue-800 hover:underline" onclick={() => (open = true)}>
        Add Milestone
    </button>
{/if}