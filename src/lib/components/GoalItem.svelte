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
        class={goal.doneDate
            ? 'block rounded-xl border border-gray-300 bg-gray-50 p-5 shadow-sm transition-shadow hover:shadow-md'
            : 'block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md'}
    >
        <span
            class={goal.doneDate
                ? 'block text-3xl text-gray-500 line-through'
                : 'block text-3xl'}
        >
            {goal.title}
        </span>
        {#if goal.description}
            <p
                class={goal.doneDate
                    ? 'mt-2 whitespace-pre-wrap text-gray-400 italic'
                    : 'mt-2 whitespace-pre-wrap text-gray-700 italic'}
            >
                {goal.description}
            </p>
        {/if}
    </a>
</li>
