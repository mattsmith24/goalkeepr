<script lang="ts">
    import type { Goal } from '$lib/types';

    interface Props {
        goal: Goal;
        onDelete?: (id: number) => void;
    }

    const { goal, onDelete }: Props = $props();
</script>

<li class="flex items-center gap-2">
    <span>{goal.description}</span>
    {#if onDelete}
        <button
            type="button"
            class="ml-auto text-sm text-red-600 hover:underline"
            onclick={() => onDelete(goal.id)}
        >
            Delete
        </button>
    {/if}
</li>
