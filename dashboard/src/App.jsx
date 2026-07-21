import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || '';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user_id');
    const username = params.get('username');
    if (userId && username) {
      setPage('dashboard');
      setUser({ id: userId, username });
      fetchStats(userId, username);
    }
  }, []);

  async function fetchStats(userId, username) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/stats?user_id=${userId}&username=${username}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        if (data.error.includes('login')) setPage('login');
      } else {
        setStats(data);
      }
    } catch (e) {
      setError('Failed to fetch stats. The API may be blocked in your region.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogin() {
    window.location.href = `${API_BASE}/api/auth/login?redirect_uri=${encodeURIComponent(window.location.origin + window.location.pathname + '?page=dashboard')}`;
  }

  function handleRefresh() {
    if (user) fetchStats(user.id, user.username);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>GhReadmeStats Dashboard</h1>
          {user && (
            <div className="user-info">
              <span>@{user.username}</span>
              <button className="btn btn-sm" onClick={handleRefresh}>Refresh</button>
              <button className="btn btn-sm btn-outline" onClick={() => { setPage('login'); setUser(null); setStats(null); }}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <main className="main">
        {page === 'login' && <Login onLogin={handleLogin} />}
        {page === 'dashboard' && (
          <Dashboard
            user={user}
            stats={stats}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            apiBase={API_BASE}
          />
        )}
      </main>
    </div>
  );
}

export default App;
