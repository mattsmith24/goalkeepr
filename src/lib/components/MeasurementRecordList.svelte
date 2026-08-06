<script lang="ts">
    import type { MeasurementRecord } from '$lib/types';
    import MeasurementRecordItem from './MeasurementRecordItem.svelte';

    interface Props {
        records: MeasurementRecord[];
        onDelete: (id: number) => void;
        onUpdate: (
            id: number,
            date: string,
            value: number,
            note: string | null,
        ) => void;
    }

    const { records = [], onDelete, onUpdate }: Props = $props();
</script>

<ul>
    {#each records as record (record.id)}
        <MeasurementRecordItem {record} {onDelete} {onUpdate} />
    {:else}
        <li class="italic">No records yet.</li>
    {/each}
</ul>
