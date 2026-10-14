const ALLOWED_ORIGIN = 'https://jaehyeonghwang.github.io';
const MAX_ACTION_LENGTH = 80;
const MAX_PATH_LENGTH = 500;
const MAX_TARGET_LENGTH = 500;

function corsHeaders(origin = ALLOWED_ORIGIN) {
  return {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
    'Vary': 'Origin'
  };
}

function json(data, status = 200, origin) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) });
}

function authorized(request, env) {
  const header = request.headers.get('Authorization') || '';
  return Boolean(env.ADMIN_TOKEN) && header === `Bearer ${env.ADMIN_TOKEN}`;
}

async function collect(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const action = typeof body.action === 'string' ? body.action.slice(0, MAX_ACTION_LENGTH) : '';
  const path = typeof body.path === 'string' ? body.path.slice(0, MAX_PATH_LENGTH) : '/';
  const target = typeof body.target === 'string' ? body.target.slice(0, MAX_TARGET_LENGTH) : null;
  const allowedActions = new Set(['page_view', 'menu_click', 'publication_click', 'cv_download', 'external_link', 'award_hover']);
  if (!allowedActions.has(action)) return json({ error: 'Unsupported action' }, 400);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  await env.DB.prepare(
    'INSERT INTO events (occurred_at, ip, action, path, target) VALUES (?, ?, ?, ?, ?)'
  ).bind(new Date().toISOString(), ip, action, path, target).run();
  return json({ ok: true });
}

async function report(request, env) {
  if (!authorized(request, env)) return json({ error: 'Unauthorized' }, 401);
  const [daily, totals, recent] = await Promise.all([
    env.DB.prepare('SELECT substr(occurred_at, 1, 10) AS day, COUNT(*) AS events, COUNT(DISTINCT ip) AS visitors FROM events GROUP BY day ORDER BY day DESC LIMIT 90').all(),
    env.DB.prepare('SELECT COUNT(*) AS events, COUNT(DISTINCT ip) AS visitors FROM events').first(),
    env.DB.prepare('SELECT occurred_at, ip, action, path, target FROM events ORDER BY id DESC LIMIT 500').all()
  ]);
  return json({ daily: daily.results, totals, recent: recent.results });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin')) });
    try {
      if (url.pathname === '/collect' && request.method === 'POST') return collect(request, env);
      if (url.pathname === '/report' && request.method === 'GET') return report(request, env);
      return json({ error: 'Not found' }, 404);
    } catch (error) {
      return json({ error: 'Server error' }, 500);
    }
  }
};
