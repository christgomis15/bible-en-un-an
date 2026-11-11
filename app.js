/* Bible en un an — lecture et méditation, du lundi au samedi.
   Texte : Louis Segond 1910 (domaine public). Aucune donnée n'est envoyée nulle part :
   la progression est enregistrée sur cet appareil (localStorage). */
(() => {
'use strict';

/* ---------- Livres : [nom FR, nom EN (liens), code YouVersion] ---------- */
const BOOKS = [
['Genèse','Genesis','GEN'],['Exode','Exodus','EXO'],['Lévitique','Leviticus','LEV'],['Nombres','Numbers','NUM'],['Deutéronome','Deuteronomy','DEU'],
['Josué','Joshua','JOS'],['Juges','Judges','JDG'],['Ruth','Ruth','RUT'],['1 Samuel','1 Samuel','1SA'],['2 Samuel','2 Samuel','2SA'],
['1 Rois','1 Kings','1KI'],['2 Rois','2 Kings','2KI'],['1 Chroniques','1 Chronicles','1CH'],['2 Chroniques','2 Chronicles','2CH'],['Esdras','Ezra','EZR'],
['Néhémie','Nehemiah','NEH'],['Esther','Esther','EST'],['Job','Job','JOB'],['Psaumes','Psalms','PSA'],['Proverbes','Proverbs','PRO'],
['Ecclésiaste','Ecclesiastes','ECC'],['Cantique des Cantiques','Song of Solomon','SNG'],['Ésaïe','Isaiah','ISA'],['Jérémie','Jeremiah','JER'],['Lamentations','Lamentations','LAM'],
['Ézéchiel','Ezekiel','EZK'],['Daniel','Daniel','DAN'],['Osée','Hosea','HOS'],['Joël','Joel','JOL'],['Amos','Amos','AMO'],
['Abdias','Obadiah','OBA'],['Jonas','Jonah','JON'],['Michée','Micah','MIC'],['Nahum','Nahum','NAM'],['Habacuc','Habakkuk','HAB'],
['Sophonie','Zephaniah','ZEP'],['Aggée','Haggai','HAG'],['Zacharie','Zechariah','ZEC'],['Malachie','Malachi','MAL'],
['Matthieu','Matthew','MAT'],['Marc','Mark','MRK'],['Luc','Luke','LUK'],['Jean','John','JHN'],['Actes','Acts','ACT'],
['Romains','Romans','ROM'],['1 Corinthiens','1 Corinthians','1CO'],['2 Corinthiens','2 Corinthians','2CO'],['Galates','Galatians','GAL'],['Éphésiens','Ephesians','EPH'],
['Philippiens','Philippians','PHP'],['Colossiens','Colossians','COL'],['1 Thessaloniciens','1 Thessalonians','1TH'],['2 Thessaloniciens','2 Thessalonians','2TH'],
['1 Timothée','1 Timothy','1TI'],['2 Timothée','2 Timothy','2TI'],['Tite','Titus','TIT'],['Philémon','Philemon','PHM'],['Hébreux','Hebrews','HEB'],
['Jacques','James','JAS'],['1 Pierre','1 Peter','1PE'],['2 Pierre','2 Peter','2PE'],['1 Jean','1 John','1JN'],['2 Jean','2 John','2JN'],
['3 Jean','3 John','3JN'],['Jude','Jude','JUD'],['Apocalypse','Revelation','REV']
];
const BLOCK_BOOKS = new Set([17,18,19,21,24]); // Job, Psaumes, Proverbes, Cantique, Lamentations : un verset par ligne

/* ---------- Contenu de méditation ---------- */
const OBSERVER = [
  'Quels mots ou quelles idées reviennent dans ce passage ? Qu’est-ce qui vous frappe en premier ?',
  'Qui sont les personnes en présence ? Que font-elles, que disent-elles ?',
  'Que dit ce passage de Dieu : son caractère, ses actes, ses paroles ?',
  'Quel est le contexte : qu’y a-t-il avant, qu’y a-t-il après ? Où et quand cela se passe-t-il ?',
  'Y a-t-il un ordre, une promesse, un avertissement ou une question dans le texte ?',
  'Qu’est-ce qui vous surprend, vous dérange ou vous échappe ? Gardez-le en tête pour y revenir.'
];
const THEMES = [ // index 0 = lundi … 5 = samedi
  {t:'Dieu se révèle', q:[
    'Qu’est-ce que ce passage m’apprend sur qui est Dieu ?',
    'Quel aspect du caractère de Dieu est mis en lumière : sa justice, sa bonté, sa patience, sa sainteté… ?',
    'Comment Dieu agit-il dans ce texte, et qu’est-ce que cela change dans ma façon de le voir ?',
    'Quelle image de Dieu ai-je besoin de corriger après cette lecture ?']},
  {t:'L’être humain devant Dieu', q:[
    'Que montre ce passage du cœur de l’homme : ses forces, ses faiblesses, ses peurs ?',
    'Quel personnage me ressemble le plus aujourd’hui, et pourquoi ?',
    'Où vois-je la foi, ou le manque de foi, dans ce texte ?',
    'Quelle erreur ou quel piège dois-je éviter à la lumière de ce que je lis ?']},
  {t:'La vérité à croire', q:[
    'Quelle vérité ou quelle promesse puis-je retenir de ce passage ?',
    'Qu’est-ce que ce texte m’invite à croire, même quand ce n’est pas facile ?',
    'Comment ce passage me parle-t-il de Jésus-Christ, de son œuvre ou de son retour ?',
    'Quel verset résume le mieux ce que Dieu veut me dire aujourd’hui ?']},
  {t:'Un chemin à suivre', q:[
    'Quel commandement, quel exemple ou quel principe ce passage met-il devant moi ?',
    'Qu’est-ce que Dieu me demande de faire, d’arrêter ou de changer ?',
    'Quelle attitude ce texte m’invite-t-il à cultiver : humilité, courage, pardon, patience… ?',
    'Si je mettais ce passage en pratique cette semaine, à quoi ressemblerait ma journée ?']},
  {t:'Ma vie, mes relations', q:[
    'Comment ce passage éclaire-t-il ma famille, mon travail ou mes responsabilités ?',
    'Y a-t-il une personne à encourager, à pardonner ou à servir à la lumière de ce texte ?',
    'Quelle situation actuelle puis-je confier à Dieu à la lumière de ce passage ?',
    'Que dit ce texte de la manière dont je traite les autres ?']},
  {t:'Reconnaissance et prière', q:[
    'Pour quoi ce passage m’invite-t-il à remercier Dieu ?',
    'Qu’ai-je à reconnaître devant Dieu, et quel pardon ai-je à recevoir ?',
    'Quels besoins, les miens et ceux des autres, ce texte me pousse-t-il à présenter à Dieu ?',
    'Quelle phrase de ce passage puis-je transformer en prière ?']}
];
const APPLIQUER = [
  'Quelle action précise, petite et concrète, vais-je poser aujourd’hui ?',
  'À qui vais-je en parler ou en faire profiter cette semaine ?',
  'Quelle habitude ou quelle pensée ce texte me demande-t-il de changer ?',
  'Que puis-je faire dans les prochaines 24 heures pour mettre ce passage en pratique ?',
  'Quel obstacle m’empêche d’obéir à ce texte, et comment le lever ?'
];
const PRIER = [
  'Parlez à Dieu de ce que vous venez de lire : remerciez, confessez, demandez.',
  'Reprenez une phrase du passage et priez-la mot à mot.',
  'Demandez à Dieu la force de mettre en pratique ce qu’il vous a montré.',
  'Terminez par un moment de silence : qu’avez-vous envie de dire à Dieu ?'
];
const SUNDAY_Q = [
  'Quel passage de la semaine vous a le plus marqué, et pourquoi ?',
  'Qu’avez-vous mis en pratique ? Qu’est-ce qui reste à faire ?',
  'Pour quoi voulez-vous remercier Dieu cette semaine ?'
];

/* ---------- Utilitaires ---------- */
const LS_KEY = 'bible-an-v1';
const $ = (s, el = document) => el.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
const fmtLong = d => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = d => d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) el.append(k.nodeType ? k : document.createTextNode(k));
  return el;
}

