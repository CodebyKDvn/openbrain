import { MemoryEngine } from './MemoryEngine.js';
export interface DreamEngine {
    start(intervalMs?: number): void;
    stop(): void;
}
export declare function createDreamEngine(memoryEngine: MemoryEngine): DreamEngine;
