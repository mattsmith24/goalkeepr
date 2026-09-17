<script lang="ts">
    import { tick } from 'svelte';
    import { LineChart } from 'layerchart';
    import { resolve } from '$app/paths';
    import EditableItem from './EditableItem.svelte';
    import type { Measurement } from '$lib/types';
    import { toDateString, fromDateString } from '$lib/dates';

    const PROMPT =
        'What are the details? How does it relate to the goal? What are the success criteria?';

    interface Props {
        measurement: Measurement;
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
        measurement,
        onDelete,
        onUpdate,
        onRecord,
        readOnly = false,
    }: Props = $props();

    let recording = $state(false);
    let draftDate = $state('');
    let draftValue = $state('');
    let draftNote = $state('');
    let editingExtendedDescription = $state(false);
    let draftExtendedDescription = $state('');
    let extendedDescriptionTextareaElement: HTMLTextAreaElement | undefined =
        $state();

    const latestRecord = $derived.by(() => {
        if (!measurement.records.length) return null;
        return measurement.records.reduce((latest, record) =>
            !latest || record.date > latest.date ? record : latest,
        );
    });

    function updateDescription(description: string) {
        onUpdate(measurement.id, description, measurement.extendedDescription);
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

    async function startEditExtendedDescription() {
        draftExtendedDescription = measurement.extendedDescription ?? '';
        editingExtendedDescription = true;
        await tick();
        extendedDescriptionTextareaElement?.focus();
        extendedDescriptionTextareaElement?.setSelectionRange(
            draftExtendedDescription.length,
            draftExtendedDescription.length,
        );
    }

    function cancelEditExtendedDescription() {
        editingExtendedDescription = false;
        draftExtendedDescription = '';
    }

    function saveEditExtendedDescription() {
        const next = draftExtendedDescription.trim() || null;
        editingExtendedDescription = false;
        draftExtendedDescription = '';
        if (next === measurement.extendedDescription) return;
        onUpdate(measurement.id, measurement.description, next);
    }

    function handleExtendedDescriptionKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            cancelEditExtendedDescription();
        } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            saveEditExtendedDescription();
        }
    }
</script>

{#if readOnly}
    <li
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
        <span class="block text-3xl">{measurement.description}</span>
        {#if measurement.extendedDescription}
            <p class="mt-2 whitespace-pre-wrap text-gray-700 italic">
                {measurement.extendedDescription}
            </p>
        {/if}
        <div class="px-2 py-1 text-gray-600">
            {latestRecord ? latestRecord.value : 'No value yet'}
        </div>
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
            }}
            width={124}
            height={18}
        />
    </li>
{:else}
    <EditableItem
        description={measurement.description}
        onUpdateDescription={updateDescription}
        onDelete={() => onDelete(measurement.id)}
    >
        {#if editingExtendedDescription}
            <div class="mx-auto max-w-2xl text-center">
                <label
                    for="measurement-extended-description-edit-{measurement.id}"
                    class="block italic"
                >
                    {PROMPT}
                </label>
                <textarea
                    id="measurement-extended-description-edit-{measurement.id}"
                    bind:this={extendedDescriptionTextareaElement}
                    bind:value={draftExtendedDescription}
                    onkeydown={handleExtendedDescriptionKeydown}
                    class="input mt-1 w-full text-left"
                    rows="6"
                ></textarea>
                <div class="mt-2 flex flex-wrap justify-center gap-x-4 text-sm">
                    <button
                        type="button"
                        class="btn-link"
                        onclick={saveEditExtendedDescription}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        class="btn-cancel"
                        onclick={cancelEditExtendedDescription}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        {:else if measurement.extendedDescription}
            <button
                type="button"
                class="btn-edit block px-2 py-1 text-left whitespace-pre-wrap italic"
                onclick={startEditExtendedDescription}
            >
                {measurement.extendedDescription}
            </button>
        {:else}
            <button
                type="button"
                class="btn-link block px-2 py-1 text-left"
                onclick={startEditExtendedDescription}
            >
                Add extended description
            </button>
        {/if}
        <div class="px-2 py-1 text-gray-600">
            {latestRecord ? latestRecord.value : 'No value yet'}
        </div>
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
        {#snippet actions()}
            {#if recording}
                <form
                    class="flex w-full flex-wrap items-center gap-2"
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
                        class="input"
                    />
                    <input
                        type="number"
                        step="any"
                        bind:value={draftValue}
                        placeholder="Value"
                        aria-label="Value"
                        required
                        class="input"
                    />
                    <input
                        type="text"
                        bind:value={draftNote}
                        placeholder="Note (optional)"
                        aria-label="Note"
                        class="input"
                    />
                    <button type="submit" class="btn-link text-sm">
                        Save
                    </button>
                    <button
                        type="button"
                        class="btn-cancel text-sm"
                        onclick={cancelRecord}
                    >
                        Cancel
                    </button>
                </form>
            {:else}
                <button
                    type="button"
                    class="btn-link block px-2 py-1"
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
                class="btn-link block px-2 py-1"
            >
                History
            </a>
        {/snippet}
    </EditableItem>
{/if}
