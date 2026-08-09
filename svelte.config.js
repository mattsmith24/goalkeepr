import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import adapter from '@sveltejs/adapter-node';

// svelte.config.js is evaluated before Vite loads .env, so read it ourselves.
function loadEnvVar(name) {
    if (process.env[name] !== undefined) return process.env[name];
    const envPath = join(process.cwd(), '.env');
    if (!existsSync(envPath)) return undefined;
    for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        if (key !== name) continue;
        let value = trimmed.slice(eq + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        return value;
    }
    return undefined;
}

const basePath = (loadEnvVar('BASE_PATH') ?? '').replace(/\/$/, '');

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
            filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
    },
    kit: {
        adapter: adapter(),
        paths: {
            base: basePath,
        },
        typescript: {
            config: (config) => ({
                ...config,
                include: [...config.include, '../drizzle.config.ts'],
            }),
        },
    },
};

export default config;
