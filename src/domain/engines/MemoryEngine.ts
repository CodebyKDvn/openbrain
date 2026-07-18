import { Memory, MemoryType, createMemory } from '../../core/Memory.js';
import { MemoryStorage } from '../../core/MemoryStorage.js';

export interface MemoryEngine {
  saveMemory(memory: Memory): Promise<void>;
  getMemory(id: string): Promise<Memory | null>;
  getMemories(type?: MemoryType): Promise<Memory[]>;
  searchMemories(query: string, type?: MemoryType, limit?: number): Promise<Memory[]>;
  deleteMemory(id: string): Promise<void>;
  updateMemory(memory: Memory): Promise<void>;
  getMemoriesByTags(tags: string[], type?: MemoryType): Promise<Memory[]>;
  createEpisodicMemory(content: string, metadata: any, tags: string[], confidence: number): Promise<any>;
  createSemanticMemory(content: string, metadata: any, tags: string[], confidence: number): Promise<any>;
  createProceduralMemory(content: string, metadata: any, tags: string[], confidence: number): Promise<any>;
  createDecisionMemory(content: string, metadata: any, tags: string[], confidence: number): Promise<any>;
  createBugMemory(content: string, metadata: any, tags: string[], confidence: number): Promise<any>;
  createWorkspaceMemory(content: string, metadata: any, tags: string[], confidence: number): Promise<any>;
  createProjectMemory(content: string, metadata: any, tags: string[], confidence: number): Promise<any>;
}

export function createMemoryEngine(storage: MemoryStorage): MemoryEngine {
  return {
    async saveMemory(memory: Memory): Promise<void> {
      await storage.save(memory);
    },

    async getMemory(id: string): Promise<Memory | null> {
      return await storage.get(id);
    },

    async getMemories(type?: MemoryType): Promise<Memory[]> {
      return await storage.getAll(type);
    },

    async searchMemories(query: string, type?: MemoryType, limit = 20): Promise<Memory[]> {
      return await storage.search(query, type, limit);
    },

    async deleteMemory(id: string): Promise<void> {
      await storage.delete(id);
    },

    async updateMemory(memory: Memory): Promise<void> {
      await storage.update(memory);
    },

    async getMemoriesByTags(tags: string[], type?: MemoryType): Promise<Memory[]> {
      return await storage.getByTags(tags, type);
    },

    async createEpisodicMemory(content: string, metadata: any, tags: string[], confidence: number) {
      const memory = createMemory(MemoryType.EPISODIC, content, metadata, tags, confidence);
      await storage.save(memory as any);
      return memory;
    },

    async createSemanticMemory(content: string, metadata: any, tags: string[], confidence: number) {
      const memory = createMemory(MemoryType.SEMANTIC, content, metadata, tags, confidence);
      await storage.save(memory as any);
      return memory;
    },

    async createProceduralMemory(content: string, metadata: any, tags: string[], confidence: number) {
      const memory = createMemory(MemoryType.PROCEDURAL, content, metadata, tags, confidence);
      await storage.save(memory as any);
      return memory;
    },

    async createDecisionMemory(content: string, metadata: any, tags: string[], confidence: number) {
      const memory = createMemory(MemoryType.DECISION, content, metadata, tags, confidence);
      await storage.save(memory as any);
      return memory;
    },

    async createBugMemory(content: string, metadata: any, tags: string[], confidence: number) {
      const memory = createMemory(MemoryType.BUG, content, metadata, tags, confidence);
      await storage.save(memory as any);
      return memory;
    },

    async createWorkspaceMemory(content: string, metadata: any, tags: string[], confidence: number) {
      const memory = createMemory(MemoryType.WORKSPACE, content, metadata, tags, confidence);
      await storage.save(memory as any);
      return memory;
    },

    async createProjectMemory(content: string, metadata: any, tags: string[], confidence: number) {
      const memory = createMemory(MemoryType.PROJECT, content, metadata, tags, confidence);
      await storage.save(memory as any);
      return memory;
    },
  };
}
