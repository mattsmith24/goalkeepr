<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import { resolve } from '$app/paths';
    import type { PageProps } from './$types';
    import GoalTitle from '$lib/components/GoalTitle.svelte';
    import MilestoneList from '$lib/components/MilestoneList.svelte';
    import HabitList from '$lib/components/HabitList.svelte';
    import MeasurementList from '$lib/components/MeasurementList.svelte';
    import DeleteButton from '$lib/components/DeleteButton.svelte';

    let { data }: PageProps = $props();

    async function handleDelete() {
        const formData = new FormData();
        formData.set('id', String(data.goal.id));
        const response = await fetch('?/deleteGoal', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await goto(resolve('/'));
        }
    }

    async function handleUpdate(id: number, description: string) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('description', description);
        const response = await fetch('?/update', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleMilestoneUpdate(
        id: number,
        description: string,
        dueDate: string | null,
        doneDate: string | null,
        note: string | null,
    ) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('description', description);
        formData.set('dueDate', dueDate ?? '');
        formData.set('doneDate', doneDate ?? '');
        formData.set('note', note ?? '');
        const response = await fetch('?/updateMilestone', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleMilestoneDelete(id: number) {
        const formData = new FormData();
        formData.set('id', String(id));
        const response = await fetch('?/deleteMilestone', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleHabitUpdate(id: number, description: string) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('description', description);
        const response = await fetch('?/updateHabit', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleHabitDelete(id: number) {
        const formData = new FormData();
        formData.set('id', String(id));
        const response = await fetch('?/deleteHabit', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleHabitMarkDone(
        id: number,
        date: string,
        note: string | null,
    ) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('date', date);
        formData.set('note', note ?? '');
        const response = await fetch('?/markHabitDone', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleMeasurementUpdate(id: number, description: string) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('description', description);
        const response = await fetch('?/updateMeasurement', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleMeasurementDelete(id: number) {
        const formData = new FormData();
        formData.set('id', String(id));
        const response = await fetch('?/deleteMeasurement', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }

    async function handleMeasurementRecord(
        id: number,
        date: string,
        value: number,
        note: string | null,
    ) {
        const formData = new FormData();
        formData.set('id', String(id));
        formData.set('date', date);
        formData.set('value', String(value));
        formData.set('note', note ?? '');
        const response = await fetch('?/recordMeasurement', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            await invalidateAll();
        }
    }
</script>

<a href={resolve('/')} class="text-sm text-blue-600 hover:underline"
    >&larr; Back</a
>
<div class="m-2 mt-2 p-2">
    <GoalTitle goal={data.goal} onUpdate={handleUpdate} />
</div>
<MilestoneList
    milestones={data.milestones}
    onDelete={handleMilestoneDelete}
    onUpdate={handleMilestoneUpdate}
/>
<HabitList
    habits={data.habits}
    onDelete={handleHabitDelete}
    onUpdate={handleHabitUpdate}
    onMarkDone={handleHabitMarkDone}
/>
<MeasurementList
    measurements={data.measurements}
    onDelete={handleMeasurementDelete}
    onUpdate={handleMeasurementUpdate}
    onRecord={handleMeasurementRecord}
/>

<div class="m-2 mt-8 flex justify-center">
    <DeleteButton onDelete={handleDelete} label="Delete goal" />
</div>
