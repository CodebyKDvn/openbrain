import type { MemoryEngine } from "../engines/MemoryEngine.js";
import type { LearningEngine } from "../engines/LearningEngine.js";
import type { ReflectionEngine } from "../engines/ReflectionEngine.js";
export declare function createTools(memoryEngine: MemoryEngine, learningEngine: LearningEngine, reflectionEngine: ReflectionEngine): {
    search_memories: {
        description: string;
        args: {
            query: import("zod").ZodOptional<import("zod").ZodString>;
            type: import("zod").ZodOptional<import("zod").ZodString>;
            limit: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
        };
        execute(args: {
            limit: number;
            query?: string | undefined;
            type?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<import("@opencode-ai/plugin").ToolResult>;
    };
    list_skills: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<import("@opencode-ai/plugin").ToolResult>;
    };
    create_skill: {
        description: string;
        args: {
            name: import("zod").ZodString;
            description: import("zod").ZodString;
            prompt: import("zod").ZodString;
            steps: import("zod").ZodArray<import("zod").ZodString>;
            tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        };
        execute(args: {
            name: string;
            description: string;
            prompt: string;
            steps: string[];
            tags?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<import("@opencode-ai/plugin").ToolResult>;
    };
};
