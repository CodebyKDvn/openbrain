import { createSkill } from '../../core/Skill.js';
import { MemoryType } from '../../core/Memory.js';
export function createLearningEngine(memoryEngine) {
    const skills = new Map();
    let initialized = false;
    async function loadSkills() {
        const skillMemories = await memoryEngine.searchMemories('skill', MemoryType.SEMANTIC);
        for (const mem of skillMemories) {
            try {
                const skill = JSON.parse(mem.content);
                if (skill.id) {
                    skills.set(skill.id, skill);
                }
            }
            catch (e) {
                // Ignore invalid skill
            }
        }
    }
    return {
        async initialize() {
            if (initialized)
                return;
            await loadSkills();
            initialized = true;
        },
        async createSkill(name, description, prompt, steps, tags = []) {
            const skill = createSkill(name, description, prompt, steps, tags);
            skills.set(skill.id, skill);
            await memoryEngine.createProceduralMemory(JSON.stringify(skill), { skillId: skill.id, steps: skill.steps }, ['skill', ...tags], 0.9);
            return skill;
        },
        getSkill(id) {
            return skills.get(id);
        },
        getAllSkills() {
            return Array.from(skills.values());
        },
        async updateSkillUsage(id, success) {
            const skill = skills.get(id);
            if (!skill)
                return;
            skill.usageCount++;
            if (success) {
                skill.successRate = (skill.successRate * (skill.usageCount - 1) + 1) / skill.usageCount;
            }
            else {
                skill.successRate = (skill.successRate * (skill.usageCount - 1)) / skill.usageCount;
            }
            skill.updatedAt = new Date();
            const proceduralMemories = await memoryEngine.searchMemories(skill.id, MemoryType.PROCEDURAL);
            if (proceduralMemories.length > 0) {
                proceduralMemories[0].content = JSON.stringify(skill);
                proceduralMemories[0].updatedAt = new Date();
                await memoryEngine.updateMemory(proceduralMemories[0]);
            }
        },
    };
}
