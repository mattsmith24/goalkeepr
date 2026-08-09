<script lang="ts">
    import { enhance } from '$app/forms';
    import { resolve } from '$app/paths';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1>Sign in</h1>

{#if form?.message}
    <p class="m-2 rounded bg-red-100 p-2 text-red-800">{form.message}</p>
{/if}

<form method="post" use:enhance class="m-2 flex flex-col gap-2">
    <label class="flex flex-col gap-1">
        Email
        <input
            name="email"
            type="email"
            required
            autocomplete="email"
            class="rounded border p-1"
        />
    </label>
    <label class="flex flex-col gap-1">
        Password
        <input
            name="password"
            type="password"
            required
            autocomplete="current-password"
            class="rounded border p-1"
        />
    </label>
    <button
        type="submit"
        class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
    >
        Sign in
    </button>
</form>

{#if data.signupsEnabled}
    <p class="m-2">
        No account yet? <a href={resolve('/sign-up')} class="underline">Sign up</a>
    </p>
{/if}
