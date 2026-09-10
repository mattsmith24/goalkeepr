<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import GoalItem from './GoalItem.svelte';

    const { Story } = defineMeta({
        component: GoalItem,
        title: 'GoalItem',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Title only"
    args={{
        goal: {
            id: 1,
            title: 'I want to win an Olympic gold medal for break dancing',
            description: null,
        },
    }}
/>

<Story
    name="With description"
    args={{
        goal: {
            id: 2,
            title: 'Run a marathon',
            description:
                'I want to feel stronger and more resilient so I can show up for my family with more energy.',
        },
    }}
/>
