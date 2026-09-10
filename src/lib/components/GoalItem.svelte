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
        class="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
        <span class="text-3xl">{goal.title}</span>
    </a>
</li>
