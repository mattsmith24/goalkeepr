<script lang="ts">
    import { resolve } from '$app/paths';

    interface Props {
        user?: { name?: string } | undefined;
        signupsEnabled: boolean;
    }

    let { user, signupsEnabled }: Props = $props();
</script>

<header
    class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3"
>
    <a href={resolve('/')} class="text-lg font-semibold">goalkeepr</a>
    <nav class="flex items-center gap-3">
        {#if user}
            <span class="text-sm text-gray-600">{user.name}</span>
            <form method="post" action="/sign-out">
                <button
                    type="submit"
                    class="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
                >
                    Sign out
                </button>
            </form>
        {:else}
            <a href={resolve('/sign-in')} class="text-sm underline">Sign in</a>
            {#if signupsEnabled}
                <a
                    href={resolve('/sign-up')}
                    class="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
                >
                    Sign up
                </a>
            {/if}
        {/if}
    </nav>
</header>
