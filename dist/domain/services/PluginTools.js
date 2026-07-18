import { tool } from "@opencode-ai/plugin";
export function createTools(memoryEngine, learningEngine, reflectionEngine) {
    return {
        search_memories: tool({
            description: "Search memories by query, type, or tags",
            args: {
                query: tool.schema.string().optional(),
                type: tool.schema.string().optional(),
                limit: tool.schema.number().optional().default(10),
            },
            async execute(args) {
                const type = args.type ? args.type : undefined;
                const memories = args.query
                    ? await memoryEngine.searchMemories(args.query, type, args.limit)
                    : await memoryEngine.getMemories(type);
                return JSON.stringify(memories, null, 2);
            },
        }),
        list_skills: tool({
            description: "List all learned skills",
            args: {},
            async execute() {
                const skills = learningEngine.getAllSkills();
                return JSON.stringify(skills, null, 2);
            },
        }),
        create_skill: tool({
            description: "Create a new reusable skill",
            args: {
                name: tool.schema.string().describe("Name of the skill"),
                description: tool.schema.string().describe("Description of the skill"),
                prompt: tool.schema.string().describe("Prompt for the skill"),
                steps: tool.schema.array(tool.schema.string()).describe("Steps for the skill"),
                tags: tool.schema.array(tool.schema.string()).optional(),
            },
            async execute(args) {
                const skill = await learningEngine.createSkill(args.name, args.description, args.prompt, args.steps, args.tags);
                return `Skill created: ${JSON.stringify(skill, null, 2)}`;
            },
        }),
    };
}
