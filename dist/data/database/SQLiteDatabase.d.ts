export declare function createSQLiteDatabase(dbPath: string): Promise<SQLiteDatabase>;
export declare class SQLiteDatabase {
    readonly db: any;
    constructor(db: any);
    initialize(): Promise<void>;
    close(): void;
}
