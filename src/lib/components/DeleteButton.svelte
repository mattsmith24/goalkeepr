<script lang="ts">
    interface Props {
        onDelete: () => void;
        label?: string;
    }

    const { onDelete, label = 'Delete' }: Props = $props();
</script>

<button
    type="button"
    class="px-2 py-1 text-sm text-red-600 hover:underline"
    onclick={onDelete}
>
    {label}
</button>
