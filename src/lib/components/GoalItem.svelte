<script lang="ts">
    import { resolve } from '$app/paths';
    import type { Goal } from '$lib/types';

    interface Props {
        goal: Goal;
    }

    const { goal }: Props = $props();
</script>

<li>
    <a
        href={resolve('/goals/[id]', { id: String(goal.id) })}
        class="px-2 py-1 hover:underline">{goal.description}</a
    >
</li>