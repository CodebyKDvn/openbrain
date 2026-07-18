# Changelog

All notable changes to OpenBrain will be documented in this file.

## [0.1.0] - 2026-07-18

### Added

- Initial plugin structure with TypeScript compilation
- 9 typed memory systems (Episodic, Semantic, Procedural, Decision, Bug, Workspace, Project, Reflection, Skill)
- Memory engine with CRUD operations and typed factory methods
- SQLite storage layer with bun:sqlite and better-sqlite3 dual runtime support
- Reflection engine for post-session analysis
- Learning engine for skill management with persistence
- Context engine for system prompt augmentation
- Dream engine for background maintenance (dedup, compress, promote, archive)
- Three plugin tools: `search_memories`, `list_skills`, `create_skill`
- Plugin hooks: `tool`, `tool.execute.after`, `experimental.chat.system.transform`, `event`
- Automatic episodic memory recording on tool execution
- Autobahn-compliant OpenCode plugin interface
- WAL mode SQLite database with automatic initialization
- Nanoid-based ID generation for all entities
- Vitest test suite with MemoryEngine tests
