# GhReadmeStats

Dynamic GitHub stats cards for your profile README. **Fork once, it just works.**

## Quick Start (30 seconds)

1. **Fork** this repository
2. Go to **Settings → Pages → Source** → set to **GitHub Actions**
3. Done. The workflow runs automatically on push and every 15 minutes.

Your SVGs will be at:
```
https://YOUR_USERNAME.github.io/GhReadmeStats/svgs/stats-dark.svg
```

### Profile README

```markdown
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://YOUR_USERNAME.github.io/GhReadmeStats/svgs/stats-dark.svg">
  <img src="https://YOUR_USERNAME.github.io/GhReadmeStats/svgs/stats-default.svg">
</picture>
```

### Private contributions

Set `COUNT_PRIVATE: 'true'` in the workflow env section — requires a PAT with `repo` scope (set as `GH_PAGES_TOKEN`), but for public-only stats, nothing is needed.

## Cards

| Card | URL |
|------|-----|
| Stats | `stats-dark.svg` |
| Top Languages | `top-langs-dark.svg` |
| Streak | `streak-dark.svg` |

Themes: `default`, `dark`, `radical`, `tokyonight`, `dracula`, `nord`, `merko`, `synthwave`, `gruvbox`, `github_dark`

## Development

```bash
USERNAME=your_name GITHUB_TOKEN=ghp_xxx node scripts/generate-svgs.mjs ./svgs
```

## License

MIT
