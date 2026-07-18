export class SQLiteMemoryStorage {
    constructor(db) {
        this.db = db;
    }
    async save(memory) {
        const stmt = this.db.db.prepare(`
      INSERT INTO memories (id, type, createdAt, updatedAt, content, tags, confidence, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(memory.id, memory.type, memory.createdAt.toISOString(), memory.updatedAt.toISOString(), memory.content, JSON.stringify(memory.tags), memory.confidence, JSON.stringify(memory.metadata));
    }
    async get(id) {
        const stmt = this.db.db.prepare('SELECT * FROM memories WHERE id = ?');
        const row = stmt.get(id);
        if (!row)
            return null;
        return this.rowToMemory(row);
    }
    async getAll(type) {
        let query = 'SELECT * FROM memories';
        const params = [];
        if (type) {
            query += ' WHERE type = ?';
            params.push(type);
        }
        query += ' ORDER BY createdAt DESC';
        const stmt = this.db.db.prepare(query);
        const rows = stmt.all(...params);
        return rows.map(row => this.rowToMemory(row));
    }
    async search(query, type, limit) {
        let sql = 'SELECT * FROM memories WHERE (content LIKE ? OR tags LIKE ?)';
        const params = [`%${query}%`, `%${query}%`];
        if (type) {
            sql += ' AND type = ?';
            params.push(type);
        }
        sql += ' ORDER BY createdAt DESC';
        if (limit) {
            sql += ' LIMIT ?';
            params.push(limit);
        }
        const stmt = this.db.db.prepare(sql);
        const rows = stmt.all(...params);
        return rows.map(row => this.rowToMemory(row));
    }
    async delete(id) {
        const stmt = this.db.db.prepare('DELETE FROM memories WHERE id = ?');
        stmt.run(id);
    }
    async update(memory) {
        const stmt = this.db.db.prepare(`
      UPDATE memories 
      SET updatedAt = ?, content = ?, tags = ?, confidence = ?, metadata = ?
      WHERE id = ?
    `);
        stmt.run(new Date().toISOString(), memory.content, JSON.stringify(memory.tags), memory.confidence, JSON.stringify(memory.metadata), memory.id);
    }
    async getByTags(tags, type) {
        let query = 'SELECT * FROM memories WHERE (';
        const params = [];
        const conditions = tags.map(() => 'tags LIKE ?');
        query += conditions.join(' OR ');
        query += ')';
        tags.forEach(tag => params.push(`%${tag}%`));
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        query += ' ORDER BY createdAt DESC';
        const stmt = this.db.db.prepare(query);
        const rows = stmt.all(...params);
        return rows.map(row => this.rowToMemory(row));
    }
    rowToMemory(row) {
        return {
            id: row.id,
            type: row.type,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            content: row.content,
            tags: JSON.parse(row.tags),
            confidence: row.confidence,
            metadata: JSON.parse(row.metadata)
        };
    }
}
