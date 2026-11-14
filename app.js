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
// Couleurs de surlignage : chacun peut donner (ou non) un nom à chaque couleur pour s'organiser
const COULEURS = ['#f5c518', '#f08c00', '#e5484d', '#e93d82', '#8e4ec6', '#3e7bfa', '#00b4d8', '#12a594', '#30a46c', '#94c11f', '#a0522d', '#7a869a'];
const CATS_DEFAUT = () => COULEURS.map((c, i) => ({ id: 'c' + i, n: '', c }));
// Version précédente : 4 catégories nommées imposées → on passe aux couleurs libres (noms modifiés conservés)
const ANCIENS = { jour: 'Verset du jour', combat: 'Combat', grace: 'Action de grâce', identite: 'Identité en Christ' };
function migreCats(s) {
  if (!s.cats.some(c => c.id in ANCIENS)) return;
  const neuf = CATS_DEFAUT(), map = {};
  for (const c of s.cats) {
    let t = neuf.find(x => x.c === c.c && !x.pris);
    if (!t) { t = { id: c.id, n: '', c: c.c }; neuf.push(t); }
    t.pris = true; map[c.id] = t.id;
    if (c.n && c.n !== ANCIENS[c.id]) t.n = c.n;
  }
  neuf.forEach(x => delete x.pris);
  for (const k of Object.keys(s.vc)) if (map[s.vc[k]]) s.vc[k] = map[s.vc[k]];
  // les versets sans catégorie suivaient la première ancienne catégorie
  for (const k of Object.values(s.verses || {}).flat()) if (!s.vc[k]) s.vc[k] = map[s.cats[0].id];
  s.cats = neuf;
}
let S = load();
const V = { tab: 'today', day: null, ver: 'lsg', sel: new Set(), bv: 'read', bb: null, q: '', qMax: 100, goto: null };

