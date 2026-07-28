<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { expect, within } from 'storybook/test';

    import TopBar from './TopBar.svelte';

    const { Story } = defineMeta({
        component: TopBar,
        title: 'TopBar',
        tags: ['autodocs'],
    });
</script>

<Story
    name="Signed out"
    args={{ user: undefined }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const link = canvas.getByRole('link', { name: /goalkeepr/i });
        await expect(link).toHaveAttribute('href', '/');

        await expect(
            canvas.getByRole('link', { name: /^sign in$/i }),
        ).toHaveAttribute('href', '/sign-in');
        await expect(
            canvas.getByRole('link', { name: /^sign up$/i }),
        ).toHaveAttribute('href', '/sign-up');

        await expect(canvas.queryByText(/alex smith/i)).not.toBeInTheDocument();
        await expect(
            canvas.queryByRole('button', { name: /sign out/i }),
        ).not.toBeInTheDocument();
    }}
/>

<Story
    name="Signed in"
    args={{ user: { name: 'Alex Smith' } }}
    play={async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.getByText('Alex Smith')).toBeInTheDocument();

        await expect(
            canvas.queryByRole('link', { name: /^sign in$/i }),
        ).not.toBeInTheDocument();
        await expect(
            canvas.queryByRole('link', { name: /^sign up$/i }),
        ).not.toBeInTheDocument();

        const form = canvasElement.querySelector('form');
        await expect(form).not.toBeNull();
        await expect(form).toHaveAttribute('method', 'post');
        await expect(form).toHaveAttribute('action', '/sign-out');

        const button = canvas.getByRole('button', { name: /sign out/i });
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveAttribute('type', 'submit');
    }}
/>
