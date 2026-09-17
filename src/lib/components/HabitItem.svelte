<script lang="ts">
    import { tick } from 'svelte';
    import { resolve } from '$app/paths';
    import { scaleThreshold } from 'd3-scale';
    import { Calendar, Chart, Layer, Rect, Tooltip } from 'layerchart';
    import EditableItem from './EditableItem.svelte';
    import HabitSchedule from './HabitSchedule.svelte';
    import type { Habit } from '$lib/types';
    import { toDateString } from '$lib/dates';

    const PROMPT =
        'What are the details? How does it relate to the goal? What are the success criteria?';

    interface Props {
        habit: Habit;
        onDelete: (id: number) => void;
        onUpdate: (
            id: number,
            description: string,
            extendedDescription: string | null,
        ) => void;
        onUpdateSchedule: (
            id: number,
            schedule: 'daily' | 'weekly' | 'monthly',
            count: number,
            period: number,
        ) => void;
        onMarkDone: (id: number, date: string, note: string | null) => void;
        readOnly?: boolean;
    }

    const {
        habit,
        onDelete,
        onUpdate,
        onUpdateSchedule,
        onMarkDone,
        readOnly = false,
    }: Props = $props();

    let markingDone = $state(false);
    let draftDate = $state('');
    let draftNote = $state('');
    let editingExtendedDescription = $state(false);
    let draftExtendedDescription = $state('');
    let extendedDescriptionTextareaElement: HTMLTextAreaElement | undefined =
        $state();

    const now = new Date();
    const ninetyDaysAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 90,
    );

    const data = $derived.by(() => {
        const doneDates = new Set(habit.recordDates);
        const series: { date: Date; value: number | null }[] = [];
        for (
            // eslint-disable-next-line svelte/prefer-svelte-reactivity
            let d = new Date(ninetyDaysAgo);
            d <= now;
            d.setDate(d.getDate() + 1)
        ) {
            const dateStr = toDateString(d);
            series.push({
                date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
                value: doneDates.has(dateStr) ? 1 : null,
            });
        }
        return series;
    });

    function updateDescription(description: string) {
        onUpdate(habit.id, description, habit.extendedDescription);
    }

    function updateSchedule(
        schedule: 'daily' | 'weekly' | 'monthly',
        count: number,
        period: number,
    ) {
        onUpdateSchedule(habit.id, schedule, count, period);
    }

    function periodUnit(schedule: Habit['schedule'], count: number): string {
        const base =
            schedule === 'daily'
                ? 'day'
                : schedule === 'weekly'
                  ? 'week'
                  : 'month';
        return count === 1 ? base : `${base}s`;
    }

    function startMarkDone() {
        draftDate = toDateString();
        draftNote = '';
        markingDone = true;
    }

    function cancelMarkDone() {
        markingDone = false;
        draftDate = '';
        draftNote = '';
    }

    function saveMarkDone() {
        const date = draftDate.trim();
        const note = draftNote.trim() || null;
        markingDone = false;
        draftDate = '';
        draftNote = '';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
        onMarkDone(habit.id, date, note);
    }

    async function startEditExtendedDescription() {
        draftExtendedDescription = habit.extendedDescription ?? '';
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
        if (next === habit.extendedDescription) return;
        onUpdate(habit.id, habit.description, next);
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
        <span class="block text-3xl">{habit.description}</span>
        {#if habit.extendedDescription}
            <p class="mt-2 whitespace-pre-wrap text-gray-700 italic">
                {habit.extendedDescription}
            </p>
        {/if}
        <p class="px-2 py-1 text-gray-600">
            {habit.streak === 0
                ? 'No current streak'
                : `${habit.expiringSoon ? '⏳ ' : ''}${habit.streak} ${periodUnit(habit.schedule, habit.streak)} streak`}
        </p>

        <Chart
            {data}
            x="date"
            c="value"
            cScale={scaleThreshold()}
            cDomain={[1]}
            cRange={['var(--color-primary-500)', 'var(--color-primary-700)']}
            padding={{ top: 20 }}
            width={300}
            height={140}
        >
            {#snippet children({ context })}
                <Layer>
                    <Calendar start={ninetyDaysAgo} end={now}>
                        {#snippet children({ cells, cellSize })}
                            {#each cells as cell (cell.data.date.getTime())}
                                {@const padding = 1}
                                <Rect
                                    x={cell.x + padding}
                                    y={cell.y + padding}
                                    width={cellSize[0] - padding * 2}
                                    height={cellSize[1] - padding * 2}
                                    rx={4}
                                    fill={cell.color ?? 'rgb(0 0 0 / 5%)'}
                                    onpointermove={(e) =>
                                        context.tooltip?.show(e, cell.data)}
                                    onpointerleave={() =>
                                        context.tooltip?.hide()}
                                />
                            {/each}
                        {/snippet}
                    </Calendar>
                </Layer>

                <Tooltip.Root>
                    {#snippet children({ data })}
                        <Tooltip.Header value={data.date} format="day" />
                        <Tooltip.List>
                            <Tooltip.Item
                                label="status"
                                value={data.value != null ? 'Done' : 'Not done'}
                            />
                        </Tooltip.List>
                    {/snippet}
                </Tooltip.Root>
            {/snippet}
        </Chart>
    </li>
{:else}
    <EditableItem
        description={habit.description}
        onUpdateDescription={updateDescription}
        onDelete={() => onDelete(habit.id)}
    >
        {#if editingExtendedDescription}
            <div class="mx-auto max-w-2xl text-center">
                <label
                    for="habit-extended-description-edit-{habit.id}"
                    class="block italic"
                >
                    {PROMPT}
                </label>
                <textarea
                    id="habit-extended-description-edit-{habit.id}"
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
        {:else if habit.extendedDescription}
            <button
                type="button"
                class="btn-edit block px-2 py-1 text-left whitespace-pre-wrap italic"
                onclick={startEditExtendedDescription}
            >
                {habit.extendedDescription}
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
        <p class="px-2 py-1 text-gray-600">
            {habit.streak === 0
                ? 'No current streak'
                : `${habit.expiringSoon ? '⏳ ' : ''}${habit.streak} ${periodUnit(habit.schedule, habit.streak)} streak`}
        </p>

        <Chart
            {data}
            x="date"
            c="value"
            cScale={scaleThreshold()}
            cDomain={[1]}
            cRange={['var(--color-primary-500)', 'var(--color-primary-700)']}
            padding={{ top: 20 }}
            width={300}
            height={140}
        >
            {#snippet children({ context })}
                <Layer>
                    <Calendar start={ninetyDaysAgo} end={now}>
                        {#snippet children({ cells, cellSize })}
                            {#each cells as cell (cell.data.date.getTime())}
                                {@const padding = 1}
                                <Rect
                                    x={cell.x + padding}
                                    y={cell.y + padding}
                                    width={cellSize[0] - padding * 2}
                                    height={cellSize[1] - padding * 2}
                                    rx={4}
                                    fill={cell.color ?? 'rgb(0 0 0 / 5%)'}
                                    onpointermove={(e) =>
                                        context.tooltip?.show(e, cell.data)}
                                    onpointerleave={() =>
                                        context.tooltip?.hide()}
                                />
                            {/each}
                        {/snippet}
                    </Calendar>
                </Layer>

                <Tooltip.Root>
                    {#snippet children({ data })}
                        <Tooltip.Header value={data.date} format="day" />
                        <Tooltip.List>
                            <Tooltip.Item
                                label="status"
                                value={data.value != null ? 'Done' : 'Not done'}
                            />
                        </Tooltip.List>
                    {/snippet}
                </Tooltip.Root>
            {/snippet}
        </Chart>

        <HabitSchedule
            schedule={habit.schedule}
            count={habit.count}
            period={habit.period}
            onUpdate={updateSchedule}
        />
        {#snippet actions()}
            {#if markingDone}
                <form
                    class="flex w-full flex-wrap items-center gap-2"
                    onsubmit={(e) => {
                        e.preventDefault();
                        saveMarkDone();
                    }}
                >
                    <input
                        type="date"
                        bind:value={draftDate}
                        aria-label="Done date"
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
                        onclick={cancelMarkDone}
                    >
                        Cancel
                    </button>
                </form>
            {:else}
                <button
                    type="button"
                    class="btn-link block px-2 py-1 text-sm"
                    onclick={startMarkDone}
                >
                    Mark done
                </button>
            {/if}
            <a
                href={resolve('/goals/[id]/habits/[habitId]', {
                    id: String(habit.goalId),
                    habitId: String(habit.id),
                })}
                class="btn-link block px-2 py-1 text-sm"
            >
                History
            </a>
        {/snippet}
    </EditableItem>
{/if}
