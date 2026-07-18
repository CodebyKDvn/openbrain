import { createReflection } from '../../core/Reflection.js';
import { MemoryType } from '../../core/Memory.js';
export function createReflectionEngine(memoryEngine) {
    return {
        async reflect(content, metadata = {}, mistakes = [], lessons = [], patterns = [], antiPatterns = [], decisions = [], userPreferences = [], reusableWorkflows = [], sessionId) {
            const reflection = createReflection(content, metadata, mistakes, lessons, patterns, antiPatterns, decisions, userPreferences, reusableWorkflows, sessionId);
            await memoryEngine.createSemanticMemory(JSON.stringify(reflection), {
                concept: 'reflection',
                source: 'ReflectionEngine'
            }, ['reflection', ...(sessionId ? [sessionId] : [])], 0.9);
            if (mistakes.length > 0) {
                await memoryEngine.createSemanticMemory(JSON.stringify(mistakes.join('\n')), { concept: 'mistake', source: 'ReflectionEngine' }, ['mistake'], 0.9);
            }
            if (lessons.length > 0) {
                await memoryEngine.createSemanticMemory(JSON.stringify(lessons.join('\n')), { concept: 'lesson', source: 'ReflectionEngine' }, ['lesson'], 0.9);
            }
            if (decisions.length > 0) {
                for (const decision of decisions) {
                    await memoryEngine.createDecisionMemory(decision, { context: 'reflection', outcome: 'recorded', reasoning: 'reflection' }, ['decision'], 0.9);
                }
            }
            if (userPreferences.length > 0) {
                await memoryEngine.createSemanticMemory(JSON.stringify(userPreferences.join('\n')), { concept: 'user-preference', source: 'ReflectionEngine' }, ['user-preference'], 0.9);
            }
            return reflection;
        },
        async getReflections(limit = 20) {
            const reflectionMemories = await memoryEngine.searchMemories('reflection', MemoryType.SEMANTIC, limit);
            return reflectionMemories.map(mem => {
                try {
                    const parsed = JSON.parse(mem.content);
                    if (typeof parsed === 'object' && 'id' in parsed) {
                        return parsed;
                    }
                    return createReflection(mem.content, mem.metadata);
                }
                catch (e) {
                    return createReflection(mem.content, mem.metadata);
                }
            });
        },
    };
}
