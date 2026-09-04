<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import EditableItem from './EditableItem.svelte';

    const { Story } = defineMeta({
        component: EditableItem,
        title: 'EditableItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Default"
    args={{
        description: 'Stretch for 10 minutes each morning',
        onUpdateDescription: (description) =>
            console.log('update', description),
        onDelete: () => console.log('delete'),
    }}
/>

<Story
    name="WithChildren"
    args={{
        description: 'Stretch for 10 minutes each morning',
        onUpdateDescription: (description) =>
            console.log('update', description),
        onDelete: () => console.log('delete'),
    }}
>
    {#snippet template(args)}
        <EditableItem
            description={args.description}
            onUpdateDescription={args.onUpdateDescription}
            onDelete={args.onDelete}
        >
            <p class="px-2 py-1 text-gray-600">3 day streak</p>
            <p class="px-2 py-1 text-gray-600">
                Auxiliary detail shown beneath the description.
            </p>
        </EditableItem>
    {/snippet}
</Story>

<Story
    name="WithActions"
    args={{
        description: 'Stretch for 10 minutes each morning',
        onUpdateDescription: (description) =>
            console.log('update', description),
        onDelete: () => console.log('delete'),
    }}
>
    {#snippet template(args)}
        <EditableItem
            description={args.description}
            onUpdateDescription={args.onUpdateDescription}
            onDelete={args.onDelete}
        >
            {#snippet actions()}
                <button
                    type="button"
                    class="btn-link actions block px-2 py-1 text-sm"
                    onclick={() => console.log('mark done')}
                >
                    Mark done
                </button>
                <button
                    type="button"
                    class="btn-link actions block px-2 py-1 text-sm"
                    onclick={() => console.log('history')}
                >
                    History
                </button>
            {/snippet}
        </EditableItem>
    {/snippet}
</Story>
