import { nanoid } from 'nanoid';
export function createSkill(name, description, prompt, steps, tags = []) {
    return {
        id: nanoid(),
        name,
        description,
        prompt,
        steps,
        tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        successRate: 1.0
    };
}
