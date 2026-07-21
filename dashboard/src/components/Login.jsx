import { useState } from 'react';
import { validateToken } from '../github-api';

function Login({ onLogin }) {
  const [val, setVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!val.trim()) return;
    setLoading(true); setErr('');
    try {
      await validateToken(val.trim());
      onLogin(val.trim());
    } catch (e) { setErr(e.message || 'Invalid token'); }
    finally { setLoading(false); }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <svg width="48" height="48" viewBox="0 0 16 16" fill="#2f81f7" style={{ marginBottom: 14 }}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        <h2>GhReadmeStats</h2>
        <p className="sub">Paste your GitHub Personal Access Token to view and customize your stats cards.</p>
        <form onSubmit={submit} className="token-form">
          <input type="password" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" value={val} onChange={e => setVal(e.target.value)} autoFocus />
          <button type="submit" className="btn btn-accent" disabled={loading || !val.trim()}>{loading ? 'Verifying…' : 'Continue'}</button>
        </form>
        {err && <p className="err">{err}</p>}
        <p className="footnote">
          Token stored in your browser only. Sent directly to GitHub API.<br />
          <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">Create token</a> with <code>repo</code> + <code>read:user</code> scopes.
        </p>
      </div>
    </div>
  );
}

export default Login;
