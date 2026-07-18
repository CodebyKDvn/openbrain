export function createDreamEngine(memoryEngine) {
    let isRunning = false;
    let intervalId;
    let lastProcessed = 0;
    async function processMemories() {
        try {
            await Promise.all([
                deduplicateMemories(),
                compressOldMemories(),
                promoteHighConfidenceMemories(),
                archiveOldMemories(),
            ]);
            lastProcessed = Date.now();
        }
        catch (err) {
            console.error('DreamEngine error:', err);
        }
    }
    async function deduplicateMemories() {
        const allMemories = await memoryEngine.getMemories();
        const seen = new Map();
        const duplicates = [];
        for (const memory of allMemories) {
            const key = `${memory.type}:${memory.content}`;
            if (seen.has(key)) {
                const existing = seen.get(key);
                if (memory.confidence > existing.confidence) {
                    duplicates.push(existing.id);
                    seen.set(key, memory);
                }
                else {
                    duplicates.push(memory.id);
                }
            }
            else {
                seen.set(key, memory);
            }
        }
        for (const id of duplicates) {
            await memoryEngine.deleteMemory(id);
        }
    }
    async function compressOldMemories() {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const memories = await memoryEngine.getMemories();
        for (const memory of memories) {
            if (memory.createdAt < oneWeekAgo && !memory.content.startsWith('[Compressed]')) {
                const compressed = {
                    ...memory,
                    content: `[Compressed] ${memory.content.slice(0, 100)}...`,
                    updatedAt: new Date(),
                };
                await memoryEngine.updateMemory(compressed);
            }
        }
    }
    async function promoteHighConfidenceMemories() {
        const memories = await memoryEngine.getMemories();
        for (const memory of memories) {
            if (memory.confidence >= 0.95 && !memory.tags.includes('promoted')) {
                const promoted = {
                    ...memory,
                    tags: [...memory.tags, 'promoted'],
                    confidence: 1.0,
                    updatedAt: new Date(),
                };
                await memoryEngine.updateMemory(promoted);
            }
        }
    }
    async function archiveOldMemories() {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const memories = await memoryEngine.getMemories();
        for (const memory of memories) {
            if (memory.createdAt < oneMonthAgo && !memory.tags.includes('archived')) {
                const archived = {
                    ...memory,
                    tags: [...memory.tags, 'archived'],
                    updatedAt: new Date(),
                };
                await memoryEngine.updateMemory(archived);
            }
        }
    }
    return {
        start(intervalMs = 60000 * 5) {
            if (isRunning)
                return;
            isRunning = true;
            intervalId = setInterval(() => processMemories(), intervalMs);
        },
        stop() {
            isRunning = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
        },
    };
}
