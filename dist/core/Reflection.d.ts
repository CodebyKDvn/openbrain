export interface Reflection {
    id: string;
    sessionId?: string;
    createdAt: Date;
    content: string;
    mistakes: string[];
    lessons: string[];
    patterns: string[];
    antiPatterns: string[];
    decisions: string[];
    userPreferences: string[];
    reusableWorkflows: string[];
    metadata: Record<string, any>;
}
export declare function createReflection(content: string, metadata?: Record<string, any>, mistakes?: string[], lessons?: string[], patterns?: string[], antiPatterns?: string[], decisions?: string[], userPreferences?: string[], reusableWorkflows?: string[], sessionId?: string): Reflection;
