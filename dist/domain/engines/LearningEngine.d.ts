import { Skill } from '../../core/Skill.js';
import { MemoryEngine } from './MemoryEngine.js';
export interface LearningEngine {
    initialize(): Promise<void>;
    createSkill(name: string, description: string, prompt: string, steps: string[], tags?: string[]): Promise<Skill>;
    getSkill(id: string): Skill | undefined;
    getAllSkills(): Skill[];
    updateSkillUsage(id: string, success: boolean): Promise<void>;
}
export declare function createLearningEngine(memoryEngine: MemoryEngine): LearningEngine;