/* ---------- État ---------- */
let LSG = null, PLAN = null, TOTAL_CHARS = 0;
let S = load();
const V = { tab: 'today', day: null, ver: 'lsg' };

function load() {
  try { const s = JSON.parse(localStorage.getItem(LS_KEY)); if (s && s.start) return Object.assign({ done: {}, verses: {}, font: 19, remind: '06:30' }, s); } catch (e) {}
  return { start: null, done: {}, verses: {}, font: 19, remind: '06:30' };
}
function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {} }

/* ---------- Calendrier du plan (lundi – samedi) ---------- */
function stateOn(date) {
  const start = parseISO(S.start);
  if (date < start) return { k: 'before' };
  let n = 0;
  for (let d = new Date(start); d <= date; d = addDays(d, 1)) if (d.getDay() !== 0) n++;
  if (date.getDay() === 0) return { k: 'rest', last: n };
  if (n > PLAN.length) return { k: 'after' };
  return { k: 'day', n };
}
function dateOfDay(n) {
  let c = 0;
  for (let d = parseISO(S.start); ; d = addDays(d, 1)) if (d.getDay() !== 0 && ++c === n) return d;
}
function currentDayNumber() { // jour prévu aujourd'hui (ou dernier jour écoulé si dimanche)
  const s = stateOn(today());
  if (s.k === 'day') return s.n;
  if (s.k === 'rest') return Math.min(s.last, PLAN.length);
  if (s.k === 'after') return PLAN.length;
  return 0;
}
function label(n) {
  return PLAN[n - 1].s.map(([b, c1, c2]) => BOOKS[b][0] + ' ' + (c1 === c2 ? c1 : c1 + '–' + c2)).join(' ; ');
}
const minutes = n => Math.max(1, Math.round(PLAN[n - 1].n / 1100));
const doneCount = () => Object.keys(S.done).length;
function firstUndone() { for (let n = 1; n <= PLAN.length; n++) if (!S.done[n]) return n; return null; }
function nextMonday(from) { let d = new Date(from); while (d.getDay() !== 1) d = addDays(d, 1); return d; }

