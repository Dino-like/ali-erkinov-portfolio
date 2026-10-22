const COLORS = new Set(['butter', 'pink', 'mint', 'blue']);
const FIELDS = 'id, text, name, color, created_at';
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const origins = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};
    if (origins.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
    const reply = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), {status, headers:{...headers,...extra}});
    if (request.method === 'OPTIONS') return new Response(null, {status:origins.includes(origin) ? 204 : 403,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'3600'}});
    if (new URL(request.url).pathname !== '/api/notes') return reply({error:'Не найдено'},404);
    try {
      if (request.method === 'GET') {
        const {results} = await env.DB.prepare(`SELECT ${FIELDS} FROM notes ORDER BY created_at DESC, id DESC LIMIT 200`).all();
        return reply({notes:results});
      }
      if (request.method !== 'POST') return reply({error:'Метод не поддерживается'},405,{'Allow':'GET, POST, OPTIONS'});
      if (!origins.includes(origin)) return reply({error:'Источник запроса не разрешён'},403);
      if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) return reply({error:'Нужен JSON'},415);
      if (Number(request.headers.get('Content-Length')) > 4096) return reply({error:'Слишком большой запрос'},413);
      const raw = await request.text(); if (raw.length > 4096) return reply({error:'Слишком большой запрос'},413);
      let body; try { body = JSON.parse(raw); } catch { return reply({error:'Не удалось прочитать сообщение'},400); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({error:'Не удалось прочитать сообщение'},400);
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      if (body.website || !Number.isFinite(body.startedAt) || Date.now()-body.startedAt < 1500) return reply({error:'Попробуй отправить сообщение чуть позже'},400);
      if (text.length < 3 || text.length > 240 || name.length > 32 || !COLORS.has(body.color) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text+name)) return reply({error:'Напиши от 3 до 240 символов, имя – до 32'},400);
      if (!env.IP_SALT) return reply({error:'Стена ещё не подключена'},503);
      const now = Date.now(), ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const bytes = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env.IP_SALT+Math.floor(now/86400000)+ip));
      const hash = Array.from(new Uint8Array(bytes), b=>b.toString(16).padStart(2,'0')).join('');
      const id = crypto.randomUUID();
      const result = await env.DB.prepare(`INSERT INTO notes (id,text,name,color,created_at,ip_hash) SELECT ?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM notes WHERE ip_hash=? AND created_at>?) < 5 AND NOT EXISTS (SELECT 1 FROM notes WHERE ip_hash=? AND created_at>?) AND NOT EXISTS (SELECT 1 FROM notes WHERE text=? AND created_at>?)`).bind(id,text,name,body.color,now,hash,hash,now-3600000,hash,now-60000,text,now-600000).run();
      if (!result.meta.changes) return reply({error:'Этот стикер уже есть или ты пишешь слишком часто. Попробуй через минуту.'},429,{'Retry-After':'60'});
      return reply({note:{id,text,name,color:body.color,created_at:now}},201);
    } catch { return reply({error:'Не получилось загрузить стену. Попробуй позже.'},503); }
  }
};
