# OpenBrain Plugin for OpenCode

An intelligent memory and reflection plugin for OpenCode that adds episodic, semantic, procedural, decision, bug, workspace, and project memory; automatic reflection; learning; and context-aware prompts.

## Features

### Memory Engine
- **7 Memory Types**: Episodic, Semantic, Procedural, Decision, Bug, Workspace, Project
- **Tagging & Confidence Scores**: Organizes and prioritizes memories
- **Search & Filtering**: Search by query, type, or tags

### Reflection Engine
- **Post-Session Analysis**: Automatically reflects on completed work
- **Extracts Insights**: Lessons, mistakes, patterns, anti-patterns, user preferences
- **Stores Reflections**: Saves reflections as semantic memories

### Learning Engine
- **Skill Creation**: Create and manage reusable skills
- **Usage Tracking**: Tracks skill usage and success rates

### Context Engine
- **Automatic Context Injection**: Injects relevant memories, skills into chat
- **Preserves Important Information**: Never loses architecture decisions, bugs, etc.

### Dream Engine
- **Background Processing**: Runs every 5 minutes during idle
- **Deduplication**: Removes duplicate memories
- **Compression**: Compresses old memories (1 week+)
- **Promotion**: Promotes high-confidence memories
- **Archiving**: Archives old memories (1 month+)

### Custom Tools
- `search_memories`: Search memories by query, type, or tags
- `list_skills`: List all learned skills
- `create_skill`: Create a new reusable skill

## Installation

### Local Installation (Project-Level)
1. Copy the entire `openbrand` directory into your project's `.opencode/plugins/` folder
2. In the plugin directory, run: `npm install && npm run build`
3. Restart OpenCode

### Global Installation
1. Copy the entire `openbrand` directory into:
   - macOS/Linux: `~/.config/opencode/plugins/`
   - Windows: `%APPDATA%\OpenCode\plugins\`
2. In the plugin directory, run: `npm install && npm run build`
3. Restart OpenCode

## Usage

Everything works automatically! Here are the custom tools you can use:

- **`search_memories`**: Search your memories
- **`list_skills`**: See all learned skills
- **`create_skill`**: Create a new reusable skill

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Run tests
npm test

# Check types
npm run typecheck

# Run tests
npm test
```

## Compatibility

- **OpenCode**: v1.18.3+
- **Runtime**: OpenCode runs on Bun; native Node.js addons (e.g., `better-sqlite3`) are not supported by the Bun runtime. The plugin uses `bun:sqlite` (built into Bun) for SQLite storage at runtime, with `better-sqlite3` as a fallback for development/testing in Node.js.
- **Plugin API**: `@opencode-ai/plugin@1.18.3`

## License

MIT