function norm(s) {
  s = Object.assign({ start: null, done: {}, font: 19, remind: '06:30' }, s || {});
  if (!Array.isArray(s.cats) || !s.cats.length) s.cats = CATS_DEFAUT();
  if (!s.vc || typeof s.vc !== 'object') s.vc = {}; // verset → couleur
  migreCats(s);
  // Surlignages : autrefois rangés par jour de lecture (verses + vc), désormais communs à toute l'appli (hl)
  if (!s.hl || typeof s.hl !== 'object') {
    s.hl = {};
    for (const n of Object.keys(s.verses || {}).map(Number).sort((a, b) => a - b))
      for (const k of s.verses[n]) s.hl[k] = s.vc[k] || s.cats[0].id;
  }
  delete s.verses; delete s.vc;
  if (!Array.isArray(s.pushHours) || !s.pushHours.length) s.pushHours = [6, 12, 18];
  delete s.pushFrom; delete s.pushTo;
  if (!s.pos) s.pos = { b: 42, c: 1 }; // dernier chapitre ouvert dans l'onglet Bible (Jean 1)
  return s;
}
function load() {
  try { const s = JSON.parse(localStorage.getItem(LS_KEY)); if (s && s.start) return norm(s); } catch (e) {}
  return norm();
}
// Catégorie d'un verset surligné (les anciens surlignages vont dans la première catégorie)
const catOf = key => S.cats.find(c => c.id === S.hl[key]) || S.cats[0];
const fond = c => c + '59'; // couleur à ~35 % d'opacité
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
  clearSel();
  if (!S.start && V.tab !== 'bible') { view.append(welcome()); return; }
  const fn = { today: viewToday, bible: viewBible, plan: viewPlan, progress: viewProgress, settings: viewSettings }[V.tab];
  view.append(...[].concat(fn()).filter(Boolean));
  window.scrollTo(0, 0);
  if (V.goto) { const sp = verseEl(V.goto); V.goto = null; if (sp) { sp.scrollIntoView({ block: 'center' }); sp.classList.add('flash'); } }
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
// Moments de la parole de Dieu : par défaut 6 h, 12 h et 18 h ; chacun peut en choisir plus (ou moins) dans Réglages.
// Le verset affiché dans l'appli est celui du dernier moment passé, le même que celui de la notification.
const HEURES_DEFAUT = [6, 12, 18];
const myHours = () => (Array.isArray(S.pushHours) && S.pushHours.length ? S.pushHours : HEURES_DEFAUT).slice().sort((a, b) => a - b);
function slotDate(d = new Date()) {
  const hs = myHours(), hr = d.getHours();
  const last = hs.filter(x => x <= hr).pop();
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate(), last ?? hs[hs.length - 1]);
  if (last === undefined) s.setDate(s.getDate() - 1); // avant le premier moment : verset de la veille au soir
  return s;
}
function nextSlot(d = new Date()) {
  const hs = myHours(), nx = hs.find(x => x > d.getHours());
  return nx === undefined ? { h: hs[0], demain: true } : { h: nx, demain: false };
}
const versetDuMoment = () => versetDeLheure(slotDate());
const momentLabel = () => `Parole de Dieu · ${pad(slotDate().getHours())} h`;
function hourCard() {
  const v = versetDuMoment(); if (!v) return null;
  const card = h('div', { class: 'card hour-verse' },
    h('div', { class: 'kicker' }, momentLabel()),
    h('blockquote', null, v.t),
    h('div', { class: 'ref' }, v.r, contextBtn(v.r)),
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
const hourStamp = () => { const s = slotDate(); return `${iso(s)}T${pad(s.getHours())}`; }; // un « vu » par moment choisi
let VU = ''; try { VU = localStorage.getItem('bible-an-vu') || ''; } catch (e) {}
const markSeen = () => { VU = hourStamp(); try { localStorage.setItem('bible-an-vu', VU); } catch (e) {} };
const fab = h('button', { class: 'fab', 'aria-label': 'Parole de Dieu du moment', onclick: () => openBubble() }, h('span', null, '✨'));
const bubble = h('div', { class: 'bubble-back', hidden: true, onclick: e => { if (e.target === bubble) closeBubble(); } },
  h('div', { class: 'bubble', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'bubble-k' }));
const bubbleOpen = () => !bubble.hidden;
function fillBubble() {
  const v = versetDuMoment(); if (!v) return;
  const nx = nextSlot();
  bubble.firstChild.replaceChildren(
    h('div', { class: 'kicker', id: 'bubble-k' }, momentLabel()),
    h('blockquote', null, v.t),
    h('div', { class: 'ref' }, v.r, contextBtn(v.r, () => { bubble.hidden = true; })),
    h('p', { class: 'muted small' }, `Gardez cette parole dans votre cœur : un nouveau verset vous attend ${nx.demain ? 'demain ' : ''}à ${pad(nx.h)} h.`),
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
// Ouverture automatique : une fois par moment choisi (6 h, 12 h, 18 h par défaut), au retour dans l'appli
function maybeAutoOpen() { if (S.start && VU !== hourStamp() && !bubbleOpen()) openBubble(); else updateFab(); }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') maybeAutoOpen(); });

function viewToday() {
  const out = [].concat(viewTodayInner());
  const cur = S.start && stateOn(today());
  const onToday = !cur || cur.k !== 'day' || V.day === cur.n;
  if (onToday) {
    const top = [helloBlock(), hourCard()];
    if (cur && cur.k === 'day') top.push(todayHero(cur.n), miniStats());
    out.unshift(...top); scheduleHourRefresh();
  }
  return out;
}
// Accueil : salutation, date et progression de l'année
const pctRead = () => { let c = 0; for (const n of Object.keys(S.done)) c += PLAN[n - 1].n; return Math.round(c / TOTAL_CHARS * 1000) / 10; };
function streakCount() {
  const cur = currentDayNumber(); let streak = 0, n = cur;
  if (n > 0 && !S.done[n]) n--;
  while (n > 0 && S.done[n]) { streak++; n--; }
  return streak;
}
function helloBlock() {
  const hr = new Date().getHours(), st = stateOn(today());
  const salut = hr < 5 ? 'Bonne nuit' : hr < 18 ? 'Bonjour' : 'Bonsoir';
  const moment = hr >= 18 || hr < 5 ? 'votre soirée' : 'votre journée';
  const pct = pctRead(), R = 23, C = 2 * Math.PI * R;
  const ring = h('div', { class: 'hello-ring' });
  ring.innerHTML = `<svg viewBox="0 0 58 58" role="img" aria-label="${pct} % de la Bible lue"><circle cx="29" cy="29" r="${R}" fill="none" stroke="var(--line)" stroke-width="6"/><circle cx="29" cy="29" r="${R}" fill="none" stroke="var(--brand)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(C * Math.min(100, pct) / 100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 29 29)"/><text x="29" y="33" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)" style="font-family:var(--sans)">${Math.round(pct)}%</text></svg>`;
  const day = st.k === 'day' ? `Jour ${st.n} / ${PLAN.length}` : st.k === 'rest' ? 'Dimanche, jour de repos' : '';
  return h('div', { class: 'hello' },
    h('div', { class: 'hello-row' },
      h('div', null, h('small', null, cap(fmtLong(today()))), h('h2', null, `${salut}, que Dieu bénisse ${moment}`)),
      ring),
    h('div', { class: 'hello-bar' }, h('span', null, day), h('div', { class: 'bar' }, h('i', { style: `width:${Math.max(2, pct)}%` })), h('span', null, `${pct.toLocaleString('fr-FR')} %`)));
}
function todayHero(n) {
  const done = !!S.done[n], wd = (dateOfDay(n).getDay() + 6) % 7;
  const go = () => { const el = view.querySelector('.day-head'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return h('div', { class: 'card today-hero' },
    h('div', { class: 'art' }, svgIcon('<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z"/><path d="M12 6v14"/>')),
    h('div', null, h('small', null, `Lecture du jour · ≈ ${minutes(n)} min`), h('h2', null, label(n)), h('p', null, `Thème : ${THEMES[wd].t}`)),
    h('button', { class: 'cta' + (done ? ' done' : ''), onclick: go }, done ? 'Lecture terminée ✓ · relire' : 'Commencer la lecture ›'));
}
function miniStats() {
  const s = streakCount(), k = Object.keys(S.hl).length;
  return h('div', { class: 'mini-stats' },
    h('div', null, h('b', null, `${s} jour${s > 1 ? 's' : ''}`), h('span', null, 'de lecture d’affilée')),
    h('div', null, h('b', null, k), h('span', null, `verset${k > 1 ? 's' : ''} surligné${k > 1 ? 's' : ''}`)));
}
function svgIcon(d) { const s = h('span'); s.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`; return s.firstChild; }
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
      h('li', null, h('h4', null, 'Retenir'), h('p', null, 'Touchez un ou plusieurs versets du texte, puis choisissez une couleur pour les surligner.')),
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
  for (const [b, c1, c2] of PLAN[n - 1].s)
    for (let c = c1; c <= c2; c++) reader.append(h('h3', null, `${BOOKS[b][0]} ${c}`), chapterEl(b, c));
  wrap.append(reader, h('p', { class: 'hint' }, 'Touchez un ou plusieurs versets, puis choisissez une couleur.'));
  return wrap;
}

// Texte d'un chapitre, versets touchables pour les surligner
function chapterEl(b, c) {
  const p = h('p', { class: BLOCK_BOOKS.has(b) ? 'blocks' : '' });
  LSG[b][c - 1].forEach((txt, i) => {
    const key = `${b}.${c}.${i + 1}`;
    const sp = h('span', { class: 'vs', 'data-k': key, onclick: () => toggleSel(key) }, h('sup', null, i + 1), txt + ' ');
    paintVerse(sp, !!S.hl[key]);
    p.append(sp);
  });
  return p;
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

/* ---------- Sélection et surlignage en couleurs ---------- */
const isKept = key => !!S.hl[key];
const verseEl = key => view.querySelector(`.vs[data-k="${key}"]`);
function paintVerse(sp, on) {
  const key = sp.dataset.k, c = on ? catOf(key) : null;
  sp.classList.toggle('on', on);
  sp.style.backgroundColor = c ? fond(c.c) : '';
  sp.classList.toggle('sel', V.sel.has(key));
}
function toggleSel(key) {
  if (V.sel.has(key)) V.sel.delete(key); else V.sel.add(key);
  const sp = verseEl(key); if (sp) sp.classList.toggle('sel', V.sel.has(key));
  updateSelBar();
}
function clearSel() {
  V.sel.forEach(k => { const sp = verseEl(k); if (sp) sp.classList.remove('sel'); });
  V.sel.clear(); updateSelBar();
}
// Clés sélectionnées, dans l'ordre du texte
const selOrdered = () => [...view.querySelectorAll('.vs.sel')].map(sp => sp.dataset.k);
function applyCat(catId) {
  for (const k of selOrdered()) { delete S.hl[k]; S.hl[k] = catId; } // réinséré : le plus récent en dernier
  save(); finishSel();
}
function removeHl() {
  for (const k of V.sel) delete S.hl[k];
  save(); finishSel();
}
function finishSel() {
  const keys = [...V.sel]; V.sel.clear();
  keys.forEach(k => { const sp = verseEl(k); if (sp) paintVerse(sp, isKept(k)); });
  updateSelBar();
}
function refOf(key) { const [b, c, v] = key.split('.').map(Number); return { b, c, v, txt: LSG[b][c - 1][v - 1] }; }
// « Psaumes 44:3-5, 8 » : versets regroupés par chapitre, suites de versets abrégées
function refLabel(ks) {
  const groups = [];
  for (const r of ks.map(refOf)) {
    const g = groups[groups.length - 1];
    if (g && g.b === r.b && g.c === r.c) g.v.push(r.v); else groups.push({ b: r.b, c: r.c, v: [r.v] });
  }
  return groups.map((g, i) => {
    const parts = [];
    for (const v of g.v) { const p = parts[parts.length - 1]; if (p && v === p[1] + 1) p[1] = v; else parts.push([v, v]); }
    const vs = parts.map(([a, z]) => a === z ? a : `${a}-${z}`).join(', ');
    return (i && groups[i - 1].b === g.b ? '' : BOOKS[g.b][0] + ' ') + `${g.c}:${vs}`;
  }).join(' ; ');
}
function copySel() {
  const ks = selOrdered(); if (!ks.length) return;
  const txt = `« ${ks.map(k => refOf(k).txt).join(' ')} » (${refLabel(ks)}, Louis Segond)`;
  const done = () => { copyBtn.textContent = 'Copié ✓'; setTimeout(() => { copyBtn.textContent = 'Copier'; }, 1500); };
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => prompt('Copiez le texte :', txt));
  else prompt('Copiez le texte :', txt);
}
const selRef = h('span', { class: 'sel-ref' });
const selColors = h('div', { class: 'sel-colors' });
const copyBtn = h('button', { class: 'sel-act', onclick: copySel }, 'Copier');
const selBar = h('div', { class: 'selbar', hidden: true, role: 'toolbar', 'aria-label': 'Surligner les versets sélectionnés' },
  h('div', { class: 'sel-top' }, h('button', { class: 'sel-link', onclick: clearSel }, 'Annuler'), selRef, copyBtn),
  selColors);
function updateSelBar() {
  const k = V.sel.size;
  selBar.hidden = !k; document.body.classList.toggle('selecting', !!k);
  if (!k) return;
  selRef.textContent = refLabel(selOrdered());
  const kept = [...V.sel].some(isKept);
  const one = k === 1 && kept ? catOf([...V.sel][0]).id : null; // couleur actuelle d'un verset seul
  selColors.replaceChildren(
    kept ? h('button', { class: 'color-btn', 'aria-label': 'Retirer la couleur', onclick: removeHl }, h('span', { class: 'color-dot none' }, '✕'), h('span', { class: 'color-name' }, 'Retirer')) : null,
    ...S.cats.map(c => h('button', { class: 'color-btn' + (c.id === one ? ' on' : ''), 'aria-label': c.n || 'Surligner de cette couleur', onclick: () => applyCat(c.id) },
      h('span', { class: 'color-dot', style: `background:${c.c}` }), h('span', { class: 'color-name' }, c.n))));
}
document.body.append(selBar);
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
  const inWeek = k => { const [kb, kc] = k.split('.').map(Number); for (let n = first; n <= last; n++) if (PLAN[n - 1].s.some(([b, c1, c2]) => b === kb && kc >= c1 && kc <= c2)) return true; return false; };
  Object.keys(S.hl).filter(inWeek).sort(byRef).forEach(k => weekVerses.push(savedVerse(k)));
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
  const cat = catOf(key);
  return h('div', { class: 'verse-saved', 'data-cat': cat.id, style: `border-left-color:${cat.c}` },
    h('div', { class: 'ref' }, h('button', { class: 'ref-link', onclick: () => openBible(b, c, v) }, `${BOOKS[b][0]} ${c}:${v} ›`), cat.n ? h('span', { class: 'cat-tag', style: `background:${fond(cat.c)}` }, cat.n) : null),
    h('p', null, LSG[b][c - 1][v - 1]));
}

/* ---------- Bible : consulter librement toute la Parole ---------- */
const byRef = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };
// Comparaison sans accents ni majuscules ; chaque caractère reste un caractère (pour retrouver la position dans le texte)
const fold = t => { let o = ''; for (const ch of t.toLowerCase()) { const f = ch.normalize('NFD').replace(/[̀-ͯ]/g, ''); o += f.length === 1 ? f : ch; } return o.replace(/[’']/g, "'"); };
let FOLDED_BOOKS = null;
// « Jean 3:16 », « jn 3 », « 1 co 13.4 », « psaume 23 » → { b, c, v }
function parseRef(q) {
  const m = fold(q.trim()).match(/^(\d?\s*[a-z'][a-z' ]*?)\.?\s*(\d+)(?:\s*[:.,]\s*(\d+))?(?:\s*-\s*\d+)?$/);
  if (!m) return null;
  if (!FOLDED_BOOKS) FOLDED_BOOKS = BOOKS.map(x => fold(x[0]).replace(/\s+/g, ''));
  const ABR = { jn: 'jean', mt: 'matthieu', mc: 'marc', lc: 'luc', ac: 'actes', rm: 'romains', es: 'esaie', is: 'esaie', jc: 'jacques', ps: 'psaumes', pr: 'proverbes', ex: 'exode', dt: 'deuteronome' };
  let name = m[1].replace(/\s+/g, '');
  const ab = name.match(/^(\d?)(.*)$/); if (ABR[ab[2]]) name = ab[1] + ABR[ab[2]];
  const names = FOLDED_BOOKS;
  let b = names.indexOf(name);
  if (b < 0) b = names.findIndex(n => n.startsWith(name));
  if (b < 0 && name.endsWith('s')) b = names.indexOf(name.slice(0, -1)); // « psaume » / « psaumes »
  if (b < 0 && !name.endsWith('s')) b = names.indexOf(name + 's');
  if (b < 0) return null;
  if (LSG[b].length === 1 && !m[3]) return { b, c: 1, v: Math.min(Math.max(+m[2], 1), LSG[b][0].length) }; // « Jude 3 » = verset 3
  const c = Math.min(Math.max(+m[2], 1), LSG[b].length);
  const v = m[3] ? Math.min(Math.max(+m[3], 1), LSG[b][c - 1].length) : null;
  return { b, c, v };
}
function openBible(b, c, v) {
  S.pos = { b, c }; save();
  V.tab = 'bible'; V.bv = 'read'; V.goto = v ? `${b}.${c}.${v}` : null; render();
}
function contextBtn(r, before) {
  return h('button', { class: 'ctx-link', onclick: () => { const p = parseRef(r); if (!p) return; if (before) before(); openBible(p.b, p.c, p.v); } }, 'Lire dans son contexte ›');
}
function stepChapter(d) {
  let { b, c } = S.pos; c += d;
  if (c < 1) { if (b === 0) return; b--; c = LSG[b].length; }
  else if (c > LSG[b].length) { if (b === BOOKS.length - 1) return; b++; c = 1; }
  openBible(b, c);
}
function viewBible() {
  const qIn = h('input', { type: 'search', id: 'bible-q', value: V.q, placeholder: 'Un mot ou une référence (Jean 3:16)', 'aria-label': 'Rechercher dans la Bible', enterkeyhint: 'search' });
  const form = h('form', { class: 'bible-search', role: 'search', onsubmit: e => {
    e.preventDefault(); const q = qIn.value.trim(); if (!q) return;
    const r = parseRef(q);
    if (r) { V.q = ''; openBible(r.b, r.c, r.v); return; }
    V.q = q; V.qMax = 100; V.bv = 'search'; render();
  } }, qIn, h('button', { class: 'btn', type: 'submit' }, 'Chercher'));
  const out = [h('div', { class: 'card bible-top' }, form)];
  if (V.bv === 'books') out.push(...bookPicker());
  else if (V.bv === 'chapters') out.push(chapterPicker(V.bb));
  else if (V.bv === 'search') out.push(searchResults(V.q));
  else out.push(...chapterView());
  return out;
}
function setFont(d) { S.font = Math.min(30, Math.max(15, S.font + d)); save(); document.documentElement.style.setProperty('--read-size', S.font + 'px'); }
function chapterView() {
  const { b, c } = S.pos, first = b === 0 && c === 1, last = b === BOOKS.length - 1 && c === LSG[b].length;
  const head = h('div', { class: 'day-head' },
    h('button', { class: 'nav', 'aria-label': 'Chapitre précédent', disabled: first, onclick: () => stepChapter(-1) }, '‹'),
    h('button', { class: 'mid chap-pick', 'aria-label': 'Choisir un livre et un chapitre', onclick: () => { V.bv = 'books'; render(); } },
      h('div', { class: 'passage' }, `${BOOKS[b][0]} ${c}`, h('span', { class: 'caret' }, ' ▾')),
      h('div', { class: 'meta' }, `${b < 39 ? 'Ancien' : 'Nouveau'} Testament · chapitre ${c} sur ${LSG[b].length}`)),
    h('button', { class: 'nav', 'aria-label': 'Chapitre suivant', disabled: last, onclick: () => stepChapter(1) }, '›'));
  const card = h('div', { class: 'card' },
    h('div', { class: 'tools' },
      h('button', { 'aria-label': 'Réduire la taille du texte', onclick: () => setFont(-1) }, 'A−'),
      h('button', { 'aria-label': 'Agrandir la taille du texte', onclick: () => setFont(1) }, 'A+')),
    h('div', { class: 'reader' }, chapterEl(b, c)),
    h('p', { class: 'hint' }, 'Touchez un ou plusieurs versets pour les surligner ou les copier.'));
  const foot = h('div', { class: 'chap-foot' },
    h('button', { class: 'btn alt', disabled: first, onclick: () => stepChapter(-1) }, '‹ Précédent'),
    h('button', { class: 'btn alt', disabled: last, onclick: () => stepChapter(1) }, 'Suivant ›'));
  const bds = h('p', { class: 'center small' }, h('a', { href: `https://www.bible.com/bible/21/${BOOKS[b][2]}.${c}.BDS`, target: '_blank', rel: 'noopener' }, `Lire ${BOOKS[b][0]} ${c} dans la Bible du Semeur ↗`));
  return [head, card, foot, bds];
}
function bookPicker() {
  const grid = (from, to) => h('div', { class: 'book-grid' }, BOOKS.slice(from, to).map((x, i) => h('button', {
    class: 'book' + (from + i === S.pos.b ? ' on' : ''), onclick: () => {
      const b = from + i;
      if (LSG[b].length === 1) openBible(b, 1); else { V.bb = b; V.bv = 'chapters'; render(); }
    } }, x[0])));
  return [
    h('div', { class: 'card' }, h('div', { class: 'picker-head' }, h('h2', null, 'Ancien Testament'), h('button', { class: 'sel-link', onclick: () => { V.bv = 'read'; render(); } }, 'Fermer')), grid(0, 39)),
    h('div', { class: 'card' }, h('h2', null, 'Nouveau Testament'), grid(39, 66))];
}
function chapterPicker(b) {
  return h('div', { class: 'card' },
    h('div', { class: 'picker-head' }, h('button', { class: 'sel-link', onclick: () => { V.bv = 'books'; render(); } }, '‹ Livres'), h('h2', null, BOOKS[b][0]), h('span')),
    h('div', { class: 'chap-grid' }, LSG[b].map((_, i) => h('button', { class: 'chap' + (b === S.pos.b && i + 1 === S.pos.c ? ' on' : ''), onclick: () => openBible(b, i + 1) }, i + 1))));
}
let FOLDED = null; // texte de toute la Bible sans accents, préparé à la première recherche
function searchResults(q) {
  const fq = fold(q).replace(/\s+/g, ' ');
  if (!FOLDED) FOLDED = LSG.map(book => book.map(ch => ch.map(fold)));
  const hits = []; let total = 0, nt = 0;
  FOLDED.forEach((book, b) => book.forEach((ch, c) => ch.forEach((t, v) => {
    const i = t.indexOf(fq); if (i < 0) return;
    total++; if (b >= 39) nt++;
    if (hits.length < V.qMax) hits.push({ b, c: c + 1, v: v + 1, i });
  })));
  const back = h('button', { class: 'sel-link', onclick: () => { V.bv = 'read'; V.q = ''; render(); } }, '‹ Retour à la lecture');
  if (!total) return h('div', { class: 'card' }, back, h('h2', null, `Aucun verset ne contient « ${q} »`),
    h('p', { class: 'muted small' }, 'Essayez un mot plus court ou une autre forme du mot (« aimer », « aime », « amour »), ou une référence comme « Psaumes 23 ».'));
  const list = hits.map(x => {
    const txt = LSG[x.b][x.c - 1][x.v - 1];
    return h('button', { class: 'hit', onclick: () => { V.q = q; openBible(x.b, x.c, x.v); } },
      h('div', { class: 'ref' }, `${BOOKS[x.b][0]} ${x.c}:${x.v}`),
      h('p', null, txt.slice(0, x.i), h('mark', null, txt.slice(x.i, x.i + fq.length)), txt.slice(x.i + fq.length)));
  });
  const fr = n => n.toLocaleString('fr-FR');
  return h('div', { class: 'card' }, back,
    h('h2', null, `${fr(total)} verset${total > 1 ? 's' : ''} avec « ${q} »`),
    h('p', { class: 'muted small' }, `${fr(total - nt)} dans l’Ancien Testament, ${fr(nt)} dans le Nouveau. Touchez un verset pour l’ouvrir dans son chapitre.`),
    list,
    total > hits.length ? h('button', { class: 'btn alt block', onclick: () => { V.qMax += 100; const y = scrollY; render(); scrollTo(0, y); } }, `Afficher plus (${fr(hits.length)} sur ${fr(total)})`) : null);
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
  const keys = Object.keys(S.hl);
  out.push(h('div', { class: 'card' }, h('h2', null, `Versets surlignés (${keys.length})`),
    keys.length ? versesByCat(keys) : h('p', { class: 'muted' }, 'Les versets que vous surlignez pendant la lecture apparaîtront ici, rangés par couleur.')));
  return out;
}
// Liste des versets surlignés, avec un filtre par couleur
function versesByCat(keys) {
  const list = h('div', null, keys.slice().reverse().map(savedVerse));
  const count = id => keys.filter(k => catOf(k).id === id).length;
  const chips = [];
  const filter = (id, btn) => {
    chips.forEach(x => x.classList.toggle('on', x === btn));
    list.querySelectorAll('.verse-saved').forEach(el => { el.hidden = !!id && el.dataset.cat !== id; });
  };
  const all = h('button', { class: 'cat-chip on', onclick: () => filter(null, all) }, `Tous · ${keys.length}`);
  chips.push(all);
  for (const c of S.cats) {
    const k = count(c.id); if (!k) continue;
    const b = h('button', { class: 'cat-chip', onclick: () => filter(c.id, b) }, h('span', { class: 'cat-dot', style: `background:${c.c}` }), c.n ? `${c.n} · ${k}` : `${k}`);
    chips.push(b);
  }
  return [h('div', { class: 'sel-chips' }, chips), list];
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
    themeCard(),
    ...pushCard(),
    catsCard(),
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
      h('button', { class: 'btn alt', onclick: () => { if (confirm('Effacer toute la progression et recommencer ?')) { S = norm(); save(); V.day = null; V.tab = 'today'; render(); } } }, 'Tout réinitialiser')),
    h('div', { class: 'card small muted' },
      h('p', null, 'Texte biblique : Louis Segond (1910), domaine public. La Bible du Semeur (© Biblica) n’est pas incluse : l’application renvoie vers les sources officielles.'),
      h('p', null, 'Aucune donnée personnelle n’est collectée : votre progression reste sur cet appareil. Si vous activez les notifications, seuls l’adresse technique de notification de votre navigateur, votre fuseau horaire et les heures choisies sont conservés, et ils sont effacés dès que vous désactivez.'))
  ];
}

/* ---------- Apparence : style Jardin, Veillée ou automatique ---------- */
// Automatique : Jardin le jour (7 h – 19 h), Veillée la nuit
const NUIT_DEBUT = 19, NUIT_FIN = 7;
const isNight = (d = new Date()) => d.getHours() >= NUIT_DEBUT || d.getHours() < NUIT_FIN;
let sceneKey = '';
function applyTheme() {
  const pref = S.theme || 'auto';
  const t = pref === 'auto' ? (isNight() ? 'veillee' : 'jardin') : pref;
  const changed = document.documentElement.getAttribute('data-theme') !== t;
  document.documentElement.setAttribute('data-theme', t);
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t === 'veillee' ? '#10163a' : '#f2f5f1';
  paintSky(t === 'veillee');
  return changed;
}
// Vérifie chaque minute (et au retour dans l'appli) s'il faut passer du jour à la nuit
setInterval(() => { if ((S.theme || 'auto') === 'auto') applyTheme(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) applyTheme(); });

/* ---------- Décor de nuit : un seul motif par nuit, qui change chaque nuit ---------- */
const MOON_DEFS = '<defs><radialGradient id="mg" cx="40%" cy="38%"><stop offset="0" stop-color="#fffbe9"/><stop offset=".7" stop-color="#f3e3b0"/><stop offset="1" stop-color="#d4bd80"/></radialGradient><radialGradient id="halo"><stop offset=".4" stop-color="#f3dca0" stop-opacity=".32"/><stop offset="1" stop-color="#f3dca0" stop-opacity="0"/></radialGradient></defs>';
const CRATERS = '<g fill="#cdb67a" opacity=".45"><circle cx="42" cy="44" r="4"/><circle cx="58" cy="57" r="5"/><circle cx="56" cy="40" r="2.5"/><circle cx="43" cy="61" r="3"/></g>';
const SCENES = [
  { id: 'etoiles', nom: 'Ciel étoilé', svg: '' }, // seulement les étoiles, plus nombreuses, et une étoile filante
  { id: 'pleine-lune', nom: 'Pleine lune', svg: MOON_DEFS + '<circle cx="50" cy="50" r="50" fill="url(#halo)"/><circle cx="50" cy="50" r="25" fill="url(#mg)"/>' + CRATERS },
  { id: 'demi-lune', nom: 'Demi-lune', svg: MOON_DEFS + '<clipPath id="half"><rect x="0" y="0" width="50" height="100"/></clipPath><circle cx="50" cy="50" r="42" fill="url(#halo)" opacity=".7"/><circle cx="50" cy="50" r="25" fill="#ffffff" opacity=".07"/><g clip-path="url(#half)"><circle cx="50" cy="50" r="25" fill="url(#mg)"/>' + CRATERS + '</g>' },
  { id: 'etoile-christ', nom: 'L’étoile de Christ', svg: '<defs><radialGradient id="sg"><stop offset="0" stop-color="#fff8dc" stop-opacity=".75"/><stop offset="1" stop-color="#f3dca0" stop-opacity="0"/></radialGradient><linearGradient id="sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf2"/><stop offset="1" stop-color="#e7c77e"/></linearGradient></defs><circle cx="50" cy="36" r="30" fill="url(#sg)"/><g stroke="#f7e6b5" stroke-width=".8" opacity=".55"><path d="M50 36 L66 20M50 36 L34 20M50 36 L64 50M50 36 L36 50"/></g><path d="M50 8 L54 32 L74 36 L54 40 L50 96 L46 40 L26 36 L46 32 Z" fill="url(#sf)"/>' },
  { id: 'lampe', nom: 'La lampe (Psaume 119:105)', svg: '<defs><radialGradient id="fl"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".7"/><stop offset="1" stop-color="#ffb84d" stop-opacity="0"/></radialGradient><linearGradient id="lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9c983"/><stop offset="1" stop-color="#9c6f2c"/></linearGradient><linearGradient id="fg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff9a3c"/><stop offset=".6" stop-color="#ffd36e"/><stop offset="1" stop-color="#fff6d6"/></linearGradient></defs><circle cx="84" cy="38" r="16" fill="url(#fl)"/><path d="M22 66 Q10 66 12 57 Q15 51 22 58" fill="none" stroke="#c99a50" stroke-width="3" stroke-linecap="round"/><path d="M20 66 Q20 56 38 54 L66 54 Q80 54 86 48 Q85 60 75 64 Q64 72 40 72 Q24 72 20 66 Z" fill="url(#lb)"/><ellipse cx="44" cy="54" rx="8" ry="2.4" fill="#5d4120"/><ellipse cx="44" cy="76" rx="14" ry="3" fill="#8a6128"/><path d="M86 48 Q79 37 85 24 Q93 37 86 48 Z" fill="url(#fg)"/>' },
  { id: 'colombe', nom: 'La colombe et le rameau (Genèse 8:11)', svg: '<defs><linearGradient id="dv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9d4e8"/></linearGradient><radialGradient id="dg"><stop offset="0" stop-color="#f3dca0" stop-opacity=".28"/><stop offset="1" stop-color="#f3dca0" stop-opacity="0"/></radialGradient></defs><circle cx="52" cy="46" r="46" fill="url(#dg)"/><path d="M50 48 Q62 28 88 24 Q76 40 68 52 Z" fill="#c9c3dd"/><path d="M42 48 Q48 22 74 12 Q66 30 64 50 Z" fill="url(#dv)"/><path d="M20 50 Q28 43 44 45 Q57 46 65 53 Q75 61 90 57 Q82 66 66 66 Q50 68 38 62 Q28 58 20 50 Z" fill="url(#dv)"/><circle cx="24" cy="49" r="1.2" fill="#2a3470"/><path d="M19 49 L13 51 L19 52 Z" fill="#e0b25a"/><path d="M14 51 Q9 60 14 72" fill="none" stroke="#8fae6a" stroke-width="1.6" stroke-linecap="round"/><g fill="#a9c784"><ellipse cx="9" cy="58" rx="4.5" ry="1.8" transform="rotate(-35 9 58)"/><ellipse cx="17" cy="62" rx="4.5" ry="1.8" transform="rotate(30 17 62)"/><ellipse cx="9" cy="67" rx="4.5" ry="1.8" transform="rotate(-30 9 67)"/><ellipse cx="17" cy="71" rx="4" ry="1.6" transform="rotate(35 17 71)"/></g>' }];
// Numéro de la nuit : une nuit va de midi à midi, pour garder le même décor toute la nuit
function nightIndex(d = new Date()) {
  const x = new Date(d); if (x.getHours() < 12) x.setDate(x.getDate() - 1);
  return Math.floor(Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()) / 864e5);
}
const sceneOfTonight = () => SCENES[(nightIndex() * 5) % SCENES.length];
function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
let sky = null;
function paintSky(on) {
  if (!on) { if (sky) sky.hidden = true; return; }
  const sc = sceneOfTonight(), key = sc.id + nightIndex();
  if (!sky) { sky = h('div', { class: 'sky', 'aria-hidden': 'true' }); document.body.prepend(sky); }
  sky.hidden = false;
  if (key === sceneKey) return;
  sceneKey = key;
  const r = rng(nightIndex() % 100000 + 7), dense = sc.id === 'etoiles';
  let stars = '';
  for (let i = 0, n = dense ? 90 : 45; i < n; i++) {
    const x = (r() * 400).toFixed(1), y = (r() * 300).toFixed(1), s = (r() * (dense ? 1.3 : 1) + .35).toFixed(2), o = (r() * .55 + .3).toFixed(2);
    stars += `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff" opacity="${o}"${i % 7 === 0 ? ` class="tw" style="animation-delay:${(r() * 4).toFixed(1)}s"` : ''}/>`;
  }
  if (dense) stars = '<defs><linearGradient id="voie" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fb0ff" stop-opacity="0"/><stop offset=".5" stop-color="#c9d2ff" stop-opacity=".13"/><stop offset="1" stop-color="#9fb0ff" stop-opacity="0"/></linearGradient><linearGradient id="filante" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient></defs><path d="M-20 260 Q180 120 420 20 L420 70 Q190 170 -20 300 Z" fill="url(#voie)"/>' + stars + '<path class="filante" d="M250 40 L330 70" stroke="url(#filante)" stroke-width="1.6" stroke-linecap="round"/>';
  sky.innerHTML = `<svg class="stars" viewBox="0 0 400 300" preserveAspectRatio="xMidYMin slice">${stars}</svg>` +
    (sc.svg ? `<svg class="motif motif-${sc.id}" viewBox="0 0 100 100">${sc.svg}</svg>` : '');
}
function themeCard() {
  const opts = [
    ['auto', 'Automatique', 'sw-auto'],
    ['jardin', 'Jardin', 'sw-jardin'],
    ['veillee', 'Veillée', 'sw-veillee']];
  const cur = S.theme || 'auto';
  return h('div', { class: 'card' }, h('h2', null, 'Apparence'),
    h('p', { class: 'muted small' }, 'Automatique : Jardin le jour (de 7 h à 19 h) et Veillée la nuit. Jardin : clair et frais. Veillée : bleu nuit et doré, avec un décor de nuit qui change chaque nuit (ciel étoilé, pleine lune, demi-lune, étoile de Christ, lampe, colombe). Vous pouvez changer quand vous voulez.'),
    h('div', { class: 'themes', role: 'radiogroup', 'aria-label': 'Style de l’application' }, opts.map(([id, nom, sw]) =>
      h('button', { class: 'theme-opt' + (cur === id ? ' on' : ''), role: 'radio', 'aria-checked': cur === id ? 'true' : 'false',
        onclick: () => { S.theme = id; save(); applyTheme(); const y = scrollY; render(); scrollTo(0, y); } },
        h('span', { class: 'sw ' + sw }, h('i'), h('i'), h('i')), nom))),
    h('p', { class: 'muted small tonight' }, `Décor de cette nuit : ${sceneOfTonight().nom}`));
}

/* ---------- Couleurs de surlignage (noms libres) ---------- */
function catsCard() {
  const used = id => Object.keys(S.hl).filter(k => catOf(k).id === id).length;
  const rows = S.cats.map(c => { const u = used(c.id); return h('div', { class: 'cat-line' },
    h('span', { class: 'cat-dot big', style: `background:${c.c}` }),
    h('input', { type: 'text', value: c.n, maxlength: 30, placeholder: 'Sans nom', 'aria-label': 'Nom de cette couleur',
      onchange: e => { c.n = e.target.value.trim(); save(); } }),
    h('span', { class: 'cat-count' }, u ? `${u} verset${u > 1 ? 's' : ''}` : '')); });
  return h('div', { class: 'card' }, h('h2', null, 'Mes couleurs de surlignage'),
    h('p', { class: 'muted small' }, 'Organisez vos versets comme vous le souhaitez : vous pouvez donner un nom à chaque couleur (par exemple « Combat », « Promesses », « Prière »…). C’est facultatif.'),
    rows);
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

/* ---------- Notifications : la parole de Dieu aux heures choisies ---------- */
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
    body: JSON.stringify({ subscription: sub, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, hours: myHours() }) });
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
  const title = h('h2', null, 'La parole de Dieu dans la journée');
  const hs = myHours();
  const intro = h('p', { class: 'muted small' }, 'Une parole d’encouragement à des moments choisis : Dieu n’abandonne pas ses enfants. Par défaut, 3 versets par jour, à 6 h, 12 h et 18 h. Vous pouvez en ajouter ou en enlever comme vous le souhaitez.');
  const setHours = list => {
    S.pushHours = [...new Set(list)].sort((a, b) => a - b); save();
    if (pushSub) sendSub(pushSub, 'POST').catch(() => {});
    const y = scrollY; render(); scrollTo(0, y); updateFab();
  };
  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  const PRESETS = [
    ['1 par jour', [6]],
    ['3 par jour', HEURES_DEFAUT],
    ['5 par jour', [6, 9, 12, 15, 18]],
    ['Toutes les heures', Array.from({ length: 15 }, (_, i) => i + 7)]];
  const presets = h('div', { class: 'presets' }, PRESETS.map(([nom, l]) =>
    h('button', { class: 'cat-chip' + (same(hs, l) ? ' on' : ''), onclick: () => setHours(l) }, nom)));
  const grid = h('div', { class: 'hour-grid', role: 'group', 'aria-label': 'Heures choisies' },
    Array.from({ length: 24 }, (_, i) => h('button', {
      class: 'hour-chip' + (hs.includes(i) ? ' on' : ''), 'aria-pressed': hs.includes(i) ? 'true' : 'false',
      onclick: () => { if (hs.includes(i)) { if (hs.length > 1) setHours(hs.filter(x => x !== i)); } else setHours([...hs, i]); } }, `${pad(i)} h`)));
  const resume = h('p', { class: 'small' }, h('b', null, `${hs.length} verset${hs.length > 1 ? 's' : ''} par jour`), ' : ', hs.map(x => `${pad(x)} h`).join(', '),
    hs.length === 15 && hs[0] === 7 && hs[14] === 21 ? ' (de 7 h à 21 h)' : '');
  const chooser = [intro, presets, h('details', { class: 'more-hours' }, h('summary', null, 'Choisir les heures une par une'), grid), resume];

  let notif;
  if (!PUSH_PRET || !pushSupported()) notif = [h('p', { class: 'small muted' }, 'Ce navigateur ne permet pas les notifications : le verset s’affiche dans l’application à ces moments-là.')];
  else if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !(matchMedia('(display-mode: standalone)').matches || navigator.standalone))
    notif = [h('p', { class: 'small' }, 'Pour recevoir les notifications sur iPhone, installez d’abord l’application sur l’écran d’accueil (voir ci-dessus), puis ouvrez-la depuis son icône.')];
  else {
    if (pushSub === undefined) navigator.serviceWorker.ready.then(r => r.pushManager.getSubscription()).then(s => { pushSub = s; if (V.tab === 'settings') { const y = scrollY; render(); scrollTo(0, y); } });
    const status = h('p', { class: 'small' });
    const run = fn => async () => { status.textContent = 'Un instant…'; try { await fn(); status.textContent = ''; render(); } catch (e) { status.textContent = 'Échec : vérifiez votre connexion et réessayez.'; } };
    notif = [
      pushSub ? h('p', { class: 'small ok-txt' }, '✓ Notifications activées sur cet appareil') : h('p', { class: 'small muted' }, 'Activez les notifications pour recevoir ces versets même quand l’application est fermée.'),
      h('p', null, pushSub ? h('button', { class: 'btn alt', onclick: run(pushOff) }, 'Désactiver les notifications')
        : h('button', { class: 'btn', onclick: run(pushOn) }, 'Activer les notifications')),
      status];
  }
  return [h('div', { class: 'card' }, title, ...chooser, h('hr', { class: 'sep' }), ...notif)];
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
      S = norm(o); save(); V.day = null; V.tab = 'today'; render();
    } catch (err) { alert('Fichier non reconnu.'); }
  };
  r.readAsText(f);
}

/* ---------- Démarrage ---------- */
applyTheme();
document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => { V.tab = b.dataset.tab; if (V.tab === 'today') V.day = null; if (V.tab === 'bible') V.bv = 'read'; render(); }));

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