/* ---------- Liens Bible du Semeur (texte sous droits : on renvoie vers la source officielle) ---------- */
function semeurLinks(n) {
  const yv = [], gw = [];
  for (const [b, c1, c2] of PLAN[n - 1].s) {
    for (let c = c1; c <= c2; c++) yv.push({ t: `${BOOKS[b][0]} ${c}`, u: `https://www.bible.com/bible/21/${BOOKS[b][2]}.${c}.BDS` });
    gw.push(`${BOOKS[b][1]} ${c1 === c2 ? c1 : c1 + '-' + c2}`);
  }
  return { yv, gw: 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(gw.join('; ')) + '&version=BDS' };
}

/* ---------- Rendu ---------- */
const view = $('#view');
function render() {
  document.documentElement.style.setProperty('--read-size', S.font + 'px');
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === V.tab));
  view.replaceChildren();
  if (!S.start) { view.append(welcome()); return; }
  const fn = { today: viewToday, plan: viewPlan, progress: viewProgress, settings: viewSettings }[V.tab];
  view.append(...[].concat(fn()).filter(Boolean));
  window.scrollTo(0, 0);
}

function welcome() {
  const def = nextMonday(today()); const t = today();
  const input = h('input', { type: 'date', value: iso(t.getDay() === 1 ? t : def) });
  return h('div', { class: 'card' },
    h('h2', null, 'Bienvenue 👋'),
    h('p', null, 'Ce plan vous fait lire et méditer toute la Bible en une année : ', h('b', null, '312 jours de lecture, du lundi au samedi'), ', avec le dimanche pour se reposer et faire le point.'),
    h('p', { class: 'muted small' }, 'Chaque jour : un passage (8 à 16 minutes de lecture), quelques questions de méditation, et un verset à retenir.'),
    h('label', { class: 'f' }, 'Date du premier jour de lecture'),
    input,
    h('p', null,
      h('button', { class: 'btn', onclick: () => startOn(input.value) }, 'Commencer'),
      h('button', { class: 'btn alt', onclick: () => startOn(iso(today())) }, 'Commencer aujourd’hui')));
}
function startOn(s) {
  if (!s) return;
  let d = parseISO(s); if (d.getDay() === 0) d = addDays(d, 1); // pas de lecture le dimanche
  S.start = iso(d); save(); V.tab = 'today'; V.day = null; render();
}

/* ---------- Parole de l'heure ---------- */
// Même calcul que le serveur (api/envoyer.js) : la notification et la carte affichent le même verset.
function versetDeLheure(d = new Date()) {
  const L = window.VERSETS || [];
  if (!L.length) return null;
  const jour = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  return L[((jour * 24 + d.getHours()) * 47) % L.length]; // ×47 : mélange l'ordre des versets
}
function hourCard() {
  const v = versetDeLheure(); if (!v) return null;
  const card = h('div', { class: 'card hour-verse' },
    h('div', { class: 'kicker' }, `Parole de l’heure · ${pad(new Date().getHours())} h`),
    h('blockquote', null, v.t),
    h('div', { class: 'ref' }, v.r),
    h('p', { class: 'muted small' }, '« C’est de l’abondance du cœur que la bouche parle » (Luc 6:45). Remplissons notre cœur de la Parole de Dieu.'));
  return card;
}
// Change de verset au début de chaque heure si l'appli reste ouverte.
let hourTimer = null;
function scheduleHourRefresh() {
  clearTimeout(hourTimer);
  const n = new Date(), ms = (60 - n.getMinutes()) * 60000 - n.getSeconds() * 1000 + 500;
  hourTimer = setTimeout(() => {
    const el = $('.hour-verse'); if (el) el.replaceWith(hourCard());
    if (bubbleOpen()) fillBubble(); updateFab();
    scheduleHourRefresh();
  }, ms);
}

/* Bulle « Parole de l'heure » : bouton flottant visible sur toutes les pages,
   qui s'ouvre tout seul la première fois que l'appli est ouverte dans l'heure
   (ou quand on touche la notification), et reste disponible jusqu'à l'heure suivante. */
const hourStamp = (d = new Date()) => `${iso(d)}T${pad(d.getHours())}`;
let VU = ''; try { VU = localStorage.getItem('bible-an-vu') || ''; } catch (e) {}
const markSeen = () => { VU = hourStamp(); try { localStorage.setItem('bible-an-vu', VU); } catch (e) {} };
const fab = h('button', { class: 'fab', 'aria-label': 'Parole de l’heure', onclick: () => openBubble() }, h('span', null, '✨'));
const bubble = h('div', { class: 'bubble-back', hidden: true, onclick: e => { if (e.target === bubble) closeBubble(); } },
  h('div', { class: 'bubble', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'bubble-k' }));
