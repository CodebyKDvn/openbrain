import { Skill, createSkill } from '../../core/Skill.js';
import { MemoryEngine } from './MemoryEngine.js';
import { MemoryType } from '../../core/Memory.js';

export interface LearningEngine {
  initialize(): Promise<void>;
  createSkill(name: string, description: string, prompt: string, steps: string[], tags?: string[]): Promise<Skill>;
  getSkill(id: string): Skill | undefined;
  getAllSkills(): Skill[];
  updateSkillUsage(id: string, success: boolean): Promise<void>;
}

export function createLearningEngine(memoryEngine: MemoryEngine): LearningEngine {
  const skills: Map<string, Skill> = new Map();
  let initialized = false;

  async function loadSkills(): Promise<void> {
    const skillMemories = await memoryEngine.searchMemories('skill', MemoryType.SEMANTIC);
    for (const mem of skillMemories) {
      try {
        const skill = JSON.parse(mem.content) as Skill;
        if (skill.id) {
          skills.set(skill.id, skill);
        }
      } catch (e) {
        // Ignore invalid skill
      }
    }
  }

  return {
    async initialize(): Promise<void> {
      if (initialized) return;
      await loadSkills();
      initialized = true;
    },

    async createSkill(
      name: string,
      description: string,
      prompt: string,
      steps: string[],
      tags: string[] = []
    ): Promise<Skill> {
      const skill = createSkill(name, description, prompt, steps, tags);
      skills.set(skill.id, skill);

      await memoryEngine.createProceduralMemory(
        JSON.stringify(skill),
        { skillId: skill.id, steps: skill.steps },
        ['skill', ...tags],
        0.9
      );

      return skill;
    },

    getSkill(id: string): Skill | undefined {
      return skills.get(id);
    },

    getAllSkills(): Skill[] {
      return Array.from(skills.values());
    },

    async updateSkillUsage(id: string, success: boolean): Promise<void> {
      const skill = skills.get(id);
      if (!skill) return;

      skill.usageCount++;
      if (success) {
        skill.successRate = (skill.successRate * (skill.usageCount - 1) + 1) / skill.usageCount;
      } else {
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
