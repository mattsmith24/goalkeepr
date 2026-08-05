<script lang="ts">
    import type { HabitRecord } from '$lib/types';
    import HabitRecordItem from './HabitRecordItem.svelte';

    interface Props {
        records: HabitRecord[];
        onDelete: (id: number) => void;
        onUpdate: (id: number, date: string, note: string | null) => void;
    }

    const { records = [], onDelete, onUpdate }: Props = $props();
</script>

<ul>
    {#each records as record (record.id)}
        <HabitRecordItem {record} {onDelete} {onUpdate} />
    {:else}
        <li class="italic">No records yet.</li>
    {/each}
</ul>
