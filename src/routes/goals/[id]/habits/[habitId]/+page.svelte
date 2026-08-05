<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { resolve } from '$app/paths';
    import type { PageProps } from './$types';
    import HabitHistoryList from '$lib/components/HabitHistoryList.svelte';

    let { data }: PageProps = $props();

    async function handleHabitRecordDelete(id: number) {
        const formData = new FormData();
        formData.set('id', String(id));
        const response = await fetch('?/deleteHabitRecord', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleHabitRecordUpdate(
        id: number,
        date: string,
        note: string | null,
    ) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('date', date);
        formData.set('note', note ?? '');
        const response = await fetch('?/updateHabitRecord', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }
</script>

<a
    href={resolve('/goals/[id]', { id: String(data.habit.goalId) })}
    class="text-sm text-blue-600 hover:underline">&larr; Back</a
>
<div class="m-2 p-2">
    <h2>{data.habit.description}</h2>
    <HabitHistoryList
        records={data.records}
        onDelete={handleHabitRecordDelete}
        onUpdate={handleHabitRecordUpdate}
    />
</div>
