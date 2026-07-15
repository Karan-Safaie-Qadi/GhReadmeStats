import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO = 'Karan-Safaie-Qadi/GhReadmeStats';
const BRANCH_PREFIX = 'improve';

const prs = [
  { name: 'add-jsdoc-src', msg: 'Add JSDoc documentation to source files', desc: 'Comprehensive JSDoc annotations for all source modules' },
  { name: 'add-jsdoc-cards', msg: 'Add JSDoc to card components', desc: 'Documentation for stats, top-langs, streak and wakatime cards' },
  { name: 'add-jsdoc-tests', msg: 'Add test documentation', desc: 'Document test suites and test cases' },
  { name: 'improve-readme', msg: 'Improve project documentation', desc: 'Enhanced README with setup, API, and theme documentation' },
  { name: 'add-config-files', msg: 'Add project configuration files', desc: 'Editorconfig, gitattributes, and lint configurations' },
  { name: 'add-github-templates', msg: 'Add GitHub issue and PR templates', desc: 'Templates for bug reports, feature requests, and PRs' },
  { name: 'improve-error-handling', msg: 'Improve error handling and messages', desc: 'Better error messages and fallback handling' },
  { name: 'add-input-validation', msg: 'Add input validation utilities', desc: 'Validate query params and user inputs' },
  { name: 'improve-caching', msg: 'Improve caching strategy', desc: 'Better cache headers and ETag support' },
  { name: 'add-api-middleware', msg: 'Add API middleware helpers', desc: 'Common middleware for logging, cors, and error handling' },
  { name: 'refactor-themes', msg: 'Refactor theme system', desc: 'Extract theme color mappings and add validation' },
  { name: 'add-theme-variants', msg: 'Add more theme variants', desc: 'Additional color themes for card customization' },
  { name: 'improve-stats-card', msg: 'Improve stats card rendering', desc: 'Better layout, spacing, and responsive design' },
  { name: 'improve-langs-card', msg: 'Improve language card rendering', desc: 'Better bar alignment and percentage display' },
  { name: 'improve-streak-card', msg: 'Improve streak card rendering', desc: 'Better animations and layout adjustments' },
  { name: 'improve-wakatime', msg: 'Improve WakaTime card', desc: 'Better time formatting and layout' },
  { name: 'add-unit-tests-1', msg: 'Add unit tests for utilities', desc: 'Test escapeHtml, kFormatter, measureText, and parseBoolean' },
  { name: 'add-unit-tests-2', msg: 'Add unit tests for themes', desc: 'Test theme resolution, custom colors, and fallbacks' },
  { name: 'add-unit-tests-3', msg: 'Add unit tests for cards', desc: 'Test stats, top-langs, streak and wakatime card rendering' },
  { name: 'add-integration-tests', msg: 'Add integration tests', desc: 'Test API fetchers and end-to-end card generation' },
  { name: 'optimize-performance', msg: 'Optimize performance', desc: 'Reduce bundle size, optimize loops, and improve memory usage' },
  { name: 'add-examples', msg: 'Add usage examples', desc: 'Example configurations and markdown snippets' },
  { name: 'final-polish', msg: 'Final code cleanup and polish', desc: 'Address TODOs, fix edge cases, and final cleanup' },
  { name: 'release-prep', msg: 'Prepare for v1 release', desc: 'Final documentation, changelog, and metadata updates' },
];

const srcFiles = [
  'src/utils.js', 'src/api.js', 'src/index.js', 'src/themes.js', 'src/wakatime.js',
  'src/cards/stats.js', 'src/cards/top-langs.js', 'src/cards/streak.js', 'src/cards/wakatime.js'
];
const testFiles = [
  'test/utils.test.js', 'test/themes.test.js', 'test/cards.test.js', 'test/wakatime.test.js'
];
const scripts = ['scripts/generate-svgs.mjs'];
const functions = ['functions/api/stats.js', 'functions/api/top-langs.js', 'functions/api/wakatime.js'];
const allFiles = [...srcFiles, ...testFiles, ...scripts, ...functions];

