import { nanoid } from 'nanoid';

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

export function createSkill(
  name: string,
  description: string,
  prompt: string,
  steps: string[],
  tags: string[] = []
): Skill {
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
