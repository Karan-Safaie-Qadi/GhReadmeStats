const WAKATIME_API = 'https://wakatime.com/api/v1';

export async function fetchWakaTimeStats(apiKey, range = 'last_7_days') {
  if (!apiKey) throw new Error('WAKATIME_API_KEY is required');

  const encoded = btoa(apiKey);
  const resp = await fetch(`${WAKATIME_API}/users/current/stats/${range}`, {
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
  });

  if (!resp.ok) {
    throw new Error(`WakaTime API error: ${resp.status} ${resp.statusText}`);
  }

  const json = await resp.json();
  const data = json.data;

  if (!data) {
    throw new Error('WakaTime: no data returned');
  }

  const totalSeconds = data.total_seconds || 0;
  const languages = (data.languages || []).slice(0, 5).map((l) => ({
    name: l.name,
    percent: l.percent || 0,
    totalSeconds: l.total_seconds || 0,
    color: l.color || '#858585',
    text: l.text || '0 hrs 0 mins',
  }));

  const editors = (data.editors || []).slice(0, 3).map((e) => ({
    name: e.name,
    percent: e.percent || 0,
    text: e.text || '0 hrs 0 mins',
  }));

  return {
    totalSeconds,
    totalHours: (totalSeconds / 3600).toFixed(1),
    dailyAverage: data.daily_average ? (data.daily_average / 3600).toFixed(1) : '0',
    languages,
    editors,
    range: data.range || range,
    username: data.username || 'unknown',
  };
}
