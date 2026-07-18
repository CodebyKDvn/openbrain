import { MemoryType, createMemory } from '../../core/Memory.js';
export function createMemoryEngine(storage) {
    return {
        async saveMemory(memory) {
            await storage.save(memory);
        },
        async getMemory(id) {
            return await storage.get(id);
        },
        async getMemories(type) {
            return await storage.getAll(type);
        },
        async searchMemories(query, type, limit = 20) {
            return await storage.search(query, type, limit);
        },
        async deleteMemory(id) {
            await storage.delete(id);
        },
        async updateMemory(memory) {
            await storage.update(memory);
        },
        async getMemoriesByTags(tags, type) {
            return await storage.getByTags(tags, type);
        },
        async createEpisodicMemory(content, metadata, tags, confidence) {
            const memory = createMemory(MemoryType.EPISODIC, content, metadata, tags, confidence);
            await storage.save(memory);
            return memory;
        },
        async createSemanticMemory(content, metadata, tags, confidence) {
            const memory = createMemory(MemoryType.SEMANTIC, content, metadata, tags, confidence);
            await storage.save(memory);
            return memory;
        },
        async createProceduralMemory(content, metadata, tags, confidence) {
            const memory = createMemory(MemoryType.PROCEDURAL, content, metadata, tags, confidence);
            await storage.save(memory);
            return memory;
        },
        async createDecisionMemory(content, metadata, tags, confidence) {
            const memory = createMemory(MemoryType.DECISION, content, metadata, tags, confidence);
            await storage.save(memory);
            return memory;
        },
        async createBugMemory(content, metadata, tags, confidence) {
            const memory = createMemory(MemoryType.BUG, content, metadata, tags, confidence);
            await storage.save(memory);
            return memory;
        },
        async createWorkspaceMemory(content, metadata, tags, confidence) {
            const memory = createMemory(MemoryType.WORKSPACE, content, metadata, tags, confidence);
            await storage.save(memory);
            return memory;
        },
        async createProjectMemory(content, metadata, tags, confidence) {
            const memory = createMemory(MemoryType.PROJECT, content, metadata, tags, confidence);
            await storage.save(memory);
            return memory;
        },
    };
}
