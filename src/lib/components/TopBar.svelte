<script lang="ts">
    interface Props {
        user?: { name?: string } | undefined;
    }

    let { user }: Props = $props();
</script>

<header
    class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3"
>
    <a href="/" class="text-lg font-semibold">goalkeepr</a>
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
            <a href="/sign-in" class="text-sm underline">Sign in</a>
            <a
                href="/sign-up"
                class="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
            >
                Sign up
            </a>
        {/if}
    </nav>
</header>