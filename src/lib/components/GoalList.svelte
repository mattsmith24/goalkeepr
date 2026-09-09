<script lang="ts">
    import type { Goal } from '$lib/types';
    import GoalItem from './GoalItem.svelte';
    import NewGoalForm from './NewGoalForm.svelte';

    interface Props {
        goals: Goal[];
    }

    const { goals = [] }: Props = $props();
</script>

<div class="m-2 p-2">
    <h1 class="text-center">Goals</h1>
    <div class="mb-6 flex justify-center">
        <NewGoalForm />
    </div>
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {#each goals as goal (goal.id)}
            <GoalItem {goal} />
        {:else}
            <li class="italic">No goals yet. Time to dream!</li>
        {/each}
    </ul>
</div>
