// Profil de synchronisation entre appareils (téléphone, tablette, ordinateur).
// Aucune inscription : l'appli fabrique un code personnel. Le serveur ne reçoit jamais ce code,
// seulement une empreinte (id) qui en est tirée, et une progression CHIFFRÉE sur l'appareil avec une clé
// elle aussi tirée du code : sans le code, ces données sont illisibles, y compris pour nous.
// GET ?id=…      → { rev, iv, c } ou 404
// POST { id, rev, iv, c } → enregistre si rev correspond à la version actuelle (sinon 409 avec la version actuelle)
// DELETE { id }  → supprime le profil en ligne
// Chaque version est un nouveau fichier (adresse unique) : on évite ainsi de relire une ancienne version
// gardée en cache. La plus récente est trouvée par list(), qui n'est jamais mise en cache.
const { put, del, list } = require('@vercel/blob');

const ID_OK = id => typeof id === 'string' && /^[0-9a-f]{64}$/.test(id);
const dossier = id => `profils/${id}/`;

async function versions(id) {
  const { blobs } = await list({ prefix: dossier(id), limit: 100 });
  return blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}
async function lire(id) {
  const vs = await versions(id);
  if (!vs.length) return { p: null, vs };
  const r = await fetch(vs[0].url);
  if (!r.ok) throw new Error('lecture ' + r.status);
  return { p: await r.json(), vs };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Profil', '2');
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }

  if (req.method === 'GET') {
    const id = req.query && req.query.id;
    if (!ID_OK(id)) return res.status(400).json({ error: 'id' });
    const { p } = await lire(id);
    if (!p) return res.status(404).json({ error: 'aucun profil' });
    return res.status(200).json({ rev: p.rev, iv: p.iv, c: p.c });
  }

  if (req.method === 'POST') {
    const { id, rev, iv, c } = body;
    if (!ID_OK(id) || !Number.isInteger(rev) || rev < 0) return res.status(400).json({ error: 'requête' });
    if (typeof iv !== 'string' || !/^[A-Za-z0-9+/=]{16,32}$/.test(iv)) return res.status(400).json({ error: 'iv' });
    if (typeof c !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(c) || c.length > 2_000_000) return res.status(400).json({ error: 'données' });
    const { p, vs } = await lire(id);
    const curRev = p ? p.rev : 0;
    if (rev !== curRev) return res.status(409).json({ error: 'version', rev: curRev });
    const neuf = { rev: curRev + 1, iv, c, t: Date.now() };
    await put(`${dossier(id)}v${neuf.rev}.json`, JSON.stringify(neuf), {
      access: 'public', addRandomSuffix: true, contentType: 'application/json'
    });
    // On ne garde que la nouvelle version (et la précédente, par sécurité)
    const vieux = vs.slice(1).map(b => b.url);
    if (vieux.length) await del(vieux).catch(() => {});
    return res.status(200).json({ rev: neuf.rev });
  }

  if (req.method === 'DELETE') {
    const id = body.id || (req.query && req.query.id);
    if (!ID_OK(id)) return res.status(400).json({ error: 'id' });
    const vs = await versions(id);
    if (vs.length) await del(vs.map(b => b.url));
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'méthode' });
};
