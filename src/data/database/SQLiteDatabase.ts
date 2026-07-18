let Database: any;

async function loadDatabase() {
  if (Database) return;
  try {
    const mod = await import('bun:sqlite');
    Database = mod.Database;
  } catch {
    const mod = await import('better-sqlite3');
    Database = mod.default || mod;
  }
}

export async function createSQLiteDatabase(dbPath: string): Promise<SQLiteDatabase> {
  await loadDatabase();
  const db = new Database(dbPath);
  const instance = new SQLiteDatabase(db);
  await instance.initialize();
  return instance;
}

export class SQLiteDatabase {
  readonly db: any;

  constructor(db: any) {
    this.db = db;
  }

  async initialize() {
    this.db.exec('PRAGMA journal_mode = WAL');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT NOT NULL,
        confidence REAL NOT NULL,
        metadata TEXT NOT NULL
      )
    `);
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_memories_type ON memories (type)');
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_memories_createdAt ON memories (createdAt)');
  }

  close() {
    this.db.close();
  }
}
