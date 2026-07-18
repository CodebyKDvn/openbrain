import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createSQLiteDatabase } from '../data/database/SQLiteDatabase.js';
import { SQLiteMemoryStorage } from '../data/storage/SQLiteMemoryStorage.js';
import { createMemoryEngine } from '../domain/engines/MemoryEngine.js';
import { MemoryType } from '../core/Memory.js';
import path from 'path';
import os from 'os';
describe('MemoryEngine', () => {
    let db;
    let storage;
    let engine;
    const dbPath = path.join(os.tmpdir(), `test-openbrain-${Date.now()}.db`);
    beforeAll(async () => {
        db = await createSQLiteDatabase(dbPath);
        storage = new SQLiteMemoryStorage(db);
        engine = createMemoryEngine(storage);
    });
    afterAll(() => {
        db.close();
    });
    it('should save and retrieve a memory', async () => {
        const mem = await engine.createEpisodicMemory('Test memory', { timestamp: new Date() }, ['test'], 0.9);
        const retrieved = await engine.getMemory(mem.id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.content).toBe('Test memory');
    });
    it('should retrieve all memories of a type', async () => {
        await engine.createSemanticMemory('Test semantic memory', { concept: 'test' }, ['semantic'], 0.9);
        const memories = await engine.getMemories(MemoryType.SEMANTIC);
        expect(memories.length).toBeGreaterThan(0);
    });
});
