<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';

    let { form }: { form: ActionData } = $props();
</script>

<h1>Sign up</h1>

{#if form?.message}
    <p class="m-2 rounded bg-red-100 p-2 text-red-800">{form.message}</p>
{/if}

<form method="post" use:enhance class="m-2 flex flex-col gap-2">
    <label class="flex flex-col gap-1">
        Name
        <input name="name" type="text" required autocomplete="name" class="rounded border p-1" />
    </label>
    <label class="flex flex-col gap-1">
        Email
        <input name="email" type="email" required autocomplete="email" class="rounded border p-1" />
    </label>
    <label class="flex flex-col gap-1">
        Password
        <input
            name="password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            class="rounded border p-1"
        />
    </label>
    <button
        type="submit"
        class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
    >
        Sign up
    </button>
</form>

<p class="m-2">Already have an account? <a href="/sign-in" class="underline">Sign in</a></p>