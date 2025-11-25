# Contributing to Marathon Certificate Generator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/marathon.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see README.md)
5. Run the development server: `npm run dev`

## Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Commit with clear messages: `git commit -m "Add: description of changes"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use ESLint for code quality

## Commit Message Format

- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates to existing features
- `Refactor:` for code refactoring
- `Docs:` for documentation changes

## Pull Request Process

1. Ensure your code passes linting: `npm run lint`
2. Update documentation if needed
3. Add tests if applicable
4. Ensure all tests pass
5. Create a descriptive PR with:
   - Clear title
   - Description of changes
   - Screenshots (if UI changes)
   - Related issues (if any)

## Using the PR Workflow Script

We provide a convenient script to automate PR creation and merging:

```bash
./scripts/pr-workflow.sh [branch-name] [pr-title] [pr-body]
```

Example:
```bash
./scripts/pr-workflow.sh feature/admin-panel "Add admin panel" "This PR adds an admin panel..."
```

## Questions?

Feel free to open an issue for questions or discussions!

