<script lang="ts">
    import type { PageProps } from './$types';
    import GoalList from '$lib/components/GoalList.svelte';

    let { data }: PageProps = $props();
</script>

<GoalList goals={data.goals} />

