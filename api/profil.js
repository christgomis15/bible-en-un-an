// Profil de synchronisation entre appareils (téléphone, tablette, ordinateur).
// Aucune inscription : l'appli fabrique un code personnel. Le serveur ne reçoit jamais ce code,
// seulement une empreinte (id) qui en est tirée, et une progression CHIFFRÉE sur l'appareil avec une clé
// elle aussi tirée du code : sans le code, ces données sont illisibles, y compris pour nous.
// GET ?id=…      → { rev, iv, c } ou 404
// POST { id, rev, iv, c } → enregistre si rev correspond à la version actuelle (sinon 409 avec la version actuelle)
// DELETE { id }  → supprime le profil en ligne
const { put, del, head } = require('@vercel/blob');

const ID_OK = id => typeof id === 'string' && /^[0-9a-f]{64}$/.test(id);
const chemin = id => `profils/${id}.json`;

async function lire(id) {
  let h;
  try { h = await head(chemin(id)); } catch (e) { return null; } // pas encore de profil
  const r = await fetch(h.url + '?t=' + Date.now(), { cache: 'no-store' });
  if (!r.ok) return null;
  return r.json();
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }

  if (req.method === 'GET') {
    const id = req.query && req.query.id;
    if (!ID_OK(id)) return res.status(400).json({ error: 'id' });
    const p = await lire(id);
    if (!p) return res.status(404).json({ error: 'aucun profil' });
    return res.status(200).json({ rev: p.rev, iv: p.iv, c: p.c });
  }

  if (req.method === 'POST') {
    const { id, rev, iv, c } = body;
    if (!ID_OK(id) || !Number.isInteger(rev) || rev < 0) return res.status(400).json({ error: 'requête' });
    if (typeof iv !== 'string' || !/^[A-Za-z0-9+/=]{16,32}$/.test(iv)) return res.status(400).json({ error: 'iv' });
    if (typeof c !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(c) || c.length > 2_000_000) return res.status(400).json({ error: 'données' });
    const cur = await lire(id);
    const curRev = cur ? cur.rev : 0;
    if (rev !== curRev) return res.status(409).json({ error: 'version', rev: curRev });
    const neuf = { rev: curRev + 1, iv, c, t: Date.now() };
    await put(chemin(id), JSON.stringify(neuf), {
      access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60
    });
    return res.status(200).json({ rev: neuf.rev });
  }

  if (req.method === 'DELETE') {
    const id = body.id || (req.query && req.query.id);
    if (!ID_OK(id)) return res.status(400).json({ error: 'id' });
    try { const h = await head(chemin(id)); await del(h.url); } catch (e) { /* déjà supprimé */ }
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'méthode' });
};
