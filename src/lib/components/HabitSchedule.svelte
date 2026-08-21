<script lang="ts">
    type Schedule = 'daily' | 'weekly' | 'monthly';

    interface Props {
        schedule: Schedule;
        onUpdate: (schedule: Schedule) => void;
    }

    const { schedule, onUpdate }: Props = $props();

    const options: Schedule[] = ['daily', 'weekly', 'monthly'];

    let editing = $state(false);
    let draft = $state<Schedule>('daily');

    function startEdit() {
        draft = schedule;
        editing = true;
    }

    function cancelEdit() {
        editing = false;
    }

    function saveEdit() {
        editing = false;
        if (draft !== schedule) onUpdate(draft);
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
        <select id="habit-schedule" bind:value={draft} class="input text-sm">
            {#each options as option (option)}
                <option value={option}>{option}</option>
            {/each}
        </select>
        <button type="submit" class="btn-link text-sm">Save</button>
        <button type="button" class="btn-cancel text-sm" onclick={cancelEdit}>
            Cancel
        </button>
    </form>
{:else}
    <button type="button" class="btn-link block px-2 py-1" onclick={startEdit}>
        Schedule: {schedule}
    </button>
{/if}
