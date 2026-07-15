# GhReadmeStats

Dynamic GitHub stats cards for your profile README. Generate beautiful SVG cards showing your GitHub statistics, top languages, contribution streaks, and more.

## Features

- **Stats Card** — GitHub statistics with rank visualization
- **Top Languages Card** — Most used programming languages
- **Streak Card** — Contribution streak tracking
- **WakaTime Card** — Coding activity from WakaTime
- **Multiple Themes** — 50+ built-in color themes
- **Customizable** — Hide stats, change colors, toggle animations
- **Responsive SVGs** — Works on all devices and platforms
- **Caching** — Optimized with CDN and browser caching
- **API Access** — Dynamic card generation via API
- **Static Export** — Pre-generated SVGs for offline use

## Quick Start

Add to your GitHub profile README:

```markdown
![GitHub Stats](https://gh-readme-stats.pages.dev/api/stats?username=yourname)
```

Or use the static SVG:

```markdown
![GitHub Stats](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/stats-dark.svg)
```

## API Endpoints

### Stats Card

```
GET /api/stats?username=USERNAME&theme=THEME
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `username` | string | — | GitHub username (required) |
| `theme` | string | `default` | Color theme name |
| `show_icons` | bool | `false` | Show stat icons |
| `hide_rank` | bool | `false` | Hide rank circle |
| `include_all_commits` | bool | `false` | Show all-time commits |
| `hide` | string | — | Comma-separated stats to hide |
| `hide_border` | bool | `false` | Hide card border |

### Top Languages Card

```
GET /api/top-langs?username=USERNAME&theme=THEME
```

### Streak Card

```
GET /api/streak?username=USERNAME&theme=THEME
```

## Themes

Available themes include: `default`, `dark`, `radical`, `merko`, `gruvbox`, `tokyonight`, `onedark`, `cobalt`, `synthwave`, `dracula`, `prussian`, `monokai`, `vue`, `vue-dark`, `shades-of-purple`, `nightowl`, `nord`, `github_dark`, and many more.

Custom colors can be applied using query parameters:

```
?title_color=ff0000&icon_color=00ff00&text_color=0000ff&bg_color=ffffff
```

## Deployment

### Cloudflare Pages

The API is deployed on Cloudflare Pages with Workers for dynamic SVG generation.

### GitHub Pages

Pre-generated SVGs are available on GitHub Pages, updated every 6 hours.

## Development

```bash
git clone https://github.com/Karan-Safaie-Qadi/GhReadmeStats.git
cd GhReadmeStats
npm install
npm test
```

Set `GITHUB_TOKEN` environment variable for local testing.

## Architecture

- **src/** — Source code for API and card rendering
  - **cards/** — SVG card renderers
  - **api.js** — GitHub GraphQL API fetchers
  - **index.js** — Cloudflare Workers entry point
  - **themes.js** — Color theme definitions
  - **utils.js** — Utility functions
- **test/** — Test suites
- **scripts/** — Build and generation scripts
- **functions/** — Cloudflare Functions routes

## License

MIT
# update 0
# update 1
# update 2
# update 3
# update 4
# update 5
