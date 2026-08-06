<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { resolve } from '$app/paths';
    import type { PageProps } from './$types';
    import MeasurementRecordList from '$lib/components/MeasurementRecordList.svelte';

    let { data }: PageProps = $props();

    async function handleMeasurementRecordDelete(id: number) {
        const formData = new FormData();
        formData.set('id', String(id));
        const response = await fetch('?/deleteMeasurementRecord', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleMeasurementRecordUpdate(
        id: number,
        date: string,
        value: number,
        note: string | null,
    ) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('date', date);
        formData.set('value', String(value));
        formData.set('note', note ?? '');
        const response = await fetch('?/updateMeasurementRecord', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }
</script>

<a
    href={resolve('/goals/[id]', { id: String(data.measurement.goalId) })}
    class="text-sm text-blue-600 hover:underline">&larr; Back</a
>
<div class="m-2 p-2">
    <h2>{data.measurement.description}</h2>
    <MeasurementRecordList
        records={data.records}
        onDelete={handleMeasurementRecordDelete}
        onUpdate={handleMeasurementRecordUpdate}
    />
</div>
