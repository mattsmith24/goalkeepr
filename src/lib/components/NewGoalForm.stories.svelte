<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import NewGoalForm from './NewGoalForm.svelte';

    const { Story } = defineMeta({
        component: NewGoalForm,
        title: 'NewGoalForm',
        tags: ['autodocs'],
    });
</script>

<Story name="Default" />