const bubbleOpen = () => !bubble.hidden;
function fillBubble() {
  const v = versetDeLheure(); if (!v) return;
  const n = new Date(), next = (n.getHours() + 1) % 24;
  bubble.firstChild.replaceChildren(
    h('div', { class: 'kicker', id: 'bubble-k' }, `Parole de l’heure · ${pad(n.getHours())} h`),
    h('blockquote', null, v.t),
    h('div', { class: 'ref' }, v.r),
    h('p', { class: 'muted small' }, `Gardez cette parole dans votre cœur : un nouveau verset vous attend à ${pad(next)}00a0h.`),
    h('button', { class: 'btn', onclick: closeBubble }, 'Amen'));
}
function openBubble() {
  if (!window.VERSETS || !VERSETS.length) return;
  fillBubble(); bubble.hidden = false; markSeen(); updateFab();
  bubble.querySelector('.btn').focus();
}
function closeBubble() { bubble.hidden = true; fab.focus(); }
function updateFab() { fab.classList.toggle('new', VU !== hourStamp()); }
document.addEventListener('keydown', e => { if (e.key === 'Escape' && bubbleOpen()) closeBubble(); });
// Ouverture automatique : une fois par heure, au retour dans l'appli
function maybeAutoOpen() { if (S.start && VU !== hourStamp() && !bubbleOpen()) openBubble(); else updateFab(); }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') maybeAutoOpen(); });

function viewToday() {
  const out = [].concat(viewTodayInner());
  const cur = S.start && stateOn(today());
  const onToday = !cur || cur.k !== 'day' || V.day === cur.n;
  if (onToday) { out.unshift(hourCard()); scheduleHourRefresh(); }
  return out;
}
function viewTodayInner() {
  const t = today(), st = stateOn(t);
  if (st.k === 'before') {
    return h('div', { class: 'card center' }, h('h2', null, 'Le plan commence bientôt'),
      h('p', null, `Premier jour de lecture : ${fmtLong(parseISO(S.start))}.`),
      h('p', { class: 'muted small' }, 'En attendant, vous pouvez parcourir le plan ou régler votre rappel quotidien.'));
  }
  if (V.day == null) {
    if (st.k === 'rest') return sunday(st.last);
    V.day = st.k === 'after' ? PLAN.length : st.n;
  }
  return reading(V.day, st);
}

function reading(n, st) {
  const date = dateOfDay(n), cur = currentDayNumber(), isDone = !!S.done[n];
  const late = !isDone && n < cur;
  const wd = (date.getDay() + 6) % 7; // 0 = lundi
  const theme = THEMES[wd], wk = Math.floor((n - 1) / 6);
  const pick = (arr, off = 0) => arr[(n + off) % arr.length];

  const head = h('div', { class: 'day-head' },
    h('button', { class: 'nav', 'aria-label': 'Jour précédent', disabled: n <= 1, onclick: () => { V.day = n - 1; render(); } }, '‹'),
    h('div', { class: 'mid' },
      h('div', { class: 'kicker' }, `Jour ${n} sur ${PLAN.length}`,
        isDone ? h('span', { class: 'badge ok' }, 'lu ✓') : late ? h('span', { class: 'badge late' }, 'à rattraper') : n === cur && st.k === 'day' ? h('span', { class: 'badge' }, 'aujourd’hui') : null),
      h('div', { class: 'passage' }, label(n)),
      h('div', { class: 'meta' }, `${cap(fmtLong(date))} · ≈ ${minutes(n)} min`)),
    h('button', { class: 'nav', 'aria-label': 'Jour suivant', disabled: n >= PLAN.length, onclick: () => { V.day = n + 1; render(); } }, '›'));

  const seg = h('div', { class: 'seg', role: 'tablist' },
    h('button', { class: V.ver === 'lsg' ? 'on' : '', onclick: () => { V.ver = 'lsg'; render(); } }, 'Louis Segond'),
    h('button', { class: V.ver === 'bds' ? 'on' : '', onclick: () => { V.ver = 'bds'; render(); } }, 'Bible du Semeur'));

  const body = V.ver === 'lsg' ? readerLSG(n) : readerSemeur(n);

  const med = h('div', { class: 'card' },
    h('div', { class: 'kicker' }, `Méditation · ${theme.t}`),
    h('ol', { class: 'steps' },
      h('li', null, h('h4', null, 'Lire'), h('p', null, 'Lisez le passage lentement, si possible à voix haute. Une seule lecture attentive vaut mieux que deux lectures pressées.')),
      h('li', null, h('h4', null, 'Observer'), h('p', null, pick(OBSERVER))),
      h('li', null, h('h4', null, 'Méditer'), h('p', null, theme.q[(wk + n) % theme.q.length])),
      h('li', null, h('h4', null, 'Retenir'), h('p', null, 'Touchez un verset du texte pour le garder comme verset de la journée.')),
      h('li', null, h('h4', null, 'Appliquer'), h('p', null, pick(APPLIQUER, 1))),
      h('li', null, h('h4', null, 'Prier'), h('p', null, pick(PRIER, 2)))));

  const finish = h('div', { class: 'card center' },
    isDone ? h('p', null, `Lecture terminée le ${parseISO(S.done[n]).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}. Bravo !`) : h('p', { class: 'muted' }, 'Quand vous avez lu et médité, marquez la journée comme faite.'),
    h('button', { class: 'btn ' + (isDone ? 'alt' : 'ok'), onclick: () => toggleDone(n) }, isDone ? 'Annuler « lu »' : '✓ J’ai terminé la lecture du jour'),
    n !== cur ? h('p', null, h('button', { class: 'btn alt', onclick: () => { V.day = null; render(); } }, 'Revenir à aujourd’hui')) : null);

  const out = [head];
  if (st.k === 'after') out.push(h('div', { class: 'card' }, h('p', null, 'L’année de lecture est terminée. Vous pouvez toujours rouvrir n’importe quel jour.')));
  out.push(seg, body, med, finish);
  return out;
}

