<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import TopBar from '$lib/components/TopBar.svelte';

    let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<TopBar user={data.user} />
{@render children()}