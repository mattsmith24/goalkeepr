<script lang="ts">
    import type { Milestone } from '$lib/types';
    import MilestoneItem from './MilestoneItem.svelte';
    import NewMilestoneForm from './NewMilestoneForm.svelte';

    interface Props {
        milestones: Milestone[];
        onDelete: (id: number) => void;
        onUpdate: (
            id: number,
            description: string,
            dueDate: string | null,
            doneDate: string | null,
            note: string | null,
            extendedDescription: string | null,
        ) => void;
        readOnly?: boolean;
    }

    const {
        milestones = [],
        onDelete,
        onUpdate,
        readOnly = false,
    }: Props = $props();
</script>

<div class="m-2 p-2">
    <h2>Milestones</h2>
    {#if !readOnly}
        <NewMilestoneForm />
    {/if}
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {#each milestones as milestone (milestone.id)}
            <MilestoneItem {milestone} {onDelete} {onUpdate} {readOnly} />
        {:else}
            <li class="italic">No milestones yet. Break it down!</li>
        {/each}
    </ul>
</div>
