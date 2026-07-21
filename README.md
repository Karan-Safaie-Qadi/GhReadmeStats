# GhReadmeStats

Dynamic GitHub stats cards for your profile README. Fork this repo and set it up for your own GitHub profile.

## Quick Start (Fork & Deploy)

1. **Fork** this repository
2. Go to your fork **Settings → Secrets and variables → Actions**
3. Add a new secret named `GH_PAGES_TOKEN` with a [GitHub PAT](https://github.com/settings/tokens) (scopes: `repo`, `read:user`)
4. Edit `.github/workflows/gh-pages.yml` and change `USERNAME` to **your** GitHub username
5. Go to **Settings → Pages** and set Source to **GitHub Actions**
6. Push a commit to trigger the workflow (or go to Actions tab and run "Generate SVGs for GitHub Pages")
7. Your SVGs will be at:
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

## Cards

| Card | URL |
|------|-----|
| Stats | `/svgs/stats-dark.svg` |
| Top Languages | `/svgs/top-langs-dark.svg` |
| Streak | `/svgs/streak-dark.svg` |

Available themes: `default`, `dark`, `radical`, `tokyonight`, `dracula`, `nord`, `merko`, `synthwave`, `gruvbox`, `github_dark`

## Development

```bash
git clone https://github.com/YOUR_USERNAME/GhReadmeStats.git
cd GhReadmeStats
npm install
GITHUB_TOKEN=your_pat node scripts/generate-svgs.mjs ./svgs
```

## License

MIT
