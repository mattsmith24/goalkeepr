<script lang="ts">
    import { resolve } from '$app/paths';
    import type { PageProps } from './$types';
    import GoalList from '$lib/components/GoalList.svelte';
    import NewGoalForm from '$lib/components/NewGoalForm.svelte';
    import ImportData from '$lib/components/ImportData.svelte';

    let { data }: PageProps = $props();

    const activeGoals = $derived(
        data.goals.filter((goal) => goal.doneDate === null),
    );
    const completedGoals = $derived(
        data.goals.filter((goal) => goal.doneDate !== null),
    );
</script>

<GoalList
    heading="Goals"
    goals={activeGoals}
    emptyMessage="No goals yet. Time to dream!"
/>
<div class="mb-6 flex justify-center">
    <NewGoalForm />
</div>
<GoalList
    heading="Completed"
    goals={completedGoals}
    emptyMessage="No completed goals yet."
/>

<div class="actions m-2 flex items-center justify-center gap-2 p-2">
    <a href={resolve('/api/export')} download class="btn-link pr-2"
        >Export Data</a
    >
    <ImportData />
</div>