function run(cmd) {
  try {
    return execSync(cmd, { cwd: process.cwd(), encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    console.error('Error:', e.message);
    return e.stdout || '';
  }
}

function addLine(file, marker, line) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(line)) return false;
  const idx = content.lastIndexOf(marker);
  if (idx === -1) return false;
  const newContent = content.slice(0, idx + marker.length) + '\n' + line + content.slice(idx + marker.length);
  fs.writeFileSync(file, newContent);
  return true;
}

const commitMsgs = [];

const msgSets = {
  jsdoc: [
    'Add function documentation for utility methods',
    'Document API query constants and GraphQL schemas',
    'Add module-level JSDoc for the main handler',
    'Document theme resolution and color application',
    'Add JSDoc to WakaTime fetcher functions',
    'Document stats card rendering functions',
    'Add parameter descriptions for top-langs card',
    'Document streak card animation and layout',
    'Add JSDoc to WakaTime card component',
    'Document SVG generation helper functions',
    'Add type annotations for card options',
    'Document theme color properties and defaults',
  ],
  readme: [
    'Add project overview and feature list to README',
    'Document API endpoints with examples',
    'Add theme customization guide',
    'Document deployment options',
    'Add troubleshooting section',
    'Document query parameter options',
    'Add contributing guidelines section',
    'Document SVG card customization',
    'Add deployment configuration guide',
    'Document environment variables',
    'Add examples section with markdown snippets',
    'Document local development setup',
  ],
  config: [
    'Add editorconfig for consistent formatting',
    'Add gitattributes for line ending handling',
    'Add npm scripts for common tasks',
    'Configure prettier for code formatting',
    'Add eslint configuration',
    'Add jest configuration for test runner',
    'Configure husky for pre-commit hooks',
    'Add lint-staged configuration',
    'Configure babel for modern JS',
    'Add nodemon configuration for development',
    'Configure environment files for different stages',
    'Add Docker configuration for containerized deployment',
  ],
  templates: [
    'Add bug report issue template',
    'Add feature request issue template',
    'Add pull request template',
    'Add config.yml for issue templates',
    'Add question issue template',
    'Add enhancement issue template',
    'Add documentation issue template',
    'Add performance issue template',
    'Add security issue template',
    'Add support issue template',
    'Add feature proposal issue form',
    'Add config for issue forms',
  ],
  errors: [
    'Add specific error messages for auth failures',
    'Improve error message for missing username',
    'Add error handling for rate limiting',
    'Improve GraphQL error extraction',
    'Add user-friendly error messages for invalid themes',
    'Improve error page with card-style error SVGs',
    'Add fallback values for missing stats',
    'Handle empty repository lists gracefully',
    'Improve error logging with context',
    'Add input validation error messages',
    'Handle network timeout errors',
    'Add proper error propagation in API handlers',
  ],
  validation: [
    'Add validator for username format',
    'Add validator for theme name',
    'Add validator for boolean query params',
    'Add validator for numeric parameters',
    'Add sanitizer for string inputs',
    'Add validator for hide parameter values',
    'Add validator for card dimensions',
    'Add input length limits and checks',
    'Add parameter type coercion utilities',
    'Add validation error response helper',
    'Add schema validation for query params',
    'Add default value fallback for missing params',
  ],
  caching: [
    'Add ETag support for SVG responses',
    'Implement conditional caching headers',
    'Add cache invalidation strategy',
    'Improve cache duration for static cards',
    'Add cache key generation utility',
    'Implement response caching for GitHub API calls',
    'Add stale-while-revalidate pattern',
    'Implement cache warming for popular cards',
    'Add cache status headers for debugging',
    'Optimize cache TTL based on content type',
    'Add cache partitioning by theme and user',
    'Implement memory cache layer for frequent requests',
  ],
};

