// Envoie la parole de Dieu à chaque appareil abonné, aux heures qu'il a choisies (6 h, 12 h et 18 h par défaut).
// Appelé toutes les heures (cron Vercel). Un seul envoi par heure, même si l'adresse est appelée plusieurs fois.
const webpush = require('web-push');
const { put, del, list, head } = require('@vercel/blob');
const VERSETS = require('./_versets.js');
const PLAN = require('./_plan.js'); // [titre, minutes] des 312 lectures
const VAPID_APPLI = 'BGznV46AK-R3uZDIjAiCMBf3X_2aOv5CAx9nSAa0-ULbrH-bD7efKeq2lykVg6K5aaDvOV9Jprd-DjvgaquZkv8'; // = VAPID_PUBLIC dans app.js

// Même calcul que versetDeLheure() dans app.js
function verset(y, m, d, h) {
  const jour = Math.floor(Date.UTC(y, m - 1, d) / 864e5);
  return VERSETS[((jour * 24 + h) * 47) % VERSETS.length]; // ×47 : mélange l'ordre des versets
}
function heureLocale(now, tz) {
  const p = {};
  for (const x of new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', hourCycle: 'h23' }).formatToParts(now)) p[x.type] = +x.value;
  return p;
}
// Numéro du jour de lecture (du lundi au samedi depuis la date de départ), comme stateOn() dans app.js ; null le dimanche ou hors plan
function jourDuPlan(start, y, m, d) {
  const [sy, sm, sd] = start.split('-').map(Number);
  const a = Date.UTC(sy, sm - 1, sd) / 864e5, b = Date.UTC(y, m - 1, d) / 864e5;
  if (b < a || new Date(b * 864e5).getUTCDay() === 0) return null;
  let n = 0; for (let x = a; x <= b; x++) if (new Date(x * 864e5).getUTCDay() !== 0) n++;
  return n >= 1 && n <= PLAN.length ? n : null;
}
// Anciens abonnements (plage from/to) : on applique le nouveau défaut, 3 versets par jour
const heuresDe = a => (Array.isArray(a.hours) && a.hours.length ? a.hours : [6, 12, 18]);

async function tousLesAbonnements() {
  const out = []; let cursor;
  do { const r = await list({ prefix: 'abonnements/', cursor, limit: 1000 }); out.push(...r.blobs); cursor = r.cursor; } while (cursor);
  return out;
}

module.exports = async (req, res) => {
  const pub = (process.env.VAPID_PUBLIC || '').trim(), priv = (process.env.VAPID_PRIVATE || '').trim();
  if (!pub || !priv) return res.status(500).json({ error: 'clés VAPID manquantes' });
  // Vérifie que la clé privée correspond bien à la clé publique (erreur de copier-coller)
  let derivee = '';
  try { const e = require('crypto').createECDH('prime256v1'); e.setPrivateKey(Buffer.from(priv, 'base64url')); derivee = e.getPublicKey().toString('base64url'); } catch (e) { /* clé illisible */ }
  if (derivee !== pub) return res.status(500).json({ error: 'clés VAPID incohérentes' });
  if (pub !== VAPID_APPLI) return res.status(500).json({ error: 'clé publique différente de celle de l’appli' });
  webpush.setVapidDetails('https://bible-en-un-an.vercel.app', pub, priv);
  if (req.query && req.query.verifier !== undefined) return res.status(200).json({ ok: true, cles: 'valides' });

  const now = new Date();
  const cle = `envois/${now.toISOString().slice(0, 13)}.json`;
  try { await head(cle); return res.status(200).json({ ok: true, deja: true }); } catch (e) { /* pas encore envoyé */ }
  await put(cle, '{}', { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' });
  const blobs = await tousLesAbonnements();
  let envoyes = 0, rappels = 0, supprimes = 0, erreurs = 0;

  for (let i = 0; i < blobs.length; i += 50) {
    await Promise.all(blobs.slice(i, i + 50).map(async b => {
      try {
        const a = await (await fetch(b.url + '?t=' + now.getTime())).json();
        const t = heureLocale(now, a.tz);
        // Rappel de la lecture du jour, sauf si elle est déjà lue
        if (a.lecture && a.lecture.h === t.hour) {
          const n = jourDuPlan(a.lecture.start, t.year, t.month, t.day);
          if (n && !(a.lecture.lus || []).includes(n)) {
            const [titre, min] = PLAN[n - 1];
            await webpush.sendNotification(a.subscription, JSON.stringify({ type: 'lecture', title: '📖 Lecture du jour', body: `${titre} · environ ${min} min. Bonne lecture !` }), { TTL: 3000 });
            rappels++;
          }
        }
        if (a.versets === false || !heuresDe(a).includes(t.hour)) return;
        const v = verset(t.year, t.month, t.day, t.hour);
        await webpush.sendNotification(a.subscription, JSON.stringify({ title: `Parole de Dieu · ${v.r}`, body: v.t }), { TTL: 3000 });
        envoyes++;
      } catch (e) {
        if (e.statusCode === 404 || e.statusCode === 410) { await del(b.url).catch(() => {}); supprimes++; }
        else { erreurs++; console.error('envoi', e.statusCode || '', e.message); }
      }
    }));
  }

  // Ménage : on oublie les traces d'envoi de plus de deux jours
  if (now.getUTCHours() === 0) {
    const { blobs: vieux } = await list({ prefix: 'envois/' });
    const limite = now.getTime() - 2 * 864e5;
    const aSuppr = vieux.filter(x => new Date(x.uploadedAt).getTime() < limite).map(x => x.url);
    if (aSuppr.length) await del(aSuppr);
  }
  console.log(`parole de l'heure : ${blobs.length} abonnés, ${envoyes} envoyés, ${rappels} rappels de lecture, ${supprimes} supprimés, ${erreurs} erreurs`);
  res.status(200).json({ ok: true, abonnes: blobs.length, envoyes, rappels, supprimes, erreurs });
};
