<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import type { PageProps } from './$types';
    import GoalTitle from '$lib/components/GoalTitle.svelte';

    let { data }: PageProps = $props();

    async function handleUpdate(id: number, description: string) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('description', description);
        const response = await fetch('?/update', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }
</script>

<a href="/" class="text-sm text-blue-600 hover:underline">&larr; Back</a>
<div class="mt-2 m-2 p-2">
    <GoalTitle goal={data.goal} onUpdate={handleUpdate} />
</div>
