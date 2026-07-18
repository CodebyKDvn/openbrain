declare module 'bun:sqlite' {
  export class Database {
    constructor(path: string, options?: { readonly?: boolean; create?: boolean; strict?: boolean });
    run(sql: string, ...params: any[]): void;
    query(sql: string): Statement;
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
    serialize(): Uint8Array;
    static deserialize(data: Uint8Array): Database;
  }

  export interface Statement {
    run(...params: any[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: any[]): any;
    all(...params: any[]): any[];
    finalize(): void;
  }
}
