import { useState, useEffect, useCallback, useRef } from 'react';

const THEMES = ['default', 'dark', 'radical', 'tokyonight', 'dracula', 'nord', 'merko', 'synthwave', 'gruvbox', 'github_dark'];

function Dashboard({ user, stats, langData, streakData, loading, error, onRefresh }) {
  const [theme, setTheme] = useState('dark');
  const [hideRank, setHideRank] = useState(false);
  const [showIcons, setShowIcons] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [cardType, setCardType] = useState('stats');
  const [svgData, setSvgData] = useState('');
  const imgRef = useRef(null);

  const gen = useCallback(async () => {
    if (!stats) return;
    try {
      const [th, sc, tc, st] = await Promise.all([
        import('@core/themes.js'),
        import('@core/cards/stats.js'),
        import('@core/cards/top-langs.js'),
        import('@core/cards/streak.js'),
      ]);
      const themeObj = th.applyCustomColors(th.getTheme(theme), {});
      let svg;
      switch (cardType) {
        case 'stats': svg = sc.renderStatsCard(stats, themeObj, { hide_rank: hideRank, show_icons: showIcons, hide_border: hideBorder, include_all_commits: true }); break;
        case 'top-langs': svg = tc.renderTopLangsCard(langData || { langs: [] }, themeObj, {}); break;
        case 'streak': svg = st.renderStreakCard(streakData || {}, themeObj, {}); break;
      }
      setSvgData(`data:image/svg+xml,${encodeURIComponent(svg)}`);
    } catch (e) { console.error(e); }
  }, [stats, langData, streakData, cardType, theme, hideRank, showIcons, hideBorder]);

  useEffect(() => { gen(); }, [gen]);

  const md = stats ? `![${user.login}'s GitHub Stats](https://gh-readme-stats.pages.dev/api/${cardType}?username=${user.login}&theme=${theme}${showIcons ? '&show_icons=true' : ''}${hideRank ? '&hide_rank=true' : ''}${hideBorder ? '&hide_border=true' : ''})` : '';

  if (loading) return <div className="loading"><div className="spinner" /><p>Loading your GitHub data…</p></div>;
  if (error) return <div className="error-box"><h3>Error</h3><p>{error}</p><button className="btn btn-primary" onClick={onRefresh}>Retry</button></div>;
  if (!stats) return null;

  return (
    <div className="dash">
      <div className="card">
        <div className="card-title">Statistics</div>
        <div className="grid">
          {[
            ['Commits', stats.totalCommits?.toLocaleString()],
            ['Pull Requests', stats.totalPRs],
            ['Issues', stats.totalIssues],
            ['Stars', stats.totalStars],
            ['Followers', stats.followers],
            ['Repositories', stats.contributedTo],
          ].map(([l, v]) => (
            <div key={l} className="stat"><span className="num">{v}</span><span className="lbl">{l}</span></div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Card Preview</div>
        <div className="row">
          <div className="sidebar">
            <div><label>Type</label><select value={cardType} onChange={e => setCardType(e.target.value)}><option value="stats">Stats</option><option value="top-langs">Top Languages</option><option value="streak">Streak</option></select></div>
            <div><label>Theme</label><select value={theme} onChange={e => setTheme(e.target.value)}>{THEMES.map(t => <option key={t}>{t}</option>)}</select></div>
            {cardType === 'stats' && <>
              <label className="cb"><input type="checkbox" checked={showIcons} onChange={e => setShowIcons(e.target.checked)} />Icons</label>
              <label className="cb"><input type="checkbox" checked={hideRank} onChange={e => setHideRank(e.target.checked)} />Hide rank</label>
              <label className="cb"><input type="checkbox" checked={hideBorder} onChange={e => setHideBorder(e.target.checked)} />Hide border</label>
            </>}
          </div>
          <div className="preview">
            <div className="preview-box">
              {svgData ? <img ref={imgRef} src={svgData} alt="Card preview" /> : <div className="spinner" />}
            </div>
            <div className="code-box">
              <label>Markdown code — paste in your profile README</label>
              <div className="code-row">
                <textarea readOnly value={md} onClick={e => e.target.select()} />
                <button className="btn btn-sm btn-primary" onClick={() => navigator.clipboard?.writeText(md)}>Copy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
