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

  useEffect(() => {
    if (token) {
      localStorage.setItem('gh_token', token);
      fetchData();
    }
  }, []);

  async function fetchData() {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const u = await validateToken(token);
      setUser(u);
      const s = await fetchUserStats(u.login, token);
      setStats(s);
      const l = await fetchTopLanguages(u.login, token);
      setLangData(l);
      const st = await fetchStreakStats(u.login, token);
      setStreakData(st);
    } catch (e) {
      setError(e.message);
      if (e.message.includes('401') || e.message.includes('Bad credentials')) {
        setToken('');
        localStorage.removeItem('gh_token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(newToken) {
    setToken(newToken);
    localStorage.setItem('gh_token', newToken);
    fetchData();
  }

  function handleLogout() {
    setToken('');
    setUser(null);
    setStats(null);
    setLangData(null);
    setStreakData(null);
    localStorage.removeItem('gh_token');
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>GhReadmeStats Dashboard</h1>
          {user && (
            <div className="user-info">
              <img src={user.avatar} alt="" className="user-avatar" />
              <span>@{user.login}</span>
              <button className="btn btn-sm" onClick={fetchData} disabled={loading}>Refresh</button>
              <button className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <main className="main">
        {!token ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Dashboard
            user={user}
            stats={stats}
            langData={langData}
            streakData={streakData}
            token={token}
            loading={loading}
            error={error}
            onRefresh={fetchData}
          />
        )}
      </main>
    </div>
  );
}

export default App;
