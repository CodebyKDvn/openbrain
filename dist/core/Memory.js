import { nanoid } from 'nanoid';
export var MemoryType;
(function (MemoryType) {
    MemoryType["EPISODIC"] = "episodic";
    MemoryType["SEMANTIC"] = "semantic";
    MemoryType["PROCEDURAL"] = "procedural";
    MemoryType["DECISION"] = "decision";
    MemoryType["BUG"] = "bug";
    MemoryType["WORKSPACE"] = "workspace";
    MemoryType["PROJECT"] = "project";
    MemoryType["REFLECTION"] = "reflection";
    MemoryType["SKILL"] = "skill";
})(MemoryType || (MemoryType = {}));
export function createMemory(type, content, metadata, tags = [], confidence = 0.8) {
    const now = new Date();
    return {
        id: nanoid(),
        type,
        createdAt: now,
        updatedAt: now,
        content,
        tags,
        confidence,
        metadata
    };
}
