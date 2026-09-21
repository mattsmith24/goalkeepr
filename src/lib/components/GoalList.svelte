<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { Goal } from '$lib/types';
    import GoalItem from './GoalItem.svelte';

    interface Props {
        goals: Goal[];
        heading?: string;
        emptyMessage?: string;
        children?: Snippet;
    }

    const {
        goals = [],
        heading = 'Goals',
        emptyMessage = 'No goals yet. Time to dream!',
        children,
    }: Props = $props();
</script>

<div class="m-2 p-2">
    {#if children}
        <div class="flex items-center justify-between gap-4">
            <h2 class="text-[x-large]">{heading}</h2>
            {@render children()}
        </div>
    {:else}
        <h2>{heading}</h2>
    {/if}
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
