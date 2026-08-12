<script lang="ts">
    import { tick } from 'svelte';

    interface Props {
        onDelete: () => void;
        label?: string;
    }

    const { onDelete, label = 'Delete' }: Props = $props();

    let confirming = $state(false);
    let cancelElement: HTMLButtonElement | undefined = $state();

    async function startConfirm() {
        confirming = true;
        await tick();
        cancelElement?.focus();
    }

    function confirm() {
        confirming = false;
        onDelete();
    }
</script>

{#if confirming}
    <span class="flex items-center gap-1 text-sm">
        <span>Are you sure?</span>
        <button
            type="button"
            class="px-2 py-1 text-sm text-red-600 hover:underline"
            onclick={confirm}
        >
            Yes
        </button>
        <button
            bind:this={cancelElement}
            type="button"
            class="px-2 py-1 text-sm hover:underline"
            onclick={() => (confirming = false)}
        >
            Cancel
        </button>
    </span>
{:else}
    <button
        type="button"
        class="px-2 py-1 text-sm text-red-600 hover:underline"
        onclick={startConfirm}
    >
        {label}
    </button>
{/if}
