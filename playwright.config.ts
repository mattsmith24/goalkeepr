import { defineConfig } from '@playwright/test';

const TEST_DB = 'test.db';

const withDb = (cmd: string) => `DATABASE_URL=${TEST_DB} ${cmd}`;

export default defineConfig({
    globalTeardown: './tests/global-teardown.ts',
    webServer: {
        command: [
            `rm -f ${TEST_DB}`,
            withDb('npm run db:push -- --force'),
            `SIGNUPS_ENABLED=1 ${withDb('npm run build')}`,
            `SIGNUPS_ENABLED=1 ${withDb('npm run preview')}`,
        ].join(' && '),
        port: 4173,
    },
    testMatch: '**/*.e2e.{ts,js}',
    workers: 1,
});
