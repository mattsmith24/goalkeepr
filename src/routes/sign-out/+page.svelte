<script lang="ts">
    import { enhance } from '$app/forms';
</script>

<h1>Sign out</h1>

<form method="post" use:enhance class="m-2">
    <button
        type="submit"
        class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
    >
        Sign out
    </button>
</form>