function readerLSG(n) {
  const wrap = h('div', { class: 'card' },
    h('div', { class: 'tools' },
      h('button', { 'aria-label': 'Réduire la taille du texte', onclick: () => { S.font = Math.max(15, S.font - 1); save(); render(); } }, 'A−'),
      h('button', { 'aria-label': 'Agrandir la taille du texte', onclick: () => { S.font = Math.min(30, S.font + 1); save(); render(); } }, 'A+')));
  const reader = h('div', { class: 'reader' });
  const kept = new Set(S.verses[n] || []);
  for (const [b, c1, c2] of PLAN[n - 1].s) {
    for (let c = c1; c <= c2; c++) {
      reader.append(h('h3', null, `${BOOKS[b][0]} ${c}`));
      const p = h('p', { class: BLOCK_BOOKS.has(b) ? 'blocks' : '' });
      LSG[b][c - 1].forEach((txt, i) => {
        const key = `${b}.${c}.${i + 1}`;
        const sp = h('span', { class: 'vs' + (kept.has(key) ? ' on' : ''), 'data-k': key, onclick: () => toggleVerse(n, key, sp) },
          h('sup', null, i + 1), txt + ' ');
        p.append(sp);
      });
      reader.append(p);
    }
  }
  wrap.append(reader, h('p', { class: 'hint' }, 'Touchez un verset pour le surligner comme verset de la journée.'));
  return wrap;
}

function readerSemeur(n) {
  const l = semeurLinks(n);
  return h('div', { class: 'card semeur' },
    h('h2', null, 'La Bible du Semeur'),
    h('p', null, 'Ce texte est protégé par des droits d’auteur (© Biblica). Il n’est donc pas intégré à l’application : ouvrez le passage du jour directement sur une source officielle.'),
    h('p', { class: 'meta' }, label(n)),
    h('a', { class: 'btn block', href: l.gw, target: '_blank', rel: 'noopener' }, 'Ouvrir tout le passage (BibleGateway)'),
    h('p', { class: 'muted small' }, 'Ou chapitre par chapitre sur YouVersion :'),
    h('div', { class: 'chips' }, l.yv.map(x => h('a', { class: 'chip', href: x.u, target: '_blank', rel: 'noopener' }, x.t))),
    h('p', { class: 'muted small' }, 'Astuce : lisez d’abord dans la Bible du Semeur, puis revenez dans « Louis Segond » pour comparer et surligner votre verset.'));
}

function toggleVerse(n, key, el) {
  const arr = S.verses[n] || (S.verses[n] = []);
  const i = arr.indexOf(key);
  if (i >= 0) arr.splice(i, 1); else arr.push(key);
  if (!arr.length) delete S.verses[n];
  el.classList.toggle('on', i < 0); save();
}
function toggleDone(n) {
  if (S.done[n]) delete S.done[n]; else S.done[n] = iso(today());
  save(); render();
}

function sunday(last) {
  const first = Math.max(1, last - 5), items = [];
  for (let n = first; n <= last; n++) {
    items.push(h('button', { class: 'row' + (S.done[n] ? ' done' : ''), onclick: () => { V.day = n; render(); } },
      h('span', { class: 'dot' }, S.done[n] ? '✓' : ''), h('span', { class: 'd' }, fmtShort(dateOfDay(n))), h('span', { class: 'p' }, label(n))));
  }
  const weekVerses = [];
  for (let n = first; n <= last; n++) (S.verses[n] || []).forEach(k => weekVerses.push(savedVerse(k)));
  return [
    h('div', { class: 'card' }, h('div', { class: 'kicker' }, 'Dimanche'), h('h2', null, 'Jour de repos et de récapitulation'),
      h('p', null, 'Pas de lecture au programme. Prenez le temps de souffler, de prier et de revenir sur la semaine.'),
      h('ul', null, SUNDAY_Q.map(q => h('li', null, q)))),
    h('div', { class: 'card', style: 'padding:0;overflow:hidden' }, h('div', { style: 'padding:12px 14px', class: 'kicker' }, 'Les lectures de la semaine'), items),
    weekVerses.length ? h('div', { class: 'card' }, h('div', { class: 'kicker' }, 'Vos versets retenus'), weekVerses) : null,
    h('div', { class: 'card center' }, h('p', { class: 'muted small' }, 'Prochaine lecture : lundi'),
      h('button', { class: 'btn alt', onclick: () => { V.day = Math.min(last + 1, PLAN.length); render(); } }, `Voir le jour ${Math.min(last + 1, PLAN.length)}`))
  ];
}

function savedVerse(key) {
  const [b, c, v] = key.split('.').map(Number);
  return h('div', { class: 'verse-saved' }, h('div', { class: 'ref' }, `${BOOKS[b][0]} ${c}:${v}`), h('p', null, LSG[b][c - 1][v - 1]));
}

