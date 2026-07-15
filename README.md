# 📊 GhReadmeStats — GitHub Readme Stats

> **Personalized, accurate GitHub stats cards for your profile README**
>
> **کارت‌های آماری دقیق و شخصی‌سازی شده گیت‌هاب برای پروفایل شما**

---

## 🇬🇧 English

### Overview

GhReadmeStats is a self-hosted alternative to [github-readme-stats](https://github.com/anuraghazra/github-readme-stats). It generates beautiful SVG cards with your GitHub statistics — exactly like the original, but fully customizable and deployable on your own infrastructure.

**Key features:**
- 📈 Stats card with rank visualization
- 🎨 Top languages card with progress bars
- 🌈 50+ built-in themes (dark, light, radical, tokyonight, dracula, nord, and many more)
- 🎯 Custom colors via URL parameters
- 🚀 Deploy on Cloudflare Pages (free) or GitHub Pages (free)
- 🇮🇷 Accessible from Iran on GitHub Pages
- ⚡ Fast, cached, and reliable

### Demo

| Theme | Stats | Top Languages |
|-------|-------|---------------|
| Dark | ![Stats Dark](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/stats-dark.svg) | ![Langs Dark](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/top-langs-dark.svg) |
| Light | ![Stats Default](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/stats-default.svg) | ![Langs Default](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/top-langs-default.svg) |
| Radical | ![Stats Radical](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/stats-radical.svg) | ![Langs Radical](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/top-langs-radical.svg) |
| Tokyo Night | ![Stats Tokyo](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/stats-tokyonight.svg) | ![Langs Tokyo](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/top-langs-tokyonight.svg) |

### Quick Start

Add this to your GitHub profile README:

```markdown
![GitHub Stats](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/stats-dark.svg)
![Top Languages](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/top-langs-dark.svg)
```

**Note:** The SVGs above are hosted statically and update every 6 hours. For a live API, deploy your own instance (see below).

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats?username=USER` | GitHub stats card |
| `GET /api/top-langs?username=USER` | Top languages card |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `username` | `string` | — | **Required.** GitHub username |
| `theme` | `string` | `default` | Theme name (see list below) |
| `hide` | `string` | — | Comma-separated: `stars,commits,prs,issues,repos,contribs` |
| `hide_rank` | `bool` | `false` | Hide the rank badge |
| `hide_border` | `bool` | `false` | Hide the card border |
| `show_icons` | `bool` | `false` | Show icons next to stats |
| `title_color` | `hex` | — | Custom title color (without `#`) |
| `text_color` | `hex` | — | Custom text color |
| `icon_color` | `hex` | — | Custom icon color |
| `bg_color` | `hex` | — | Custom background color |
| `border_color` | `hex` | — | Custom border color |
| `ring_color` | `hex` | — | Custom rank ring color |

### Themes (50+)

<details>
<summary>Click to expand full theme list</summary>

| Theme | Preview |
|-------|---------|
| `default` | Light theme, clean and minimal |
| `dark` | Dark theme, easy on the eyes |
| `radical` | Pink/cyan cyberpunk vibes |
| `merko` | Green hacker aesthetic |
| `gruvbox` | Warm retro colors |
| `tokyonight` | Deep blue/purple night |
| `onedark` | Atom One Dark theme |
| `cobalt` | Blue/purple cobalt |
| `synthwave` | Synthwave 80s aesthetic |
| `dracula` | Dark vampire theme |
| `prussian` | Prussian blue |
| `monokai` | Monokai syntax theme |
| `vue` | Vue.js green |
| `vue-dark` | Vue.js dark variant |
| `shades-of-purple` | Deep purple gradients |
| `nightowl` | Night owl theme |
| `buefy` | Buefy UI colors |
| `blue-green` | Blue and green |
| `algolia` | Algolia search colors |
| `great-gatsby` | Gatsby purple |
| `bear` | Bear blogging theme |
| `solarized-dark` | Solarized dark |
| `solarized-light` | Solarized light |
| `nord` | Arctic blue theme |
| `gotham` | Batman dark |
| `material-palenight` | Material palenight |
| `graywhite` | Clean gray/white |
| `vision-friendly-dark` | Accessible dark |
| `ayu-mirage` | Ayu mirage |
| `midnight-purple` | Midnight purple |
| `calm` | Calm pastels |
| `flag-india` | India tricolor |
| `omni` | Omni theme |
| `react` | React blue |
| `jolly` | Colorful jolly |
| `maroongold` | Maroon and gold |
| `yeblu` | Yellow on black |
| `blueberry` | Blueberry dark |
| `slateorange` | Slate orange |
| `kacho_ga` | Japanese ink |
| `outrun` | Outrun retro |
| `ocean_dark` | Deep ocean |
| `city_lights` | City at night |
| `github_dark` | GitHub dark mode |
| `github_light` | GitHub light mode |
| `transparent` | Transparent background |
| `rose` | Rose pink |
| `rose_pine` | Rosé Pine |
| `rose_pine_moon` | Rosé Pine Moon |
| `discord_old_blurple` | Discord blurple |
| `aura_dark` | Aura dark |
| `panda` | Panda syntax |
| `noctis_minimus` | Noctis minimus |
| `cobalt2` | Cobalt2 |
| `swift` | Swift orange |
| `material` | Material design |
| `material_darker` | Material darker |
| `material_high_contrast` | Material high contrast |

</details>

### 🚀 Deploy Your Own Instance

#### Option 1: Cloudflare Pages (API — Live)

1. **Fork** this repository
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
3. Click **Create application** → **Pages** → **Connect to Git**
4. Select your fork and set build command: `npm ci`
5. Add environment variable: `GITHUB_TOKEN` = your GitHub PAT
6. Deploy!

Your API will be live at `https://your-project.pages.dev`.

#### Option 2: GitHub Pages (Static SVGs)

The repository comes with a pre-configured GitHub Actions workflow that:

- Runs every 6 hours
- Fetches fresh data from GitHub API
- Generates SVG cards
- Deploys to GitHub Pages

To enable:

1. Go to your fork's **Settings** → **Secrets and variables** → **Actions**
2. Add secret `GH_PAGES_TOKEN` (GitHub PAT with `public_repo` scope)
3. Go to **Actions** → **Generate SVGs for GitHub Pages** → **Run workflow**
4. Go to **Settings** → **Pages** → Set source to `gh-pages` branch

Your SVGs will be at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/svgs/stats-dark.svg
```

#### Option 3: Local Development

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/GhReadmeStats.git
cd GhReadmeStats

# Install
npm install

# Set GitHub token
export GITHUB_TOKEN=ghp_your_token_here

# Run tests
npm test

# Develop with wrangler
npm run dev
```

### 🧪 Tests

```bash
npm test
```

All tests use [Vitest](https://vitest.dev/) and cover utility functions, themes, SVG rendering, and API integration.

### 📁 Project Structure

```
GhReadmeStats/
├── src/
│   ├── index.js          # Cloudflare Worker entry
│   ├── api.js            # GitHub GraphQL client
│   ├── themes.js         # 50+ theme definitions
│   ├── utils.js          # Helpers (kFormatter, measureText, etc.)
│   └── cards/
│       ├── stats.js      # Stats card SVG renderer
│       └── top-langs.js  # Top languages card SVG renderer
├── functions/api/        # Cloudflare Pages Functions
│   ├── stats.js          # /api/stats endpoint
│   └── top-langs.js      # /api/top-langs endpoint
├── scripts/
│   └── generate-svgs.mjs # GitHub Pages SVG generator
├── test/                 # Vitest test suite
├── .github/workflows/    # CI/CD pipelines
└── public/               # Static assets
```

### 📄 License

MIT

---

## 🇮🇷 فارسی

### معرفی

**GhReadmeStats** یه جایگزین شخصی‌سازی شده برای [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) هست. کارت‌های SVG زیبا با آمار گیت‌هاب شما تولید می‌کنه — دقیقاً مثل نسخه اصلی، اما کاملاً قابل شخصی‌سازی و قابل نصب روی سرور خودتون.

**ویژگی‌ها:**
- 📈 کارت آمار با نمایش رتبه (Rank)
- 🎨 کارت زبان‌های پراستفاده با نوار پیشرفت
- 🌈 ۵۰+ تم آماده (تاریک، روشن، رنگارنگ و ...)
- 🎯 رنگ‌های دلخواه با پارامتر URL
- 🚀 نصب روی Cloudflare Pages (رایگان) یا GitHub Pages (رایگان)
- 🇮🇷 قابل دسترس از ایران روی GitHub Pages
- ⚡ سریع، با کش و قابل اعتماد

### شروع سریع

برای استفاده در README پروفایل گیت‌هاب خودت:

```markdown
![GitHub Stats](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/stats-dark.svg)
![بیشترین زبان‌ها](https://Karan-Safaie-Qadi.github.io/GhReadmeStats/svgs/top-langs-dark.svg)
```

### نصب شخصی

#### روش ۱: Cloudflare Pages (API زنده)

۱. این ریپازیتوری رو **فورک** کن
۲. برو به [Cloudflare Dashboard](https://dash.cloudflare.com) ← **Workers & Pages**
۳. **Create application** ← **Pages** ← **Connect to Git**
۴. فورک خودت رو انتخاب کن و دستور build رو بزار: `npm ci`
۵. متغیر محیطی `GITHUB_TOKEN` رو با یه GitHub PAT اضافه کن
۶. دیپلوی کن!

API تو این آدرس در دسترس خواهد بود: `https://your-project.pages.dev`

#### روش ۲: GitHub Pages (SVG ثابت — قابل دسترس از ایران)

این ریپازیتوری یه GitHub Actions workflow آماده داره که:

- هر ۶ ساعت یک بار اجرا می‌شه
- داده‌های تازه رو از API گیت‌هاب می‌گیره
- کارت‌های SVG رو می‌سازه
- روی GitHub Pages منتشر می‌کنه

فعال‌سازی:

۱. برو به **Settings** ← **Secrets and variables** ← **Actions**
۲. سکرت `GH_PAGES_TOKEN` رو اضافه کن (GitHub PAT با دسترسی `public_repo`)
۳. برو به **Actions** ← **Generate SVGs for GitHub Pages** ← **Run workflow**
۴. برو به **Settings** ← **Pages** و منبع رو `gh-pages` قرار بده

SVGهای تو در این آدرس در دسترس هستن:
```
https://USERNAME.github.io/REPO_NAME/svgs/stats-dark.svg
```

### پارامترهای API

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|-------|
| `username` | `string` | — | **اجباری.** نام کاربری گیت‌هاب |
| `theme` | `string` | `default` | اسم تم (لیست تم‌ها در بخش انگلیسی) |
| `hide` | `string` | — | مخفی کردن: `stars,commits,prs,issues,repos,contribs` |
| `hide_rank` | `bool` | `false` | مخفی کردن رتبه |
| `hide_border` | `bool` | `false` | مخفی کردن حاشیه کارت |
| `show_icons` | `bool` | `false` | نمایش آیکون‌ها |
| `title_color` | `hex` | — | رنگ عنوان (بدون `#`) |
| `text_color` | `hex` | — | رنگ متن |
| `icon_color` | `hex` | — | رنگ آیکون |
| `bg_color` | `hex` | — | رنگ پس‌زمینه |
| `border_color` | `hex` | — | رنگ حاشیه |
| `ring_color` | `hex` | — | رنگ دایره رتبه |

### 📁 ساختار پروژه

```
GhReadmeStats/
├── src/
│   ├── index.js          # ورودی Cloudflare Worker
│   ├── api.js            # کلاینت GraphQL گیت‌هاب
│   ├── themes.js         # ۵۰+ تم رنگی
│   ├── utils.js          # توابع کمکی
│   └── cards/
│       ├── stats.js      # رندر کارت آمار
│       └── top-langs.js  # رندر کارت زبان‌ها
├── functions/api/        # Cloudflare Pages Functions
├── scripts/
│   └── generate-svgs.mjs # مولد SVG برای GitHub Pages
├── test/                 # تست‌ها
├── .github/workflows/    # CI/CD
└── public/               # فایل‌های استاتیک
```

### 📄 مجوز

MIT — آزاد برای استفاده شخصی و تجاری
