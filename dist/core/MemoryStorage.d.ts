import { Memory, MemoryType } from './Memory.js';
export interface MemoryStorage {
    save(memory: Memory): Promise<void>;
    get(id: string): Promise<Memory | null>;
    getAll(type?: MemoryType): Promise<Memory[]>;
    search(query: string, type?: MemoryType, limit?: number): Promise<Memory[]>;
    delete(id: string): Promise<void>;
    update(memory: Memory): Promise<void>;
    getByTags(tags: string[], type?: MemoryType): Promise<Memory[]>;
}
