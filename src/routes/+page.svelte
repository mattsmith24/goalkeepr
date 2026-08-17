<script lang="ts">
    import { resolve } from '$app/paths';
    import type { PageProps } from './$types';
    import GoalList from '$lib/components/GoalList.svelte';

    let { data }: PageProps = $props();
</script>

<GoalList goals={data.goals} />

<a href={resolve('/api/export')} download class="btn-link">Export Data</a>
