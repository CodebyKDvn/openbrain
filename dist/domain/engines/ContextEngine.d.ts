import { MemoryEngine } from './MemoryEngine.js';
import { LearningEngine } from './LearningEngine.js';
export interface ContextEngine {
    getContext(query?: string, limit?: number): Promise<{
        recentMemories: any[];
        relevantMemories: any[];
        skills: any[];
        userPreferences: any[];
    }>;
    formatContextForSystemPrompt(query?: string): Promise<string>;
}
export declare function createContextEngine(memoryEngine: MemoryEngine, learningEngine: LearningEngine): ContextEngine;
