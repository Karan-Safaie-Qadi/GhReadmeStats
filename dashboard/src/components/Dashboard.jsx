import { useState, useEffect, useMemo } from 'react';

const THEMES = ['default', 'dark', 'radical', 'tokyonight', 'dracula', 'nord', 'merko', 'synthwave', 'gruvbox', 'github_dark'];

function Dashboard({ user, stats, langData, streakData, token, loading, error, onRefresh }) {
  const [theme, setTheme] = useState('dark');
  const [hideRank, setHideRank] = useState(false);
  const [showIcons, setShowIcons] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [cardType, setCardType] = useState('stats');
  const [svgStr, setSvgStr] = useState('');

  useEffect(() => {
    if (!stats) return;
    generateSvg();
  }, [stats, theme, hideRank, showIcons, hideBorder, cardType]);

  async function generateSvg() {
    if (!stats) return;
    try {
      const { getTheme, applyCustomColors } = await import('@core/themes.js');
      const { renderStatsCard } = await import('@core/cards/stats.js');
      const { renderTopLangsCard } = await import('@core/cards/top-langs.js');
      const { renderStreakCard } = await import('@core/cards/streak.js');

      const themeObj = applyCustomColors(getTheme(theme), {});

      let svg;
      switch (cardType) {
        case 'stats':
          svg = renderStatsCard(stats, themeObj, {
            hide_rank: hideRank,
            show_icons: showIcons,
            hide_border: hideBorder,
            include_all_commits: true,
          });
          break;
        case 'top-langs':
          svg = renderTopLangsCard(langData || { langs: [] }, themeObj, {});
          break;
        case 'streak':
          svg = renderStreakCard(streakData || {}, themeObj, {});
          break;
      }
      setSvgStr(svg);
    } catch (e) {
      console.error('SVG render error:', e);
    }
  }

  const markdown = useMemo(() => {
    if (!user || !svgStr) return '';
    const sizes = { stats: '', 'top-langs': '', streak: '' };
    return `![${user.login}'s GitHub Stats](https://gh-readme-stats.pages.dev/api/${cardType}?username=${user.login}&theme=${theme}${showIcons ? '&show_icons=true' : ''}${hideRank ? '&hide_rank=true' : ''}${hideBorder ? '&hide_border=true' : ''})`;
  }, [user, cardType, theme, showIcons, hideRank, hideBorder]);

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Fetching your GitHub data...</p></div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn" onClick={onRefresh}>Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="dashboard">
      <section className="stats-overview">
        <h2>Your GitHub Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card"><span className="stat-value">{stats.totalCommits?.toLocaleString()}</span><span className="stat-label">Total Commits</span></div>
          <div className="stat-card"><span className="stat-value">{stats.totalPRs}</span><span className="stat-label">Pull Requests</span></div>
          <div className="stat-card"><span className="stat-value">{stats.totalIssues}</span><span className="stat-label">Issues</span></div>
          <div className="stat-card"><span className="stat-value">{stats.totalStars}</span><span className="stat-label">Stars Earned</span></div>
          <div className="stat-card"><span className="stat-value">{stats.followers}</span><span className="stat-label">Followers</span></div>
          <div className="stat-card"><span className="stat-value">{stats.contributedTo}</span><span className="stat-label">Contributed To</span></div>
        </div>
      </section>

      <section className="card-customizer">
        <h2>Customize Your Card</h2>
        <div className="customizer-layout">
          <div className="customizer-controls">
            <div className="control-group">
              <label>Card Type</label>
              <select value={cardType} onChange={e => setCardType(e.target.value)}>
                <option value="stats">Stats Card</option>
                <option value="top-langs">Top Languages</option>
                <option value="streak">Streak Card</option>
              </select>
            </div>
            <div className="control-group">
              <label>Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {cardType === 'stats' && <>
              <div className="control-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={showIcons} onChange={e => setShowIcons(e.target.checked)} />
                  Show Icons
                </label>
              </div>
              <div className="control-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={hideRank} onChange={e => setHideRank(e.target.checked)} />
                  Hide Rank
                </label>
              </div>
              <div className="control-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={hideBorder} onChange={e => setHideBorder(e.target.checked)} />
                  Hide Border
                </label>
              </div>
            </>}
          </div>
          <div className="customizer-preview">
            <div className="card-frame" dangerouslySetInnerHTML={{ __html: svgStr }} />
            <div className="markdown-code">
              <label>Markdown Code</label>
              <textarea readOnly value={markdown} onClick={e => e.target.select()} />
              <button className="btn btn-sm" onClick={() => navigator.clipboard?.writeText(markdown)}>Copy</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
