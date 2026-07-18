import { Memory, MemoryType } from '../../core/Memory.js';
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
export declare function createMemoryEngine(storage: MemoryStorage): MemoryEngine;
