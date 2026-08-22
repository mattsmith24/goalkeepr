<script lang="ts">
    type Schedule = 'daily' | 'weekly' | 'monthly';

    interface Props {
        schedule: Schedule;
        count: number;
        onUpdate: (schedule: Schedule, count: number) => void;
    }

    const { schedule, count, onUpdate }: Props = $props();

    const options: Schedule[] = ['daily', 'weekly', 'monthly'];

    let editing = $state(false);
    let draftSchedule = $state<Schedule>('daily');
    let draftCount = $state(1);

    function startEdit() {
        draftSchedule = schedule;
        draftCount = count;
        editing = true;
    }

    function cancelEdit() {
        editing = false;
    }

    function saveEdit() {
        editing = false;
        const cleanedCount = Math.max(1, Math.floor(draftCount));
        if (cleanedCount !== count || draftSchedule !== schedule) {
            onUpdate(draftSchedule, cleanedCount);
        }
    }

    function periodLabel(s: Schedule): string {
        return s === 'daily' ? 'day' : s === 'weekly' ? 'week' : 'month';
    }
</script>

{#if editing}
    <form
        class="flex items-center gap-2"
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
            <span class="text-sm text-gray-600">
                {draftCount === 1 ? 'time' : 'times'} per {periodLabel(
                    draftSchedule,
                )}
            </span>
        {/if}
        <button type="submit" class="btn-link text-sm">Save</button>
        <button type="button" class="btn-cancel text-sm" onclick={cancelEdit}>
            Cancel
        </button>
    </form>
{:else}
    <button type="button" class="btn-link block px-2 py-1" onclick={startEdit}>
        Schedule: {schedule}{#if schedule !== 'daily' && count > 1},
            {count} times per {periodLabel(schedule)}
        {/if}
    </button>
{/if}
