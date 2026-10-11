# Git Branching Strategy

> **Last reviewed:** October 10, 2026
>
> **Reality note:** This project is developed solo and ships frequently to the
> App Store and Google Play. In practice, `main` is the active trunk — day-to-day
> work, build bumps, and releases all happen on `main`. The older `develop`
> branch fell out of use and is hundreds of commits behind; it is **not** the
> integration branch and should not be branched from. This document describes
> the workflow we actually follow (trunk-based with short-lived feature
> branches), not an aspirational Git Flow.

## Branch Structure

### Trunk

**`main`** - The source of truth
- The active development trunk and the production-ready branch
- Always kept in a working, deployable state
- Feature branches are cut from `main` and merged back into `main`
- Tagged / tracked with build numbers for App Store and Play submissions
- Small, direct commits on `main` are acceptable for solo work (docs, build
  bumps, native folder regen). Use a feature branch for anything larger than a
  quick fix.

### Supporting Branches

**`feature/*`** - New features and larger changes
- Branch from: `main`
- Merge back to: `main`
- Naming: `feature/ios26-liquid-glass`, `feature/dark-mode`
- Delete after merging

**`bugfix/*`** - Non-urgent bug fixes that are too big for a direct commit
- Branch from: `main`
- Merge back to: `main`
- Naming: `bugfix/keyboard-blocking`, `bugfix/chart-overflow`
- Delete after merging

**`build-*`** - Per-build snapshots (historical pattern)
- Point-in-time branches created around specific build numbers
- Kept for reference; not part of the active workflow

### About `develop` (deprecated)

`develop` is retained only for history. It is far behind `main` and is **not**
used for integration. Do not branch from it or merge into it. If you ever want a
true integration branch again, first fast-forward `develop` to `main` so it
reflects current reality, then adopt the Git Flow variant below.

## Workflow

### Starting a New Feature

```bash
# Make sure main is up to date
git checkout main
git pull origin main

# Create feature branch from main
git checkout -b feature/your-feature-name

# Work on your feature...
git add <specific files>
git commit -m "feat: short description"

# Push to remote
git push -u origin feature/your-feature-name
```

### Completing a Feature

```bash
# Pull the latest main into your branch so the merge is clean
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main

# Test everything works
npm test

# Merge back into main
git checkout main
git merge feature/your-feature-name

# Push to remote
git push origin main

# Delete feature branch (local + remote)
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

### Releasing to the App Store / Google Play

Releases ship directly from `main`. Bump the build/version numbers on `main`,
regenerate native folders if needed, then build and submit.

```bash
git checkout main
git pull origin main
npm test

# Bump version/build numbers, commit
git commit -m "chore: bump to build NNN"

# Tag the release (optional but recommended)
git tag -a v1.2.15 -m "Release 1.2.15 (build 108)"
git push origin main --tags

# Build and submit
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Emergency Hotfix

Because `main` is the trunk, a hotfix is just a small, focused change on `main`
(or a short `hotfix/*` branch merged straight back into `main`).

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix the bug...
git add <specific files>
git commit -m "fix: resolve critical bug"

git checkout main
git merge hotfix/critical-bug
git tag -a v1.2.16 -m "Hotfix 1.2.16"
git push origin main --tags

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

- **main**: Active trunk and production-ready code (currently build 108, v1.2.15)
- **develop**: Deprecated — far behind `main`, retained for history only
- **feature/ios26-liquid-glass**: In-progress iOS 26 Liquid Glass modernization

## Quick Reference

```bash
# Check current branch
git branch

# Switch branches
git checkout main

# Create new feature (from main)
git checkout -b feature/my-feature main

# See all branches
git branch -a

# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

## Best Practices

1. **`main` is the trunk** - Keep it working and deployable at all times
2. **Branch from `main` for larger work** - Merge back into `main` when tested
3. **Small, focused commits** - Easier to review and revert
4. **Stage specific files** - Prefer `git add <file>` over `git add .`
5. **Descriptive branch names** - `feature/mood-export` not `feature/new-stuff`
6. **Delete merged branches** - Keep repository clean
7. **Pull before push** - Avoid merge conflicts
8. **Test before merging** - Run `npm test` always
9. **Don't branch from `develop`** - It is stale; use `main`

## Version Numbering (Semantic Versioning)

**Format:** `MAJOR.MINOR.PATCH` (e.g., v1.2.3)

- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New features, backward compatible (v1.1.0)
- **PATCH**: Bug fixes, backward compatible (v1.0.1)

### Examples
- v1.0.0 → v1.0.1: Fixed keyboard bug
- v1.0.0 → v1.1.0: Added dark mode
- v1.0.0 → v2.0.0: Complete redesign

## For Solo Development (current reality)

This is how the project actually runs today:

1. **`main` is the trunk** — most changes (docs, build bumps, small fixes) are
   committed directly to `main`.
2. **Use `feature/*` branches for larger work** — cut from `main`, merged back
   to `main`. The iOS 26 modernization (`feature/ios26-liquid-glass`) is an
   example.
3. **Release from `main`** — bump build numbers and submit to the App Store /
   Google Play directly from `main`.
4. **Tag releases on `main`** for traceability.

When you add collaborators, consider introducing a protected `main` with pull
requests, and either revive `develop` (fast-forwarded to `main` first) or adopt
a release-branch model. Until then, trunk-based keeps things simple and matches
how you ship.

## If You Want to Revive Git Flow Later

The original version of this document described a `main` + `develop` + feature
Git Flow model. If you want that back (e.g. with collaborators), do this first
so you don't branch from stale code:

```bash
# Bring develop up to the current trunk before using it again
git checkout develop
git merge --ff-only main   # fast-forward develop to match main
git push origin develop
```

Only after `develop` matches `main` should you resume branching features from
`develop`.
