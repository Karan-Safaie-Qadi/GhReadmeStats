CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id INTEGER UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  name TEXT,
  access_token TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS oauth_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state TEXT UNIQUE NOT NULL,
  user_id INTEGER,
  redirect_uri TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS stats_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id INTEGER UNIQUE NOT NULL,
  raw_json TEXT NOT NULL,
  commits INTEGER DEFAULT 0,
  prs INTEGER DEFAULT 0,
  issues INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  contributed_to INTEGER DEFAULT 0,
  repos INTEGER DEFAULT 0,
  fetched_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (github_id) REFERENCES users(github_id)
);
