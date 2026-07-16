<script lang="ts">

    interface Goal {
        id: number,
        description: string
    }

    interface Props {
        goals: Goal[];
    }

    const {
        goals = [],
    }: Props = $props();
</script>

<div class="m-2 p-2">
<h1>Goals</h1>
<ul>
    {#each goals as goal (goal.id)}
        <li>{goal.description}</li>
    {:else}
        <li class="italic">No goals yet. Time to dream!</li>
    {/each}
</ul>
<h1>New Goal</h1>
<form method="POST">
    <label for="goal-description">What is your goal?</label>
    <input id="goal-description" name="goal-description" />
    <input type="submit" value="Add Goal" />
</form>
</div>