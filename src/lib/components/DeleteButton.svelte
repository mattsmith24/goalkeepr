<script lang="ts">
    import { tick } from 'svelte';

    interface Props {
        onDelete: () => void;
        label?: string;
        class?: string;
    }

    const {
        onDelete,
        label = 'Delete',
        class: extraClass = '',
    }: Props = $props();

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
    <span class="flex items-center gap-1 text-sm {extraClass}">
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
            class="btn-cancel px-2 py-1 text-sm"
            onclick={() => (confirming = false)}
        >
            Cancel
        </button>
    </span>
{:else}
    <button
        type="button"
        class="px-2 py-1 text-sm text-red-600 hover:underline {extraClass}"
        aria-label={label}
        onclick={startConfirm}
    >
        {label}
    </button>
{/if}
