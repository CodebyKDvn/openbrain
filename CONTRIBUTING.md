# Contributing

Thank you for your interest in OpenBrain. This project is small but ambitious. Contributions of all kinds are welcome.

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold its terms.

## How to Contribute

### Report Bugs

Open an issue with a clear title, reproduction steps, and environment details. Include the OpenCode version, platform, and any relevant error output.

### Suggest Features

Open an issue describing the problem you want to solve, not just the solution. Explain why existing tools or approaches don't cover your use case.

### Submit Code

1. Fork the repository.
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes.
4. Run tests: `npm test`
5. Run type checking: `npm run typecheck`
6. Ensure the build passes: `npm run build`
7. Commit with a clear message.
8. Open a pull request.

### Code Style

- TypeScript strict mode is enabled.
- Follow existing patterns in the codebase.
- No unused variables or imports.
- Use explicit return types on public API methods.
- Prefer interfaces over type aliases for object shapes.

### Project Structure

```
src/
├── index.ts                 — Plugin entry point
├── core/                    — Domain entities and interfaces
│   ├── Memory.ts
│   ├── MemoryStorage.ts
│   ├── Reflection.ts
│   └── Skill.ts
├── data/
│   ├── database/            — SQLite abstraction layer
│   └── storage/             — Storage implementations
├── domain/
│   ├── engines/             — Business logic engines
│   └── services/            — Plugin tools
└── tests/                   — Test files
```

### Testing

Tests use vitest. Write tests for new functionality. Existing tests must pass before merging.

```bash
npm test
```

## Questions

Open a discussion or issue for questions about the codebase.
