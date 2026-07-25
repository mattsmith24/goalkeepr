<script lang="ts">
    import type { Measurement } from '$lib/types';
    import MeasurementItem from './MeasurementItem.svelte';
    import NewMeasurementForm from './NewMeasurementForm.svelte';

    interface Props {
        measurements: Measurement[];
        onDelete: (id: number) => void;
        onUpdate: (id: number, description: string) => void;
    }

    const {
        measurements = [],
        onDelete,
        onUpdate,
    }: Props = $props();
</script>

<div class="m-2 p-2">
<h2>Measurements</h2>
<ul>
    {#each measurements as measurement (measurement.id)}
        <MeasurementItem {measurement} {onDelete} {onUpdate} />
    {:else}
        <li class="italic">No measurements yet. Track something!</li>
    {/each}
</ul>
<NewMeasurementForm />
</div>