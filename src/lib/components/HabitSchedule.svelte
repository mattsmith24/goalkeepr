<script lang="ts">
    type Schedule = 'daily' | 'weekly' | 'monthly';

    interface Props {
        schedule: Schedule;
        count: number;
        period: number;
        onUpdate: (schedule: Schedule, count: number, period: number) => void;
    }

    const { schedule, count, period, onUpdate }: Props = $props();

    const options: Schedule[] = ['daily', 'weekly', 'monthly'];

    let editing = $state(false);
    let draftSchedule = $state<Schedule>('daily');
    let draftCount = $state(1);
    let draftPeriod = $state(1);

    function startEdit() {
        draftSchedule = schedule;
        draftCount = count;
        draftPeriod = period;
        editing = true;
    }

    function cancelEdit() {
        editing = false;
    }

    function saveEdit() {
        editing = false;
        const cleanedCount = Math.max(1, Math.floor(draftCount));
        const cleanedPeriod =
            draftSchedule === 'daily'
                ? 1
                : Math.max(1, Math.floor(draftPeriod));
        if (
            cleanedCount !== count ||
            cleanedPeriod !== period ||
            draftSchedule !== schedule
        ) {
            onUpdate(draftSchedule, cleanedCount, cleanedPeriod);
        }
    }

    function periodLabel(s: Schedule): string {
        return s === 'daily' ? 'day' : s === 'weekly' ? 'week' : 'month';
    }

    function scheduleDetail(periodN: number): string {
        return periodN === 1
            ? `${periodLabel(schedule)}`
            : `${periodN} ${periodLabel(schedule)}${periodN === 1 ? '' : 's'}`;
    }

    function countLabel(c: number, s: Schedule, periodN: number): string {
        if (c === 1 && periodN === 1) return '';
        return `${c} ${c === 1 ? 'time' : 'times'} per ${scheduleDetail(periodN)}`;
    }
</script>

{#if editing}
    <form
        class="flex flex-wrap items-center gap-2"
        onsubmit={(e) => {
            e.preventDefault();
            saveEdit();
        }}
    >
        <label for="habit-schedule" class="sr-only">Schedule</label>
        <select
            id="habit-schedule"
            bind:value={draftSchedule}
            class="input text-sm"
        >
            {#each options as option (option)}
                <option value={option}>{option}</option>
            {/each}
        </select>
        {#if draftSchedule !== 'daily'}
            <label for="habit-count" class="sr-only"
                >Times per {periodLabel(draftSchedule)}</label
            >
            <input
                id="habit-count"
                type="number"
                min="1"
                bind:value={draftCount}
                class="input w-16 text-sm"
            />
            <span class="text-sm text-gray-600">times per</span>
            <label for="habit-period" class="sr-only"
                >Period in {periodLabel(draftSchedule)}s</label
            >
            <input
                id="habit-period"
                type="number"
                min="1"
                bind:value={draftPeriod}
                class="input w-16 text-sm"
            />
            <span class="text-sm text-gray-600">
                {periodLabel(draftSchedule)}{draftPeriod === 1 ? '' : 's'}
            </span>
        {/if}
        <button type="submit" class="btn-link text-sm">Save</button>
        <button type="button" class="btn-cancel text-sm" onclick={cancelEdit}>
            Cancel
        </button>
    </form>
{:else}
    {@const detail = countLabel(count, schedule, period)}
    <button type="button" class="btn-link block px-2 py-1" onclick={startEdit}>
        Schedule: {schedule}{#if detail}, {detail}{/if}
    </button>
{/if}
