# Git Branching Strategy

## Branch Structure

### Main Branches

**`main`** - Production-ready code
- Always stable and deployable
- Only merge from `develop` via pull requests
- Tagged with version numbers (v1.0.0, v1.1.0, etc.)
- Protected branch - no direct commits

**`develop`** - Integration branch
- Latest development changes
- Merge feature branches here first
- Test thoroughly before merging to `main`
- Should always be in working state

### Supporting Branches

**`feature/*`** - New features
- Branch from: `develop`
- Merge back to: `develop`
- Naming: `feature/technique-effectiveness`, `feature/dark-mode`
- Delete after merging

**`bugfix/*`** - Bug fixes
- Branch from: `develop`
- Merge back to: `develop`
- Naming: `bugfix/keyboard-blocking`, `bugfix/chart-overflow`
- Delete after merging

**`hotfix/*`** - Critical production fixes
- Branch from: `main`
- Merge back to: `main` AND `develop`
- Naming: `hotfix/crash-on-launch`, `hotfix/data-loss`
- Delete after merging

## Workflow

### Starting a New Feature

```bash
# Make sure develop is up to date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature...
git add .
git commit -m "Add feature description"

# Push to remote
git push -u origin feature/your-feature-name
```

### Completing a Feature

```bash
# Make sure your branch is up to date with develop
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop

# Test everything works
npm test

# Merge to develop
git checkout develop
git merge feature/your-feature-name

# Push to remote
git push origin develop

# Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

### Releasing to Production

```bash
# Make sure develop is tested and ready
git checkout develop
npm test

# Merge to main
git checkout main
git pull origin main
git merge develop

# Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

### Emergency Hotfix

```bash
# Branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix the bug...
git add .
git commit -m "Fix critical bug"

# Merge to main
git checkout main
git merge hotfix/critical-bug
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main --tags

# Also merge to develop
git checkout develop
git merge hotfix/critical-bug
git push origin develop

# Delete hotfix branch
git branch -d hotfix/critical-bug
```

## Commit Message Guidelines

### Format
```
<type>: <subject>

<body (optional)>
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Examples
```bash
feat: Add technique effectiveness tracking
fix: Resolve keyboard blocking text input
docs: Update README with new features
perf: Optimize ProgressScreen with React.memo
test: Add tests for mood tracker component
```

## Pull Request Guidelines

### Before Creating PR
- [ ] All tests pass (`npm test`)
- [ ] Code follows project style
- [ ] No console.log statements (use ErrorLogger)
- [ ] Accessibility labels added
- [ ] Tested on device/simulator

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Tested on iOS simulator
- [ ] Tested on physical device

## Screenshots (if applicable)
Add screenshots of UI changes
```

## Current Branch Status

- **main**: Production-ready code (v1.0.0 ready)
- **develop**: Latest stable development code

## Quick Reference

```bash
# Check current branch
git branch

# Switch branches
git checkout develop
git checkout main

# Create new feature
git checkout -b feature/my-feature develop

# See all branches
git branch -a

# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

## Best Practices

1. **Never commit directly to `main`** - Always use pull requests
2. **Keep `develop` stable** - Test before merging features
3. **Small, focused commits** - Easier to review and revert
4. **Descriptive branch names** - `feature/mood-export` not `feature/new-stuff`
5. **Delete merged branches** - Keep repository clean
6. **Pull before push** - Avoid merge conflicts
7. **Test before merging** - Run `npm test` always

## Version Numbering (Semantic Versioning)

**Format:** `MAJOR.MINOR.PATCH` (e.g., v1.2.3)

- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New features, backward compatible (v1.1.0)
- **PATCH**: Bug fixes, backward compatible (v1.0.1)

### Examples
- v1.0.0 → v1.0.1: Fixed keyboard bug
- v1.0.0 → v1.1.0: Added dark mode
- v1.0.0 → v2.0.0: Complete redesign

## For Solo Development

Since you're working solo right now, you can simplify:

1. **Work on `develop`** for most changes
2. **Use feature branches** for major new features
3. **Merge to `main`** when ready for App Store submission
4. **Tag releases** in `main` (v1.0.0, v1.1.0, etc.)

When you get collaborators, enforce the full workflow with pull requests!
