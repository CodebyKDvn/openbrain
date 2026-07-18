# Security Policy

OpenBrain is a local-first plugin. All data stays on your machine.

## Reporting a Vulnerability

If you discover a security vulnerability, please open a confidential GitHub issue or contact the maintainers directly. Do not disclose the issue publicly until it has been addressed.

Given the local-only nature of this project, the most likely security concerns involve:

- Malicious plugin interactions through the OpenCode plugin API
- SQL injection through memory content
- Path traversal in database file locations

If you find any of these, please report them.

## Scope

The following are considered out of scope:

- Attacks requiring physical access to the machine
- Social engineering of project maintainers
- Vulnerabilities in Bun, Node.js, or OpenCode itself
