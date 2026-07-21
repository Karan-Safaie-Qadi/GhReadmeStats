import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { validateToken, fetchUserStats, fetchTopLanguages, fetchStreakStats } from './github-api';
import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [langData, setLangData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (token) fetchAll(); }, []);

  async function fetchAll() {
    const t = token || localStorage.getItem('gh_token');
    if (!t) return;
    setLoading(true); setError('');
    try {
      const u = await validateToken(t);
      setUser(u);
      const [s, l, st] = await Promise.all([
        fetchUserStats(u.login, t),
        fetchTopLanguages(u.login, t),
        fetchStreakStats(u.login, t),
      ]);
      setStats(s); setLangData(l); setStreakData(st);
      localStorage.setItem('gh_token', t);
    } catch (e) {
      setError(e.message);
      if (e.message.includes('401') || e.message.toLowerCase().includes('bad credential')) {
        localStorage.removeItem('gh_token'); setToken('');
      }
    } finally { setLoading(false); }
  }

  function handleLogin(t) { setToken(t); localStorage.setItem('gh_token', t); fetchAll(); }
  function handleLogout() { setToken(''); setUser(null); setStats(null); setLangData(null); setStreakData(null); localStorage.removeItem('gh_token'); }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1>GhReadmeStats</h1>
          {user && (
            <div className="user-row">
              <img src={user.avatar} alt="" />
              <span>{user.login}</span>
              <button className="btn btn-sm btn-ghost" onClick={fetchAll} disabled={loading}>Refresh</button>
              <button className="btn btn-sm btn-ghost" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <main className="main">
        {!token ? <Login onLogin={handleLogin} /> : (
          <Dashboard user={user} stats={stats} langData={langData} streakData={streakData} loading={loading} error={error} onRefresh={fetchAll} />
        )}
      </main>
    </div>
  );
}

export default App;