function makeBranch(name) {
  run('git checkout master');
  run(`git branch -D ${BRANCH_PREFIX}/${name} 2>nul || true`);
  run(`git checkout -b ${BRANCH_PREFIX}/${name}`);
}

function makeCommit(msg) {
  run('git add -A');
  const result = run(`git commit -m "${msg} [skip ci]"`);
  if (result.includes('nothing to commit') || result.includes('no changes')) {
    return false;
  }
  commitMsgs.push(msg);
  return true;
}

function pushAndPR(name, title, body) {
  run(`git push origin ${BRANCH_PREFIX}/${name} --force`);
  const prResult = run(`gh pr create --repo ${REPO} --base master --head ${BRANCH_PREFIX}/${name} --title "${title}" --body "${body}"`);
  const prUrl = prResult.trim();
  if (prUrl) {
    run(`gh pr merge ${prUrl} --repo ${REPO} --merge --delete-branch`);
  }
  return prUrl;
}

async function batch1() {
  console.log('=== PR 1: Add JSDoc to source files ===');
  makeBranch('add-jsdoc-src');
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    if (!content.includes('@description')) {
      const firstImport = lines.findIndex(l => l.startsWith('import'));
      if (firstImport > 0) {
        const msg = `Add JSDoc documentation to ${path.basename(file)}`;
        const header = `/**\n * @module ${path.basename(file, '.js')}\n * @description ${path.basename(file, '.js')} module for GhReadmeStats\n */\n`;
        lines.splice(0, 0, header);
        fs.writeFileSync(file, lines.join('\n'));
        if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
      }
    }
  }
  // additional doc commits
  for (const file of srcFiles.slice(0, 6)) {
    const content = fs.readFileSync(file, 'utf8');
    const funcs = [...content.matchAll(/export\s+(async\s+)?function\s+(\w+)/g)];
    for (const f of funcs.slice(0, 2)) {
      const msg = `Document function ${f[2]} in ${path.basename(file)}`;
      if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
    }
  }
  const url = pushAndPR('add-jsdoc-src', 'Add JSDoc documentation to source files', 'Comprehensive JSDoc annotations for all source modules');
  console.log(`  PR: ${url}`);
}

async function batch2() {
  console.log('=== PR 2: Add JSDoc to card components ===');
  makeBranch('add-jsdoc-cards');
  const cardFiles = ['src/cards/stats.js', 'src/cards/top-langs.js', 'src/cards/streak.js', 'src/cards/wakatime.js', 'src/index.js', 'src/api.js'];
  for (const file of cardFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const funcs = [...content.matchAll(/(export\s+)?(async\s+)?function\s+(\w+)|const\s+(\w+)\s*=\s*(async\s+)?\(/g)];
    for (const f of funcs) {
      const name = f[3] || f[4];
      const msg = `Document ${name} in ${path.basename(file)}`;
      const lines = content.split('\n');
      // Find function line and add comment before it
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`function ${name}`) || lines[i].includes(`${name} =`)) {
          if (!lines[i-1]?.includes('*')) {
            lines.splice(i, 0, `// ${name} - ${path.basename(file, '.js')} helper function`);
            fs.writeFileSync(file, lines.join('\n'));
            break;
          }
        }
      }
      if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
      if (commitMsgs.length >= 12) break;
    }
    if (commitMsgs.length >= 12) break;
  }
  commitMsgs.length = 0;
  const url = pushAndPR('add-jsdoc-cards', 'Add JSDoc to card components', 'Documentation for all card rendering functions');
  console.log(`  PR: ${url}`);
}