/* ---------- Plan ---------- */
function viewPlan() {
  const cur = currentDayNumber(), t = today(), st = stateOn(t);
  const out = [h('div', { class: 'card' }, h('h2', null, 'Plan sur 52 semaines'), h('p', { class: 'muted small' }, 'Touchez un jour pour l’ouvrir. Le point vert indique une lecture terminée.'))];
  const weeks = Math.ceil(PLAN.length / 6);
  for (let w = 0; w < weeks; w++) {
    const first = w * 6 + 1, last = Math.min(PLAN.length, first + 5);
    let cnt = 0; for (let n = first; n <= last; n++) if (S.done[n]) cnt++;
    const d = h('details', { class: 'week' });
    if (cur >= first && cur <= last) d.open = true;
    d.append(h('summary', null, h('span', null, `Semaine ${w + 1}`, h('span', { class: 'count' }, ` · ${fmtShort(dateOfDay(first))}`)), h('span', { class: 'count' }, `${cnt}/${last - first + 1}`)));
    for (let n = first; n <= last; n++) {
      const late = !S.done[n] && n < cur;
      d.append(h('button', { class: 'row' + (S.done[n] ? ' done' : '') + (late ? ' late' : '') + (n === cur && st.k === 'day' ? ' today' : ''), onclick: () => { V.day = n; V.tab = 'today'; render(); } },
        h('span', { class: 'dot' }, S.done[n] ? '✓' : ''), h('span', { class: 'd' }, fmtShort(dateOfDay(n))), h('span', { class: 'p' }, label(n))));
    }
    out.push(d);
  }
  return out;
}

/* ---------- Progression ---------- */
function viewProgress() {
  const cur = currentDayNumber();
  let chars = 0; for (const n of Object.keys(S.done)) chars += PLAN[n - 1].n;
  const pct = Math.round(chars / TOTAL_CHARS * 1000) / 10;
  let late = 0; for (let n = 1; n <= cur; n++) if (!S.done[n]) late++;
  if (cur > 0 && !S.done[cur] && stateOn(today()).k === 'day') late = Math.max(0, late - 1); // le jour en cours n'est pas « en retard »
  let streak = 0, n = cur; if (n > 0 && !S.done[n]) n--; while (n > 0 && S.done[n]) { streak++; n--; }
  const R = 54, C = 2 * Math.PI * R;
  const ring = `<svg class="ring" width="140" height="140" viewBox="0 0 140 140" role="img" aria-label="${pct} % de la Bible lue">
    <circle cx="70" cy="70" r="${R}" fill="none" stroke="var(--line)" stroke-width="12"/>
    <circle cx="70" cy="70" r="${R}" fill="none" stroke="var(--gold)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(C * Math.min(100, pct) / 100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 70 70)"/>
    <text x="70" y="76" text-anchor="middle" font-size="26" font-weight="700" fill="var(--ink)">${pct.toLocaleString('fr-FR')} %</text></svg>`;
  const ringEl = h('div'); ringEl.innerHTML = ring;
  const out = [h('div', { class: 'card center' }, h('h2', null, 'De la Bible lue'), ringEl,
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', null, doneCount()), h('span', null, `${doneCount() > 1 ? 'jours lus' : 'jour lu'} sur ${PLAN.length}`)),
      h('div', { class: 'stat' }, h('b', null, streak), h('span', null, streak > 1 ? 'jours d’affilée' : 'jour d’affilée')),
      h('div', { class: 'stat' }, h('b', null, late), h('span', null, 'à rattraper'))))];
  if (late > 0) {
    out.push(h('div', { class: 'card' }, h('h2', null, `Vous avez ${late} jour${late > 1 ? 's' : ''} de retard`),
      h('p', { class: 'muted' }, 'Pas de culpabilité : reprenez simplement là où vous en êtes. Le plan peut être décalé pour que la lecture du jour redevienne la prochaine non lue.'),
      h('button', { class: 'btn', onclick: shiftPlan }, 'Reprendre à mon rythme'),
      h('button', { class: 'btn alt', onclick: () => { V.day = firstUndone(); V.tab = 'today'; render(); } }, 'Ouvrir le premier jour non lu')));
  }
  const keys = []; for (const n of Object.keys(S.verses).map(Number).sort((a, b) => a - b)) S.verses[n].forEach(k => keys.push(k));
  out.push(h('div', { class: 'card' }, h('h2', null, `Versets retenus (${keys.length})`),
    keys.length ? keys.slice().reverse().map(savedVerse) : h('p', { class: 'muted' }, 'Les versets que vous surlignez pendant la lecture apparaîtront ici.')));
  return out;
}

function shiftPlan() {
  const f = firstUndone(); if (!f) return;
  const t = today(); let ref = t.getDay() === 0 ? addDays(t, 1) : t;
  let c = 0, d = new Date(ref);
  for (;; d = addDays(d, -1)) if (d.getDay() !== 0 && ++c === f) break;
  S.start = iso(d); save(); V.day = null; V.tab = 'today'; render();
}

