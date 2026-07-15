

$repo = "Karan-Safaie-Qadi/GhReadmeStats"

$prs = @(
    @{name="docs-contributing"; title="Add contributing guidelines"; body="Contributing guide for contributors";
      file="CONTRIBUTING.md"; sections=@(
        "# Contributing`n`nThank you for considering contributing!",
        "## Getting Started`n`n1. Fork the repository`n2. Create a feature branch`n3. Make your changes",
        "## Development Setup`n`n1. Clone your fork`n2. Run `npm install``n3. Run `npm test`",
        "## Coding Standards`n`n- Follow existing code style`n- Add tests for new features`n- Update documentation",
        "## Pull Request Process`n`n1. Update the README if needed`n2. Run all tests`n3. Submit your PR",
        "## Code of Conduct`n`nPlease follow our Code of Conduct in all interactions.",
        "## Questions?`n`nOpen an issue for any questions or concerns."
      )},
    @{name="docs-code-of-conduct"; title="Add code of conduct"; body="Community standards and guidelines";
      file="CODE_OF_CONDUCT.md"; sections=@(
        "# Code of Conduct`n`n## Our Pledge",
        "We pledge to make participation in our project a harassment-free experience.",
        "## Our Standards`n`n- Using welcoming language`n- Being respectful of differing viewpoints",
        "## Enforcement`n`nProject maintainers are responsible for clarifying standards.",
        "## Scope`n`nThis Code of Conduct applies within all community spaces.",
        "## Enforcement Responsibilities`n`nMaintainers will review and investigate complaints.",
        "## Attribution`n`nThis Code of Conduct is adapted from the Contributor Covenant."
      )},
    @{name="docs-changelog"; title="Add changelog and version history"; body="Track project changes over time";
      file="CHANGELOG.md"; sections=@(
        "# Changelog`n`n## [1.0.0] - Unreleased",
        "### Added`n- Initial release with stats, top-langs, and streak cards`n- 50+ themes",
        "### Features`n- SVG card generation via API`n- Static SVG export for GitHub Pages",
        "### API Endpoints`n- /api/stats - GitHub statistics`n- /api/top-langs - Language breakdown`n- /api/streak - Contribution streak",
        "### Configuration`n- Multiple theme support`n- Custom colors via query params`n- Hide/show individual stats",
        "### Deployment`n- Cloudflare Pages with Workers`n- GitHub Pages for static SVGs",
        "### Documentation`n- Comprehensive README`n- API reference`n- Theme list and customization guide"
      )},
    @{name="docs-security"; title="Add security policy"; body="Security vulnerability reporting";
      file="SECURITY.md"; sections=@(
        "# Security Policy`n`n## Supported Versions",
        "We support the latest version with security updates.",
        "## Reporting a Vulnerability`n`nReport vulnerabilities by opening an issue.",
        "## Process`n`n1. Report the issue privately`n2. We will investigate`n3. Fix is deployed",
        "## Disclosure Policy`n`nWe follow responsible disclosure practices.",
        "## Recognition`n`nWe thank reporters who help keep our project secure.",
        "## Contact`n`nFor urgent security issues, please open a GitHub issue."
      )}
)

$totalC = 0
$totalP = 0

foreach ($pr in $prs) {
    git checkout master 2>$null
    git branch -D $pr.name 2>$null
    git checkout -b $pr.name 2>$null

    $c = 0
    foreach ($sec in $pr.sections) {
        $content = Get-Content $pr.file -Raw -ErrorAction SilentlyContinue
        if (-not $content) { $content = "" }
        $content += "`n$sec`n"
        Set-Content -Path $pr.file -Value $content -NoNewline
        git add $pr.file 2>$null
        $parts = ($sec -split "`n")[0] -replace "^#+\s*", ""
        if (-not $parts) { $parts = "Update $pr.file" }
        $msg = "$parts [skip ci]"
        git commit -m $msg 2>$null
        if ($LASTEXITCODE -eq 0) { $c++ }
    }

    if ($c -gt 0) {
        git push origin $pr.name --force 2>$null
        $url = gh pr create --repo $repo --base master --head $pr.name --title $pr.title --body $pr.body 2>&1
        if ($LASTEXITCODE -eq 0 -and $url) {
            gh pr merge $url --repo $repo --merge --delete-branch 2>$null
            $totalP++
            $totalC += $c
            Write-Host "✓ $($pr.title): $c commits ($totalC / 258)"
        }
    }
    git checkout master 2>$null
}

Write-Host "`nDone: $totalC commits, $totalP PRs"

