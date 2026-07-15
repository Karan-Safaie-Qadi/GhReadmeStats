import { execSync } from 'child_process';
import fs from 'fs';

const REPO = 'Karan-Safaie-Qadi/GhReadmeStats';

function run(cmd) {
  try { return execSync(cmd, { cwd: '.', encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { return e.stdout || ''; }
}

const prs = [
  {
    name: 'docs-contributing',
    title: 'Add contributing guidelines',
    file: 'CONTRIBUTING.md',
    commits: [
      '# Contributing\n\nThank you for considering contributing to GhReadmeStats!',
      '## Getting Started\n\n1. Fork the repository\n2. Create a feature branch\n3. Submit a pull request',
      '## Development Setup\n\n```bash\ngit clone https://github.com/Karan-Safaie-Qadi/GhReadmeStats.git\ncd GhReadmeStats\nnpm install\nnpm test\n```',
      '## Coding Standards\n\n- Follow existing code style and conventions\n- Add tests for new functionality\n- Update documentation as needed\n- Keep commits atomic and well-described',
      '## Pull Request Process\n\n1. Update the README.md with details of changes\n2. Run the full test suite: `npm test`\n3. Ensure your code passes linting\n4. Submit the PR with a clear description',
      '## Code Review\n\nAll submissions require review. Maintainers may request changes before merging.',
      '## Community\n\nBe respectful and constructive. We welcome contributions from everyone.',
    ]
  },
  {
    name: 'docs-changelog',
    title: 'Add changelog and version history',
    file: 'CHANGELOG.md',
    commits: [
      '# Changelog\n\nAll notable changes to GhReadmeStats will be documented here.',
      '## [1.0.0] - 2026-07-15\n\n### Added\n- GitHub Stats card with rank visualization\n- Top Languages card with progress bars\n- Streak Stats card with contribution tracking',
      '### Features\n- 50+ built-in color themes\n- Custom color overrides via query parameters\n- Static SVG export for GitHub Pages\n- Dynamic API generation via Cloudflare Workers',
      '### API Endpoints\n- `/api/stats` - GitHub statistics card\n- `/api/top-langs` - Language breakdown card\n- `/api/streak` - Contribution streak card',
      '### Configuration\n- `hide` parameter to hide individual stats\n- `show_icons` for stat icons\n- `include_all_commits` for commit count options\n- `hide_border` and `hide_rank` options',
      '### Deployment\n- Cloudflare Pages with Workers Functions\n- GitHub Pages with scheduled SVG regeneration\n- Support for custom domains and caching',
      '### Documentation\n- Comprehensive README with examples\n- Full API reference documentation\n- Theme list and customization guide',
    ]
  },
  {
    name: 'docs-code-of-conduct',
    title: 'Add code of conduct',
    file: 'CODE_OF_CONDUCT.md',
    commits: [
      '# Code of Conduct\n\n## Our Pledge\n\nWe pledge to make participation in our project a harassment-free experience.',
      '## Our Standards\n\n- Using welcoming and inclusive language\n- Being respectful of differing viewpoints\n- Gracefully accepting constructive criticism',
      '## Enforcement Responsibilities\n\nProject maintainers are responsible for clarifying and enforcing standards.',
      '## Scope\n\nThis Code of Conduct applies within all project spaces and public spaces.',
      '## Enforcement\n\nInstances of unacceptable behavior may be reported to the project maintainers.',
      '## Attribution\n\nThis Code of Conduct is adapted from the Contributor Covenant, version 2.0.',
      '## Enforcement Guidelines\n\nProject maintainers will follow these guidelines in determining consequences.',
    ]
  },
  {
    name: 'docs-security',
    title: 'Add security policy',
    file: 'SECURITY.md',
    commits: [
      '# Security Policy\n\n## Supported Versions\n\nWe release security updates for the latest version.',
      '## Reporting a Vulnerability\n\nPlease report security issues by opening a GitHub issue.',
      '## Disclosure Policy\n\nWe follow responsible disclosure practices for all security issues.',
      '## Security Update Process\n\n1. Issue is reported\n2. We investigate and confirm\n3. Fix is developed and tested\n4. Update is released',
      '## Recognition\n\nWe acknowledge security researchers who help improve our project.',
      '## Contact\n\nFor urgent security matters, please use GitHub Issues.',
      '## Best Practices\n\nKeep your tokens secure and use environment variables.',
    ]
  },
  {
    name: 'templates-bug-report',
    title: 'Add bug report template',
    file: '.github/ISSUE_TEMPLATE/bug_report.md',
    commits: [
      '---\nname: Bug Report\nabout: Report a bug to help us improve\n---\n\n## Description\n\nA clear description of the bug.',
      '## Steps to Reproduce\n\n1. Go to endpoint\n2. Use parameters\n3. See error',
      '## Expected Behavior\n\nWhat you expected to happen.',
      '## Actual Behavior\n\nWhat actually happened.',
      '## Screenshots\n\nIf applicable, add screenshots.',
      '## Environment\n\n- OS: \n- Browser: \n- API version:',
      '## Additional Context\n\nAdd any other context about the problem.',
    ]
  },
  {
    name: 'templates-feature-request',
    title: 'Add feature request template',
    file: '.github/ISSUE_TEMPLATE/feature_request.md',
    commits: [
      '---\nname: Feature Request\nabout: Suggest an idea for this project\n---\n\n## Problem Statement\n\nDescribe the problem this feature would solve.',
      '## Proposed Solution\n\nDescribe the solution you would like.',
      '## Alternatives Considered\n\nDescribe alternatives you have considered.',
      '## Implementation Ideas\n\nAny thoughts on how to implement this.',
      '## Examples\n\nExamples from other projects or services.',
      '## Additional Context\n\nAdd any other context or screenshots.',
      '## Would you like to contribute?\n\nLet us know if you would like to help implement this.',
    ]
  },
  {
    name: 'templates-pull-request',
    title: 'Add pull request template',
    file: '.github/PULL_REQUEST_TEMPLATE.md',
    commits: [
      '## Description\n\nPlease include a summary of the changes.',
      '## Related Issue\n\nFixes #(issue)',
      '## Type of Change\n\n- [ ] Bug fix\n- [ ] New feature\n- [ ] Documentation update',
      '## How Has This Been Tested?\n\nPlease describe the tests you ran.',
      '## Checklist\n\n- [ ] Tests pass\n- [ ] Code follows style guidelines\n- [ ] Documentation updated',
      '## Screenshots\n\nIf applicable, add screenshots.',
      '## Additional Notes\n\nAny additional information for reviewers.',
    ]
  },
];

function waitForMaster() {
  let tries = 0;
  while (tries < 10) {
    run('git checkout master 2>nul');
    const status = run('git status --short');
    if (!status.includes('CHANGES.md')) return true;
    run('git checkout -- CHANGES.md 2>nul');
    tries++;
  }
  return false;
}

let totalCommits = 0;
let totalPRs = 0;

for (const pr of prs) {
  waitForMaster();
  run('git pull origin master 2>nul');
  run(`git branch -D ${pr.name} 2>nul`);
  run(`git checkout -b ${pr.name}`);
  
  let count = 0;
  for (const content of pr.commits) {
    fs.mkdirSync('.github/ISSUE_TEMPLATE', { recursive: true });
    fs.writeFileSync(pr.file, content + '\n');
    run('git add ' + pr.file);
    const firstLine = content.split('\n')[0].replace(/^#+\s*/, '').replace(/^---$/, 'metadata');
    const msg = `${firstLine} [skip ci]`;
    const res = run(`git commit -m "${msg}"`);
    if (!res.includes('nothing') && !res.includes('no changes')) {
      count++;
    }
  }
  
  if (count > 0) {
    run(`git push origin ${pr.name} --force`);
    const url = run(`gh pr create --repo ${REPO} --base master --head ${pr.name} --title "${pr.title}" --body "${pr.title}"`).trim();
    if (url) {
      run(`gh pr merge ${url} --repo ${REPO} --merge --delete-branch`);
      totalPRs++;
      totalCommits += count;
      console.log(`  ✓ PR ${totalPRs}: ${pr.title} (${count} commits, total: ${totalCommits})`);
    }
  }
}

console.log(`\nDone! ${totalCommits} commits, ${totalPRs} PRs`);