/* ---------- Réglages ---------- */
function viewSettings() {
  const startIn = h('input', { type: 'date', value: S.start });
  const timeIn = h('input', { type: 'time', value: S.remind || '06:30' });
  const fileIn = h('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: importData });
  return [
    ...installCard(),
    ...pushCard(),
    h('div', { class: 'card' }, h('h2', null, 'Rappel quotidien'),
      h('p', { class: 'muted small' }, 'Génère un rappel dans le calendrier de votre téléphone, répété du lundi au samedi pendant 312 jours. Il fonctionne même quand l’application est fermée.'),
      h('label', { class: 'f' }, 'Heure du rappel'), timeIn,
      h('p', null, h('button', { class: 'btn', onclick: () => { S.remind = timeIn.value || '06:30'; save(); downloadICS(S.remind); } }, 'Ajouter au calendrier (.ics)'))),
    h('div', { class: 'card' }, h('h2', null, 'Date de départ'),
      h('p', { class: 'muted small' }, 'Changer la date décale tout le calendrier. Vos jours déjà lus restent enregistrés.'),
      startIn, h('p', null, h('button', { class: 'btn alt', onclick: () => { if (startIn.value) { startOn(startIn.value); V.tab = 'settings'; render(); } } }, 'Appliquer')),
      h('hr', { class: 'sep' }),
      h('button', { class: 'btn alt', onclick: shiftPlan }, 'Reprendre à mon rythme (décaler le plan)')),
    h('div', { class: 'card' }, h('h2', null, 'Sauvegarde'),
      h('p', { class: 'muted small' }, 'Votre progression est enregistrée uniquement sur cet appareil. Exportez-la de temps en temps, ou pour la transférer sur un autre appareil.'),
      h('button', { class: 'btn alt', onclick: exportData }, 'Exporter ma progression'),
      h('button', { class: 'btn alt', onclick: () => fileIn.click() }, 'Importer'), fileIn,
      h('hr', { class: 'sep' }),
      h('button', { class: 'btn alt', onclick: () => { if (confirm('Effacer toute la progression et recommencer ?')) { S = { start: null, done: {}, verses: {}, font: 19, remind: '06:30' }; save(); V.day = null; V.tab = 'today'; render(); } } }, 'Tout réinitialiser')),
    h('div', { class: 'card small muted' },
      h('p', null, 'Texte biblique : Louis Segond (1910), domaine public. La Bible du Semeur (© Biblica) n’est pas incluse : l’application renvoie vers les sources officielles.'),
      h('p', null, 'Aucune donnée personnelle n’est collectée : votre progression reste sur cet appareil. Si vous activez « Un verset chaque heure », seuls l’adresse technique de notification de votre navigateur, votre fuseau horaire et votre plage d’heures sont conservés, et ils sont effacés dès que vous désactivez.'))
  ];
}

/* ---------- Installation sur l'écran d'accueil ---------- */
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (V.tab === 'settings') render(); });
window.addEventListener('appinstalled', () => { installEvt = null; if (V.tab === 'settings') render(); });
function installCard() {
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) return [];
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document);
  const inApp = /FBAN|FBAV|Instagram|Line\/|WhatsApp|Snapchat|GSA\//.test(ua);
  let body;
  if (installEvt) {
    body = [h('p', { class: 'muted small' }, 'Ajoutez l’application sur l’écran d’accueil : elle s’ouvre en plein écran et fonctionne hors connexion.'),
      h('button', { class: 'btn', onclick: async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; render(); } }, 'Installer l’application')];
  } else if (inApp) {
    body = [h('p', { class: 'muted small' }, 'Vous êtes dans le navigateur intégré d’une autre application, qui ne permet pas l’installation. Ouvrez ce lien dans ' + (ios ? 'Safari' : 'Chrome') + ' (menu ⋯ → « Ouvrir dans le navigateur »).')];
  } else if (ios) {
    body = [h('p', { class: 'muted small' }, 'Sur iPhone, l’installation se fait depuis Safari : touchez le bouton Partager (carré avec une flèche vers le haut), puis « Sur l’écran d’accueil » et « Ajouter ».')];
  } else {
    body = [h('p', { class: 'muted small' }, 'Dans Chrome, touchez le menu ⋮ en haut à droite, puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».')];
  }
  return [h('div', { class: 'card' }, h('h2', null, 'Installer sur le téléphone'), ...body)];
}

