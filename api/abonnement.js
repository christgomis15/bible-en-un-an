// Enregistre (POST) ou supprime (DELETE) l'abonnement aux notifications d'un appareil.
// Seules sont conservées : l'adresse technique de notification du navigateur, le fuseau horaire et la plage d'heures.
const crypto = require('crypto');
const { put, del, list } = require('@vercel/blob');

const heure = (v, def) => (Number.isInteger(v) && v >= 0 && v <= 23 ? v : def);
function fuseau(tz) {
  try { new Intl.DateTimeFormat('fr', { timeZone: tz }); return tz; } catch (e) { return 'Europe/Paris'; }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'DELETE') return res.status(405).json({ error: 'méthode' });
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const s = body.subscription || {};
  if (typeof s.endpoint !== 'string' || !s.endpoint.startsWith('https://') || s.endpoint.length > 1000 ||
      !s.keys || typeof s.keys.p256dh !== 'string' || typeof s.keys.auth !== 'string')
    return res.status(400).json({ error: 'abonnement invalide' });

  const id = crypto.createHash('sha256').update(s.endpoint).digest('hex').slice(0, 40);
  const chemin = `abonnements/${id}.json`;

  if (req.method === 'DELETE') {
    const { blobs } = await list({ prefix: chemin });
    if (blobs.length) await del(blobs.map(b => b.url));
    return res.status(200).json({ ok: true });
  }

  const data = {
    subscription: { endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth } },
    tz: fuseau(body.tz), from: heure(body.from, 7), to: heure(body.to, 21)
  };
  await put(chemin, JSON.stringify(data), {
    access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60
  });
  res.status(200).json({ ok: true });
};
