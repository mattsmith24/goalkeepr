<script lang="ts">
    import type { Goal } from '$lib/types';
    import GoalItem from './GoalItem.svelte';

    interface Props {
        goals: Goal[];
        heading?: string;
        emptyMessage?: string;
    }

    const {
        goals = [],
        heading = 'Goals',
        emptyMessage = 'No goals yet. Time to dream!',
    }: Props = $props();
</script>

<div class="m-2 p-2">
    <h2 class="text-center">{heading}</h2>
    {#if goals.length === 0}
        <p class="text-center italic">{emptyMessage}</p>
    {:else}
        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {#each goals as goal (goal.id)}
                <GoalItem {goal} />
            {/each}
        </ul>
    {/if}
</div>