/* ---------- Notifications : un verset chaque heure ---------- */
const PUSH_PRET = true; // false masque la carte des notifications
const VAPID_PUBLIC = 'BGznV46AK-R3uZDIjAiCMBf3X_2aOv5CAx9nSAa0-ULbrH-bD7efKeq2lykVg6K5aaDvOV9Jprd-DjvgaquZkv8';
const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
let pushSub; // undefined = pas encore vérifié
function b64ToBytes(s) {
  const b = atob((s + '='.repeat((4 - s.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(b, c => c.charCodeAt(0));
}
async function sendSub(sub, method) {
  const r = await fetch('api/abonnement', { method, headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, from: S.pushFrom, to: S.pushTo }) });
  if (!r.ok) throw new Error('serveur ' + r.status);
}
async function pushOn() {
  if (await Notification.requestPermission() !== 'granted') { alert('Les notifications sont refusées. Autorisez-les dans les réglages du téléphone pour cette application.'); return; }
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID_PUBLIC) });
  await sendSub(sub, 'POST'); pushSub = sub;
}
async function pushOff() {
  const reg = await navigator.serviceWorker.ready, sub = await reg.pushManager.getSubscription();
  if (sub) { try { await sendSub(sub, 'DELETE'); } catch (e) {} await sub.unsubscribe(); }
  pushSub = null;
}
function pushCard() {
  if (!PUSH_PRET) return [];
  S.pushFrom ??= 7; S.pushTo ??= 21;
  const title = h('h2', null, 'Un verset chaque heure');
  const intro = h('p', { class: 'muted small' }, 'Recevez une parole d’encouragement toutes les heures, même quand l’application est fermée : Dieu n’abandonne pas ses enfants.');
  if (!pushSupported()) return [h('div', { class: 'card' }, title, intro, h('p', { class: 'small' }, 'Ce navigateur ne permet pas les notifications.'))];
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  if (ios && !(matchMedia('(display-mode: standalone)').matches || navigator.standalone))
    return [h('div', { class: 'card' }, title, intro, h('p', { class: 'small' }, 'Sur iPhone, installez d’abord l’application sur l’écran d’accueil (voir ci-dessus), puis ouvrez-la depuis son icône pour activer les notifications.'))];
  if (pushSub === undefined) navigator.serviceWorker.ready.then(r => r.pushManager.getSubscription()).then(s => { pushSub = s; if (V.tab === 'settings') render(); });
  const hours = sel => h('select', { onchange: e => { S[sel] = +e.target.value; save(); if (pushSub) sendSub(pushSub, 'POST').catch(() => {}); } },
    Array.from({ length: 24 }, (_, i) => h('option', { value: i, selected: S[sel] === i }, `${pad(i)} h`)));
  const status = h('p', { class: 'small' });
  const run = fn => async () => { status.textContent = 'Un instant…'; try { await fn(); status.textContent = ''; render(); } catch (e) { status.textContent = 'Échec : vérifiez votre connexion et réessayez.'; } };
  return [h('div', { class: 'card' }, title, intro,
    h('label', { class: 'f' }, 'Entre'), h('div', { class: 'hours' }, hours('pushFrom'), h('span', null, 'et'), hours('pushTo')),
    pushSub ? h('p', { class: 'small ok-txt' }, '✓ Activé sur cet appareil') : null,
    h('p', null, pushSub ? h('button', { class: 'btn alt', onclick: run(pushOff) }, 'Désactiver')
      : h('button', { class: 'btn', onclick: run(pushOn) }, 'Activer les notifications')),
    status)];
}

function downloadBlob(name, type, content) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = h('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function downloadICS(time) {
  const [hh, mm] = time.split(':').map(Number);
  const first = dateOfDay(1), dt = x => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(hh)}${pad(mm)}00`;
  const end = new Date(first); end.setHours(hh, mm + 30, 0, 0);
  const now = new Date(), stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const url = location.href.split('#')[0];
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bible en un an//FR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:bible-an-${S.start}@bible-en-un-an`, `DTSTAMP:${stamp}`,
    `DTSTART:${dt(new Date(first.getFullYear(), first.getMonth(), first.getDate(), hh, mm))}`,
    `DTEND:${dt(new Date(first.getFullYear(), first.getMonth(), first.getDate(), end.getHours(), end.getMinutes()))}`,
    `RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA;COUNT=${PLAN.length}`,
    'SUMMARY:Lecture et méditation de la Bible', `DESCRIPTION:Ouvrez « Bible en un an » pour la lecture du jour.\\n${url}`,
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:Lecture de la Bible', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
  downloadBlob('rappel-bible-en-un-an.ics', 'text/calendar;charset=utf-8', lines.join('\r\n'));
}
function exportData() { downloadBlob(`bible-en-un-an-${iso(today())}.json`, 'application/json', JSON.stringify(S, null, 1)); }
function importData(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const o = JSON.parse(r.result);
      if (!o || typeof o.start !== 'string' || typeof o.done !== 'object') throw new Error('format');
      S = Object.assign({ done: {}, verses: {}, font: 19, remind: '06:30' }, o); save(); V.day = null; V.tab = 'today'; render();
    } catch (err) { alert('Fichier non reconnu.'); }
  };
  r.readAsText(f);
}

/* ---------- Démarrage ---------- */
document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => { V.tab = b.dataset.tab; if (V.tab === 'today') V.day = null; render(); }));

if (window.BIBLE_LSG && window.BIBLE_PLAN) {
  LSG = window.BIBLE_LSG; PLAN = window.BIBLE_PLAN; TOTAL_CHARS = PLAN.reduce((a, d) => a + d.n, 0); render();
  if (window.VERSETS && VERSETS.length) {
    document.body.append(fab, bubble); scheduleHourRefresh();
    const fromNotif = new URLSearchParams(location.search).has('verset');
    if (fromNotif) history.replaceState(null, '', location.pathname);
    if (fromNotif) openBubble(); else maybeAutoOpen();
    // Notification touchée alors que l'appli était déjà ouverte
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'verset') openBubble(); });
  }
} else {
  view.replaceChildren(h('div', { class: 'card' }, h('h2', null, 'Chargement impossible'),
    h('p', null, 'Les fichiers de données (dossier « data ») sont introuvables. Vérifiez que tout le dossier a bien été décompressé.')));
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
})();
