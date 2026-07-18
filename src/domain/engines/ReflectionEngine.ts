import { Reflection, createReflection } from '../../core/Reflection.js';
import { MemoryEngine } from './MemoryEngine.js';
import { MemoryType } from '../../core/Memory.js';

export interface ReflectionEngine {
  reflect(
    content: string,
    metadata?: Record<string, any>,
    mistakes?: string[],
    lessons?: string[],
    patterns?: string[],
    antiPatterns?: string[],
    decisions?: string[],
    userPreferences?: string[],
    reusableWorkflows?: string[],
    sessionId?: string
  ): Promise<Reflection>;
  getReflections(limit?: number): Promise<Reflection[]>;
}

export function createReflectionEngine(memoryEngine: MemoryEngine): ReflectionEngine {
  return {
    async reflect(
      content: string,
      metadata: Record<string, any> = {},
      mistakes: string[] = [],
      lessons: string[] = [],
      patterns: string[] = [],
      antiPatterns: string[] = [],
      decisions: string[] = [],
      userPreferences: string[] = [],
      reusableWorkflows: string[] = [],
      sessionId?: string
    ): Promise<Reflection> {
      const reflection = createReflection(
        content,
        metadata,
        mistakes,
        lessons,
        patterns,
        antiPatterns,
        decisions,
        userPreferences,
        reusableWorkflows,
        sessionId
      );

      await memoryEngine.createSemanticMemory(
        JSON.stringify(reflection),
        {
          concept: 'reflection',
          source: 'ReflectionEngine'
        },
        ['reflection', ...(sessionId ? [sessionId] : [])],
        0.9
      );

      if (mistakes.length > 0) {
        await memoryEngine.createSemanticMemory(
          JSON.stringify(mistakes.join('\n')),
          { concept: 'mistake', source: 'ReflectionEngine' },
          ['mistake'],
          0.9
        );
      }

      if (lessons.length > 0) {
        await memoryEngine.createSemanticMemory(
          JSON.stringify(lessons.join('\n')),
          { concept: 'lesson', source: 'ReflectionEngine' },
          ['lesson'],
          0.9
        );
      }

      if (decisions.length > 0) {
        for (const decision of decisions) {
          await memoryEngine.createDecisionMemory(
            decision,
            { context: 'reflection', outcome: 'recorded', reasoning: 'reflection' },
            ['decision'],
            0.9
          );
        }
      }

      if (userPreferences.length > 0) {
        await memoryEngine.createSemanticMemory(
          JSON.stringify(userPreferences.join('\n')),
          { concept: 'user-preference', source: 'ReflectionEngine' },
          ['user-preference'],
          0.9
        );
      }

      return reflection;
    },

    async getReflections(limit = 20): Promise<Reflection[]> {
      const reflectionMemories = await memoryEngine.searchMemories('reflection', MemoryType.SEMANTIC, limit);
      return reflectionMemories.map(mem => {
        try {
          const parsed = JSON.parse(mem.content);
          if (typeof parsed === 'object' && 'id' in parsed) {
            return parsed as Reflection;
          }
          return createReflection(mem.content, mem.metadata);
        } catch (e) {
          return createReflection(mem.content, mem.metadata);
        }
      });
    },
  };
}
