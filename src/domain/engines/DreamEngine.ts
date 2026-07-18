import { MemoryEngine } from './MemoryEngine.js';
import { Memory, MemoryType } from '../../core/Memory.js';

export interface DreamEngine {
  start(intervalMs?: number): void;
  stop(): void;
}

export function createDreamEngine(memoryEngine: MemoryEngine): DreamEngine {
  let isRunning = false;
  let intervalId: any;
  let lastProcessed = 0;

  async function processMemories(): Promise<void> {
    try {
      await Promise.all([
        deduplicateMemories(),
        compressOldMemories(),
        promoteHighConfidenceMemories(),
        archiveOldMemories(),
      ]);
      lastProcessed = Date.now();
    } catch (err) {
      console.error('DreamEngine error:', err);
    }
  }

  async function deduplicateMemories(): Promise<void> {
    const allMemories = await memoryEngine.getMemories();
    const seen = new Map<string, Memory>();
    const duplicates: string[] = [];

    for (const memory of allMemories) {
      const key = `${memory.type}:${memory.content}`;
      if (seen.has(key)) {
        const existing = seen.get(key)!;
        if (memory.confidence > existing.confidence) {
          duplicates.push(existing.id);
          seen.set(key, memory);
        } else {
          duplicates.push(memory.id);
        }
      } else {
        seen.set(key, memory);
      }
    }

    for (const id of duplicates) {
      await memoryEngine.deleteMemory(id);
    }
  }

  async function compressOldMemories(): Promise<void> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const memories = await memoryEngine.getMemories();

    for (const memory of memories) {
      if (memory.createdAt < oneWeekAgo && !memory.content.startsWith('[Compressed]')) {
        const compressed = {
          ...memory,
          content: `[Compressed] ${memory.content.slice(0, 100)}...`,
          updatedAt: new Date(),
        };
        await memoryEngine.updateMemory(compressed as Memory);
      }
    }
  }

  async function promoteHighConfidenceMemories(): Promise<void> {
    const memories = await memoryEngine.getMemories();
    for (const memory of memories) {
      if (memory.confidence >= 0.95 && !memory.tags.includes('promoted')) {
        const promoted = {
          ...memory,
          tags: [...memory.tags, 'promoted'],
          confidence: 1.0,
          updatedAt: new Date(),
        };
        await memoryEngine.updateMemory(promoted as Memory);
      }
    }
  }

  async function archiveOldMemories(): Promise<void> {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const memories = await memoryEngine.getMemories();

    for (const memory of memories) {
      if (memory.createdAt < oneMonthAgo && !memory.tags.includes('archived')) {
        const archived = {
          ...memory,
          tags: [...memory.tags, 'archived'],
          updatedAt: new Date(),
        };
        await memoryEngine.updateMemory(archived as Memory);
      }
    }
  }

  return {
    start(intervalMs: number = 60000 * 5): void {
      if (isRunning) return;
      isRunning = true;
      intervalId = setInterval(() => processMemories(), intervalMs);
    },

    stop(): void {
      isRunning = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
  };
}
