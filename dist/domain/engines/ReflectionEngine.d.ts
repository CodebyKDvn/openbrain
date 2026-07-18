import { Reflection } from '../../core/Reflection.js';
import { MemoryEngine } from './MemoryEngine.js';
export interface ReflectionEngine {
    reflect(content: string, metadata?: Record<string, any>, mistakes?: string[], lessons?: string[], patterns?: string[], antiPatterns?: string[], decisions?: string[], userPreferences?: string[], reusableWorkflows?: string[], sessionId?: string): Promise<Reflection>;
    getReflections(limit?: number): Promise<Reflection[]>;
}
export declare function createReflectionEngine(memoryEngine: MemoryEngine): ReflectionEngine;
