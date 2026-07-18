import { ChromaClient } from 'chromadb';
export class ChromaMemoryStorage {
    baseStorage;
    collectionName;
    chroma;
    collection;
    initialized = false;
    constructor(baseStorage, collectionName = 'openbrain_memories') {
        this.baseStorage = baseStorage;
        this.collectionName = collectionName;
        this.chroma = new ChromaClient();
    }
    async ensureInitialized() {
        if (this.initialized)
            return;
        try {
            this.collection = await this.chroma.getCollection({ name: this.collectionName });
        }
        catch {
            this.collection = await this.chroma.createCollection({
                name: this.collectionName,
                metadata: { description: 'OpenBrain memory storage' },
            });
        }
        this.initialized = true;
    }
    async save(memory) {
        await this.baseStorage.save(memory);
        await this.ensureInitialized();
        await this.collection.add({
            ids: [memory.id],
            documents: [memory.content],
            metadatas: [{
                    type: memory.type,
                    createdAt: memory.createdAt.toISOString(),
                    tags: JSON.stringify(memory.tags),
                    confidence: memory.confidence,
                }],
        });
    }
    async get(id) {
        return this.baseStorage.get(id);
    }
    async getAll(type) {
        return this.baseStorage.getAll(type);
    }
    async search(query, type, limit = 10) {
        try {
            await this.ensureInitialized();
            const results = await this.collection.query({
                queryTexts: [query],
                nResults: limit,
                where: type ? { type } : undefined,
            });
            const ids = results.ids[0] || [];
            const memories = [];
            for (const id of ids) {
                const mem = await this.baseStorage.get(id);
                if (mem)
                    memories.push(mem);
            }
            return memories;
        }
        catch (err) {
            // Fallback to base storage search if chroma fails
            return this.baseStorage.search(query, type, limit);
        }
    }
    async delete(id) {
        await this.baseStorage.delete(id);
        try {
            await this.ensureInitialized();
            await this.collection.delete({ ids: [id] });
        }
        catch {
            // Ignore chroma errors
        }
    }
    async update(memory) {
        await this.baseStorage.update(memory);
        try {
            await this.ensureInitialized();
            await this.collection.update({
                ids: [memory.id],
                documents: [memory.content],
                metadatas: [{
                        type: memory.type,
                        createdAt: memory.createdAt.toISOString(),
                        updatedAt: memory.updatedAt.toISOString(),
                        tags: JSON.stringify(memory.tags),
                        confidence: memory.confidence,
                    }],
            });
        }
        catch {
            // Ignore chroma errors
        }
    }
    async getByTags(tags, type) {
        return this.baseStorage.getByTags(tags, type);
    }
}
