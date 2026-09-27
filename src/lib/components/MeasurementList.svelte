<script lang="ts">
    import type { Measurement } from '$lib/types';
    import MeasurementItem from './MeasurementItem.svelte';
    import NewMeasurementForm from './NewMeasurementForm.svelte';

    interface Props {
        measurements: Measurement[];
        onDelete: (id: number) => void;
        onUpdate: (
            id: number,
            description: string,
            extendedDescription: string | null,
        ) => void;
        onRecord: (
            id: number,
            date: string,
            value: number,
            note: string | null,
        ) => void;
        readOnly?: boolean;
    }

    const {
        measurements = [],
        onDelete,
        onUpdate,
        onRecord,
        readOnly = false,
    }: Props = $props();
</script>

<div class="m-2 p-2">
    {#if !readOnly}
        <div class="flex items-center justify-between gap-4">
            <h2 class="text-[x-large]">Measurements</h2>
            <NewMeasurementForm />
        </div>
    {:else}
        <h2>Measurements</h2>
    {/if}
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {#each measurements as measurement (measurement.id)}
            <MeasurementItem
                {measurement}
                {onDelete}
                {onUpdate}
                {onRecord}
                {readOnly}
            />
        {:else}
            <li class="italic">No measurements yet. Track something!</li>
        {/each}
    </ul>
</div>
