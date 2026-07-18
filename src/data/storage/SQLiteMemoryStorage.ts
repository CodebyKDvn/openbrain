import { Memory, MemoryType, createMemory } from '../../core/Memory.js';
import { MemoryStorage } from '../../core/MemoryStorage.js';
import { SQLiteDatabase } from '../database/SQLiteDatabase.js';

export class SQLiteMemoryStorage implements MemoryStorage {
  private db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async save(memory: Memory): Promise<void> {
    const stmt = this.db.db.prepare(`
      INSERT INTO memories (id, type, createdAt, updatedAt, content, tags, confidence, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      memory.id,
      memory.type,
      memory.createdAt.toISOString(),
      memory.updatedAt.toISOString(),
      memory.content,
      JSON.stringify(memory.tags),
      memory.confidence,
      JSON.stringify(memory.metadata)
    );
  }

  async get(id: string): Promise<Memory | null> {
    const stmt = this.db.db.prepare('SELECT * FROM memories WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return this.rowToMemory(row);
  }

  async getAll(type?: MemoryType): Promise<Memory[]> {
    let query = 'SELECT * FROM memories';
    const params: any[] = [];
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    query += ' ORDER BY createdAt DESC';
    const stmt = this.db.db.prepare(query);
    const rows = stmt.all(...params) as any[];
    return rows.map(row => this.rowToMemory(row));
  }

  async search(query: string, type?: MemoryType, limit?: number): Promise<Memory[]> {
    let sql = 'SELECT * FROM memories WHERE (content LIKE ? OR tags LIKE ?)';
    const params: any[] = [`%${query}%`, `%${query}%`];
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
    const rows = stmt.all(...params) as any[];
    return rows.map(row => this.rowToMemory(row));
  }

  async delete(id: string): Promise<void> {
    const stmt = this.db.db.prepare('DELETE FROM memories WHERE id = ?');
    stmt.run(id);
  }

  async update(memory: Memory): Promise<void> {
    const stmt = this.db.db.prepare(`
      UPDATE memories 
      SET updatedAt = ?, content = ?, tags = ?, confidence = ?, metadata = ?
      WHERE id = ?
    `);
    stmt.run(
      new Date().toISOString(),
      memory.content,
      JSON.stringify(memory.tags),
      memory.confidence,
      JSON.stringify(memory.metadata),
      memory.id
    );
  }

  async getByTags(tags: string[], type?: MemoryType): Promise<Memory[]> {
    let query = 'SELECT * FROM memories WHERE (';
    const params: any[] = [];
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
    const rows = stmt.all(...params) as any[];
    return rows.map(row => this.rowToMemory(row));
  }

  private rowToMemory(row: any): Memory {
    return {
      id: row.id,
      type: row.type as MemoryType,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      content: row.content,
      tags: JSON.parse(row.tags),
      confidence: row.confidence,
      metadata: JSON.parse(row.metadata)
    } as Memory;
  }
}
