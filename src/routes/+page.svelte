<script lang="ts">
    import { resolve } from '$app/paths';
    import type { PageProps } from './$types';
    import GoalList from '$lib/components/GoalList.svelte';
    import ImportData from '$lib/components/ImportData.svelte';

    let { data }: PageProps = $props();
</script>

<GoalList goals={data.goals} />

<div class="m-2 flex items-center gap-2 p-2">
    <a href={resolve('/api/export')} download class="btn-link">Export Data</a>
    <ImportData />
</div>
