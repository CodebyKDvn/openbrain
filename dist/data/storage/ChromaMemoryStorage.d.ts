import { Memory, MemoryType } from '../../core/Memory';
import { MemoryStorage } from '../../core/MemoryStorage';
export declare class ChromaMemoryStorage implements MemoryStorage {
    private baseStorage;
    private collectionName;
    private chroma;
    private collection?;
    private initialized;
    constructor(baseStorage: MemoryStorage, collectionName?: string);
    private ensureInitialized;
    save(memory: Memory): Promise<void>;
    get(id: string): Promise<Memory | null>;
    getAll(type?: MemoryType): Promise<Memory[]>;
    search(query: string, type?: MemoryType, limit?: number): Promise<Memory[]>;
    delete(id: string): Promise<void>;
    update(memory: Memory): Promise<void>;
    getByTags(tags: string[], type?: MemoryType): Promise<Memory[]>;
}
