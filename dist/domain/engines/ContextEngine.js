import { MemoryType } from '../../core/Memory.js';
export function createContextEngine(memoryEngine, learningEngine) {
    return {
        async getContext(query = '', limit = 30) {
            const recentMemories = await memoryEngine.getMemories();
            const relevantMemories = query ? await memoryEngine.searchMemories(query) : recentMemories.slice(0, limit);
            const skills = learningEngine.getAllSkills();
            const userPreferences = await memoryEngine.getMemoriesByTags(['user-preference'], MemoryType.SEMANTIC);
            return {
                recentMemories: recentMemories.slice(0, limit),
                relevantMemories: relevantMemories.slice(0, limit),
                skills: skills.slice(0, 10),
                userPreferences
            };
        },
        async formatContextForSystemPrompt(query) {
            const ctx = await this.getContext(query);
            let prompt = '\n## OpenBrain Context\n\n';
            if (ctx.relevantMemories.length > 0) {
                prompt += '### Relevant Memories:\n';
                ctx.relevantMemories.forEach(mem => {
                    prompt += `- [${mem.type}] ${mem.content}\n`;
                });
            }
            if (ctx.skills.length > 0) {
                prompt += '\n### Available Skills:\n';
                ctx.skills.forEach(skill => {
                    prompt += `- ${skill.name}: ${skill.description}\n`;
                });
            }
            if (ctx.userPreferences.length > 0) {
                prompt += '\n### User Preferences:\n';
                ctx.userPreferences.forEach(pref => {
                    prompt += `- ${pref.content}\n`;
                });
            }
            return prompt;
        }
    };
}
