<script lang="ts">
    import { LineChart } from 'layerchart';
    import { resolve } from '$app/paths';
    import EditableItem from './EditableItem.svelte';
    import type { Measurement } from '$lib/types';
    import { toDateString, fromDateString } from '$lib/dates';

    interface Props {
        measurement: Measurement;
        onDelete: (id: number) => void;
        onUpdate: (id: number, description: string) => void;
        onRecord: (
            id: number,
            date: string,
            value: number,
            note: string | null,
        ) => void;
    }

    const { measurement, onDelete, onUpdate, onRecord }: Props = $props();

    let recording = $state(false);
    let draftDate = $state('');
    let draftValue = $state('');
    let draftNote = $state('');

    function updateDescription(description: string) {
        onUpdate(measurement.id, description);
    }

    function startRecord() {
        draftDate = toDateString();
        draftValue = '';
        draftNote = '';
        recording = true;
    }

    function cancelRecord() {
        recording = false;
        draftDate = '';
        draftValue = '';
        draftNote = '';
    }

    function saveRecord() {
        const valueRaw = String(draftValue).trim();
        const value = Number(valueRaw);
        const date = draftDate.trim();
        const note = draftNote.trim() || null;
        recording = false;
        draftDate = '';
        draftValue = '';
        draftNote = '';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
        if (valueRaw === '' || Number.isNaN(value)) return;
        onRecord(measurement.id, date, value, note);
    }
</script>

<EditableItem
    description={measurement.description}
    onUpdateDescription={updateDescription}
    onDelete={() => onDelete(measurement.id)}
>
    <LineChart
        data={measurement.records}
        x={(d) => fromDateString(d.date)}
        y="value"
        yDomain={null}
        axis={false}
        grid={false}
        props={{
            highlight: {
                points: { r: 3, class: 'stroke-2 stroke-surface-100' },
            },
            /*, spline: {class: 'stroke-blue-600'},*/
        }}
        width={124}
        height={18}
    />
    {#if recording}
        <form
            class="flex flex-wrap items-center gap-2"
            onsubmit={(e) => {
                e.preventDefault();
                saveRecord();
            }}
        >
            <input
                type="date"
                bind:value={draftDate}
                aria-label="Date"
                required
                class="border border-gray-800 px-2 py-1"
            />
            <input
                type="number"
                step="any"
                bind:value={draftValue}
                placeholder="Value"
                aria-label="Value"
                required
                class="border border-gray-800 px-2 py-1"
            />
            <input
                type="text"
                bind:value={draftNote}
                placeholder="Note (optional)"
                aria-label="Note"
                class="border border-gray-800 px-2 py-1"
            />
            <button type="submit" class="text-sm btn-link">
                Save
            </button>
            <button
                type="button"
                class="text-sm btn-cancel"
                onclick={cancelRecord}
            >
                Cancel
            </button>
        </form>
    {:else}
        <button
            type="button"
            class="block px-2 py-1 btn-link"
            onclick={startRecord}
        >
            Add record
        </button>
    {/if}
    <a
        href={resolve('/goals/[id]/measurements/[measurementId]', {
            id: String(measurement.goalId),
            measurementId: String(measurement.id),
        })}
        class="block px-2 py-1 btn-link"
    >
        History
    </a>
</EditableItem>
