import { existsSync, unlinkSync } from 'node:fs';
import { TEST_DB } from './constants';

export default async function globalTeardown() {
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
}