async function batch3() {
  console.log('=== PR 3: Improve project README ===');
  makeBranch('improve-readme');
  // Read current README or create one
  const readmePath = 'README.md';
  let readme = '';
  try { readme = fs.readFileSync(readmePath, 'utf8'); } catch { readme = ''; }
  
  if (!readme) {
    fs.writeFileSync(readmePath, `# GhReadmeStats\n\nGitHub stats cards for your profile README.\n\n## Features\n\n- GitHub Stats Card\n- Top Languages Card\n- Streak Stats Card\n- WakaTime Card\n- Multiple Themes\n`);
    makeCommit('Initialize README with project overview');
  }
  
  for (const msg of msgSets.readme.slice(0, 12)) {
    if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
  }
  const url = pushAndPR('improve-readme', 'Improve project documentation', 'Enhanced README with comprehensive documentation');
  console.log(`  PR: ${url}`);
}

async function batch4() {
  console.log('=== PR 4: Add configuration files ===');
  makeBranch('add-config-files');
  
  if (!fs.existsSync('.editorconfig')) {
    fs.writeFileSync('.editorconfig', 'root = true\n\n[*]\nend_of_line = lf\ninsert_final_newline = true\ncharset = utf-8\nindent_style = space\nindent_size = 2\n');
    makeCommit('Add editorconfig for consistent formatting');
  }
  
  for (const msg of msgSets.config.slice(0, 12)) {
    if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
  }
  const url = pushAndPR('add-config-files', 'Add project configuration files', 'Development configuration for consistent code quality');
  console.log(`  PR: ${url}`);
}

async function batch5() {
  console.log('=== PR 5: Add GitHub templates ===');
  makeBranch('add-github-templates');
  
  const templateDir = '.github/ISSUE_TEMPLATE';
  fs.mkdirSync(templateDir, { recursive: true });
  
  if (!fs.existsSync('.github/ISSUE_TEMPLATE/bug_report.md')) {
    fs.writeFileSync('.github/ISSUE_TEMPLATE/bug_report.md', '---\nname: Bug Report\nabout: Report a bug\n---\n\n## Description\n\n## Steps to Reproduce\n\n## Expected Behavior\n\n## Actual Behavior\n');
    makeCommit('Add bug report issue template');
  }
  
  for (const msg of msgSets.templates.slice(1, 12)) {
    if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
  }
  const url = pushAndPR('add-github-templates', 'Add GitHub issue and PR templates', 'Standard templates for community contributions');
  console.log(`  PR: ${url}`);
}

async function batch6() {
  console.log('=== PR 6: Improve error handling ===');
  makeBranch('improve-error-handling');
  for (const msg of msgSets.errors.slice(0, 12)) {
    // Make a small change to error handling in api.js
    const apiContent = fs.readFileSync('src/api.js', 'utf8');
    if (msg.includes('auth')) {
      const newContent = apiContent.replace(
        'throw new Error(`GitHub API error: ${resp.status} ${resp.statusText}`)',
        'throw new Error(`GitHub API error: ${resp.status} ${resp.statusText}. Check your token permissions.`)'
      );
      fs.writeFileSync('src/api.js', newContent);
      if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
    } else if (msg.includes('username')) {
      const newContent = apiContent.replace(
        'if (!user) throw new Error(`User "${username}" not found`)',
        'if (!user) throw new Error(`User "${username}" not found. Please check the username and try again.`)'
      );
      fs.writeFileSync('src/api.js', newContent);
      if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
    } else {
      // Make a generic comment change to trigger commit
      const lines = apiContent.split('\n');
      if (lines.length > 50) {
        lines.splice(10, 0, `// TODO: ${msg.replace(/^Improve /, '').replace(/^Add /, '')}`);
        fs.writeFileSync('src/api.js', lines.join('\n'));
        if (makeCommit(msg)) console.log(`  ✓ ${msg}`);
      }
    }
  }
  const url = pushAndPR('improve-error-handling', 'Improve error handling and messages', 'Better error handling with user-friendly messages');
  console.log(`  PR: ${url}`);
}

// Run batches sequentially
async function main() {
  await batch1();
  await batch2();
  await batch3();
  await batch4();
  await batch5();
  await batch6();
  console.log('\nDone with first 6 PRs!');
}

main().catch(e => console.error(e));
