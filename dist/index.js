import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { createSQLiteDatabase } from './data/database/SQLiteDatabase.js';
import { SQLiteMemoryStorage } from './data/storage/SQLiteMemoryStorage.js';
import { createMemoryEngine } from './domain/engines/MemoryEngine.js';
import { createReflectionEngine } from './domain/engines/ReflectionEngine.js';
import { createLearningEngine } from './domain/engines/LearningEngine.js';
import { createContextEngine } from './domain/engines/ContextEngine.js';
import { createDreamEngine } from './domain/engines/DreamEngine.js';
import { createTools } from './domain/services/PluginTools.js';
export const OpenBrainPlugin = async (ctx) => {
    const configDir = path.join(os.homedir(), '.opencode', 'openbrain');
    await fs.mkdir(configDir, { recursive: true });
    const dbPath = path.join(configDir, 'openbrain.db');
    const db = await createSQLiteDatabase(dbPath);
    const storage = new SQLiteMemoryStorage(db);
    const memoryEngine = createMemoryEngine(storage);
    const reflectionEngine = createReflectionEngine(memoryEngine);
    const learningEngine = createLearningEngine(memoryEngine);
    await learningEngine.initialize();
    const contextEngine = createContextEngine(memoryEngine, learningEngine);
    const dreamEngine = createDreamEngine(memoryEngine);
    dreamEngine.start();
    const tools = createTools(memoryEngine, learningEngine, reflectionEngine);
    return {
        tool: tools,
        'tool.execute.after': async (input, output) => {
            await memoryEngine.createEpisodicMemory(`Executed tool ${input.tool} with args: ${JSON.stringify(input.args)}`, { tool: input.tool, args: input.args, timestamp: new Date() }, ['tool-execution', input.tool], 0.9);
        },
        'experimental.chat.system.transform': async (input, output) => {
            if (output.system) {
                const additionalContext = await contextEngine.formatContextForSystemPrompt();
                output.system.push(additionalContext);
            }
        },
        event: async (event) => {
            if (event.event?.type === 'session.idle') {
                await reflectionEngine.reflect('Session ended', { sessionId: 'unknown' }, [], [], [], [], [], []);
            }
        },
    };
};
export default OpenBrainPlugin;
