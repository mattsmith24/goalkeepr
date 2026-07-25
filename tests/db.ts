import Database from 'better-sqlite3';
import { TEST_DB } from './constants';

export function resetDb() {
    const db = new Database(TEST_DB);
    db.exec('DELETE FROM habits');
    db.exec('DELETE FROM milestones');
    db.exec('DELETE FROM goals');
    db.close();
}
