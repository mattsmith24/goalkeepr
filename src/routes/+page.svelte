<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<h1>Goals</h1>
<ul>
    {#each data.goals as goal}
        <li>{goal.description}</li>
    {/each}
</ul>
<h1>New Goal</h1>
<form method="POST">
    <label for="goal-description">What is your goal?</label>
    <input id="goal-description" name="goal-description" />
    <input type="submit" value="Add Goal" />
</form>
