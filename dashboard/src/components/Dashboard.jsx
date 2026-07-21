import { useState, useEffect, useRef, useCallback } from 'react';

const THEMES = ['default', 'dark', 'radical', 'tokyonight', 'dracula', 'nord', 'merko', 'synthwave', 'gruvbox', 'github_dark'];

function Dashboard({ user, stats, langData, streakData, loading, error, onRefresh }) {
  const [theme, setTheme] = useState('dark');
  const [hideRank, setHideRank] = useState(false);
  const [showIcons, setShowIcons] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [cardType, setCardType] = useState('stats');
  const [svgUrl, setSvgUrl] = useState('');
  const urlRef = useRef(null);

  const generate = useCallback(async () => {
    if (!stats) return;
    try {
      const [{ getTheme, applyCustomColors }, { renderStatsCard }, { renderTopLangsCard }, { renderStreakCard }] =
        await Promise.all([
          import('@core/themes.js'),
          import('@core/cards/stats.js'),
          import('@core/cards/top-langs.js'),
          import('@core/cards/streak.js'),
        ]);

      const themeObj = applyCustomColors(getTheme(theme), {});

      let svg;
      switch (cardType) {
        case 'stats':
          svg = renderStatsCard(stats, themeObj, {
            hide_rank: hideRank, show_icons: showIcons,
            hide_border: hideBorder, include_all_commits: true,
          });
          break;
        case 'top-langs':
          svg = renderTopLangsCard(langData || { langs: [] }, themeObj, {});
          break;
        case 'streak':
          svg = renderStreakCard(streakData || {}, themeObj, {});
          break;
      }

      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setSvgUrl(url);
    } catch (e) {
      console.error('SVG render error:', e);
    }
  }, [stats, langData, streakData, cardType, theme, hideRank, showIcons, hideBorder]);

  useEffect(() => { generate(); }, [generate]);

  useEffect(() => {
    return () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); };
  }, []);

  const markdown = stats ? `![${user.login}'s GitHub Stats](https://gh-readme-stats.pages.dev/api/${cardType}?username=${user.login}&theme=${theme}${showIcons ? '&show_icons=true' : ''}${hideRank ? '&hide_rank=true' : ''}${hideBorder ? '&hide_border=true' : ''})` : '';

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Fetching your GitHub data…</p></div>;
  }

  if (error) {
    return (
      <div className="error-box">
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={onRefresh}>Try again</button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="dashboard">
      <div className="section">
        <h2>Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item"><span className="val">{stats.totalCommits?.toLocaleString()}</span><span className="lbl">Commits</span></div>
          <div className="stat-item"><span className="val">{stats.totalPRs}</span><span className="lbl">Pull Requests</span></div>
          <div className="stat-item"><span className="val">{stats.totalIssues}</span><span className="lbl">Issues</span></div>
          <div className="stat-item"><span className="val">{stats.totalStars}</span><span className="lbl">Stars</span></div>
          <div className="stat-item"><span className="val">{stats.followers}</span><span className="lbl">Followers</span></div>
          <div className="stat-item"><span className="val">{stats.contributedTo}</span><span className="lbl">Repositories</span></div>
        </div>
      </div>

      <div className="section">
        <h2>Card Preview</h2>
        <div className="customizer">
          <div className="controls">
            <div>
              <label>Type</label>
              <select value={cardType} onChange={e => setCardType(e.target.value)}>
                <option value="stats">Stats</option>
                <option value="top-langs">Top Languages</option>
                <option value="streak">Streak</option>
              </select>
            </div>
            <div>
              <label>Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {cardType === 'stats' && <>
              <label className="cb-label"><input type="checkbox" checked={showIcons} onChange={e => setShowIcons(e.target.checked)} /> Show Icons</label>
              <label className="cb-label"><input type="checkbox" checked={hideRank} onChange={e => setHideRank(e.target.checked)} /> Hide Rank</label>
              <label className="cb-label"><input type="checkbox" checked={hideBorder} onChange={e => setHideBorder(e.target.checked)} /> Hide Border</label>
            </>}
          </div>
          <div className="preview-area">
            <div className="card-box">
              {svgUrl ? <object data={svgUrl} type="image/svg+xml" aria-label="Card preview" style={{ maxWidth: '100%' }} /> : <div className="spinner" />}
            </div>
            <div className="markdown-box">
              <label>Markdown code — paste this in your profile README</label>
              <div className="markdown-row">
                <textarea readOnly value={markdown} onClick={e => e.target.select()} />
                <button className="btn btn-sm btn-primary" onClick={() => navigator.clipboard?.writeText(markdown)}>Copy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
