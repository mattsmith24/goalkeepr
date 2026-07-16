<script lang="ts">
    import type { Goal } from '$lib/types';

    interface Props {
        goal: Goal;
    }

    const { goal }: Props = $props();
</script>

<li>{goal.description}</li>
