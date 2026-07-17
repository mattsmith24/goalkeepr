<script lang="ts">
    import type { Goal } from '$lib/types';
    import GoalItem from './GoalItem.svelte';
    import NewGoalForm from './NewGoalForm.svelte';

    interface Props {
        goals: Goal[];
        onDelete?: (id: number) => void;
    }

    const {
        goals = [],
        onDelete,
    }: Props = $props();
</script>

<div class="m-2 p-2">
<h1>Goals</h1>
<ul>
    {#each goals as goal (goal.id)}
        <GoalItem {goal} {onDelete} />
    {:else}
        <li class="italic">No goals yet. Time to dream!</li>
    {/each}
</ul>
<NewGoalForm />
</div>
