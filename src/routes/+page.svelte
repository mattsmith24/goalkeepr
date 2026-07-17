<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import type { PageProps } from './$types';
    import GoalList from '$lib/components/GoalList.svelte';

    let { data }: PageProps = $props();

    async function handleDelete(id: number) {
        const formData = new FormData();
        formData.set('id', String(id));
        const response = await fetch('?/delete', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }
</script>

<GoalList goals={data.goals} onDelete={handleDelete} />