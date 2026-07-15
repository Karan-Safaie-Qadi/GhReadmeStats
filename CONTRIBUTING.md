# Contributing to GhReadmeStats

Thanks for your interest! Here's how you can help:

## Development Setup

```bash
git clone https://github.com/Karan-Safaie-Qadi/GhReadmeStats.git
cd GhReadmeStats
npm install
npm test
```

## Adding a New Theme

Add an entry to `src/themes.js`:

```js
my_theme: {
  title_color: 'ff0000',
  icon_color: '00ff00',
  text_color: '0000ff',
  bg_color: 'ffffff',
  border_color: 'e4e2e2',
  ring_color: 'ff0000',
},
```

## Adding a New Card

1. Create `src/cards/my-card.js`
2. Add a GraphQL query to `src/api.js` if needed
3. Add the endpoint to `src/index.js` and `functions/api/`
4. Add tests in `test/`

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Run `npm test` — all tests must pass
4. Push and create a PR
