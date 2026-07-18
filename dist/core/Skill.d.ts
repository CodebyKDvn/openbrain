export interface Skill {
    id: string;
    name: string;
    description: string;
    prompt: string;
    steps: string[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    usageCount: number;
    successRate: number;
}
export declare function createSkill(name: string, description: string, prompt: string, steps: string[], tags?: string[]): Skill;
