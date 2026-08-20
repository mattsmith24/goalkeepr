<script lang="ts">
    import { resolve } from '$app/paths';
    import { invalidateAll } from '$app/navigation';

    let open = $state(false);
    let fileInput: HTMLInputElement | undefined = $state();
    let error: string | null = $state(null);
    let submitting = $state(false);

    function openForm() {
        open = true;
        error = null;
    }

    function close() {
        open = false;
        error = null;
        if (fileInput) fileInput.value = '';
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open) {
            event.preventDefault();
            close();
        }
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        if (!fileInput?.files?.[0]) {
            error = 'Please choose a file to import.';
            return;
        }

        submitting = true;
        error = null;

        try {
            const text = await fileInput.files[0].text();
            const data = JSON.parse(text);

            const response = await fetch(resolve('/api/import'), {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const body = (await response.json().catch(() => ({}))) as {
                    error?: string;
                };
                error = body.error ?? `Import failed (${response.status})`;
                return;
            }

            close();
            await invalidateAll();
        } catch (err) {
            error = err instanceof SyntaxError ? 'File is not valid JSON.' : 'Import failed.';
        } finally {
            submitting = false;
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
    <form onsubmit={handleSubmit} class="flex items-center gap-2">
        <label for="import-file" class="sr-only">Import file</label>
        <input
            bind:this={fileInput}
            id="import-file"
            type="file"
            accept="application/json,.json"
            class="input"
        />
        <button type="submit" class="btn-link" disabled={submitting}>
            {submitting ? 'Importing…' : 'Import'}
        </button>
        <button type="button" class="btn-cancel" onclick={close} disabled={submitting}>
            Cancel
        </button>
        {#if error}
            <span class="text-sm text-red-600">{error}</span>
        {/if}
    </form>
{:else}
    <button type="button" class="btn-link" onclick={openForm}>
        Import Data
    </button>
{/if}
