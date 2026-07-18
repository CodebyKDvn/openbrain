import { Memory, MemoryType } from '../../core/Memory.js';
import { MemoryStorage } from '../../core/MemoryStorage.js';
import { SQLiteDatabase } from '../database/SQLiteDatabase.js';
export declare class SQLiteMemoryStorage implements MemoryStorage {
    private db;
    constructor(db: SQLiteDatabase);
    save(memory: Memory): Promise<void>;
    get(id: string): Promise<Memory | null>;
    getAll(type?: MemoryType): Promise<Memory[]>;
    search(query: string, type?: MemoryType, limit?: number): Promise<Memory[]>;
    delete(id: string): Promise<void>;
    update(memory: Memory): Promise<void>;
    getByTags(tags: string[], type?: MemoryType): Promise<Memory[]>;
    private rowToMemory;
}
