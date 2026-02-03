# Release Process

## Overview

We use Git tags to trigger deployments. Each release has a version number following [Semantic Versioning](https://semver.org/).

## Version Format

`MAJOR.MINOR.PATCH` (e.g., `v0.2.0`)

| Part | When to increment |
|------|-------------------|
| MAJOR | Breaking changes |
| MINOR | New features |
| PATCH | Bug fixes |

## Files to Update

1. `app/src/version.ts` - Update `APP_VERSION`
2. `docs/ROADMAP.md` - Mark release as complete, add date

## How to Release

```bash
# 1. Update version in code
# Edit app/src/version.ts: export const APP_VERSION = '0.2.0'

# 2. Update ROADMAP.md
# Mark items as [x] done, set Status: Released, add Date

# 3. Commit
git add -A
git commit -m "Release v0.2.0: <brief description>"

# 4. Create tag
git tag v0.2.0

# 5. Push with tags
git push origin main --tags
```

The tag push automatically triggers GitHub Actions deployment.

## How to Rollback

If a release has issues, rollback to a previous version:

1. Go to: https://github.com/yaremayurchyshyn/retro-stamp-web/actions/workflows/deploy.yml
2. Click **"Run workflow"**
3. Enter the version tag to deploy (e.g., `v0.1.0`)
4. Click **"Run workflow"**

This deploys the specified version without changing the codebase.

## How It Works

```
git push tag v0.2.0
        │
        ▼
GitHub Actions triggered (on: push: tags: 'v*')
        │
        ▼
Checkout code at tag
        │
        ▼
npm ci && npm run build
        │
        ▼
Deploy to GitHub Pages
        │
        ▼
Live at: https://yaremayurchyshyn.github.io/retro-stamp-web/
```

## Manual Deploy

To deploy without creating a tag (e.g., hotfix):

1. Go to Actions → "Deploy to GitHub Pages"
2. Click **"Run workflow"**
3. Leave version empty for latest `main`
4. Click **"Run workflow"**

## Release Checklist

- [ ] Code changes committed
- [ ] `app/src/version.ts` updated
- [ ] `docs/ROADMAP.md` updated
- [ ] Tests pass (`npm run lint && npx playwright test`)
- [ ] Tag created and pushed
- [ ] Deployment successful
- [ ] Live site verified

## Version History

| Version | Date | Description |
|---------|------|-------------|
| v0.2.1 | 2026-02-03 | Fix mobile download button |
| v0.2.0 | 2026-02-03 | EXIF date extraction |
| v0.1.0 | 2026-02-03 | MVP - Upload, process, download photos |
