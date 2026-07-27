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
        ) => void;
    }

    const { milestones = [], onDelete, onUpdate }: Props = $props();
</script>

<div class="m-2 p-2">
    <h2>Milestones</h2>
    <ul>
        {#each milestones as milestone (milestone.id)}
            <MilestoneItem {milestone} {onDelete} {onUpdate} />
        {:else}
            <li class="italic">No milestones yet. Break it down!</li>
        {/each}
    </ul>
    <NewMilestoneForm />
</div>
