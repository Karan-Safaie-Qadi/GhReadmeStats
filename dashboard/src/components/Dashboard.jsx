import { useState, useEffect } from 'react';

const THEMES = ['default', 'dark', 'radical', 'tokyonight', 'dracula', 'nord', 'merko', 'synthwave', 'gruvbox', 'github_dark'];

function Dashboard({ user, stats, loading, error, onRefresh, apiBase }) {
  const [theme, setTheme] = useState('dark');
  const [hideRank, setHideRank] = useState(false);
  const [showIcons, setShowIcons] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [cardType, setCardType] = useState('stats');
  const [cardUrl, setCardUrl] = useState('');

  useEffect(() => {
    updateCardUrl();
  }, [theme, hideRank, showIcons, hideBorder, cardType, user]);

  function updateCardUrl() {
    if (!user) return;
    const params = new URLSearchParams({
      username: user.username,
      type: cardType,
      theme,
      user_id: user.id,
    });
    if (hideRank) params.set('hide_rank', 'true');
    if (showIcons) params.set('show_icons', 'true');
    if (hideBorder) params.set('hide_border', 'true');
    setCardUrl(`${apiBase}/api/dashboard/cards?${params.toString()}`);
  }

  function getMarkdown() {
    return `![${user.username}'s GitHub Stats](${cardUrl})`;
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Fetching your GitHub stats...</p></div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn" onClick={onRefresh}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="loading"><p>Loading...</p></div>;
  }

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
          </div>
          <div className="customizer-preview">
            <div className="card-frame">
              <img src={cardUrl} alt="Card preview" />
            </div>
            <div className="markdown-code">
              <label>Markdown Code</label>
              <textarea readOnly value={getMarkdown()} onClick={e => e.target.select()} />
              <button className="btn btn-sm" onClick={() => navigator.clipboard?.writeText(getMarkdown())}>Copy</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
