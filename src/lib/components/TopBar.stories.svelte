<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';

    import TopBar from './TopBar.svelte';

    const { Story } = defineMeta({
        component: TopBar,
        title: 'TopBar',
        tags: ['autodocs'],
    });
</script>

<Story name="Signed out" args={{ user: undefined }} />

<Story name="Signed in" args={{ user: { name: 'Alex Smith' } }} />