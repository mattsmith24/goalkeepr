<script lang="ts">
    import type { MeasurementRecord } from '$lib/types';

    interface Props {
        records: MeasurementRecord[];
        onDelete: (id: number) => void;
    }

    const { records = [], onDelete }: Props = $props();
</script>

<ul>
    {#each records as record (record.id)}
        <li
            class="my-2 flex items-center gap-2 rounded border border-gray-300 px-2 py-1"
        >
            <span class="font-medium">{record.date}</span>
            <span class="font-medium">{record.value}</span>
            {#if record.note}
                <span class="flex-1 text-gray-700">— {record.note}</span>
            {:else}
                <span class="flex-1"></span>
            {/if}
            <button
                type="button"
                class="text-sm text-red-600 hover:underline"
                onclick={() => onDelete(record.id)}
            >
                Delete
            </button>
        </li>
    {:else}
        <li class="italic">No records yet.</li>
    {/each}
</ul>
