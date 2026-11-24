/* Bible en un an — lecture et méditation, du lundi au samedi.
   Textes : Louis Segond 1910 et Darby 1885 (domaine public). Jeux : quiz et versets à compléter. Aucune donnée n'est envoyée nulle part :
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
/* ---------- Versions de la Bible ----------
   Même découpage en versets pour toutes les versions (celui de la Segond) :
   les surlignages restent donc valables quelle que soit la version choisie. */
const VERSIONS = {
  lsg: { nom: 'Louis Segond', court: 'Segond' },
  darby: { nom: 'Darby', court: 'Darby', src: 'data/darby.js', glob: 'BIBLE_DARBY', titres: 'BIBLE_DARBY_TITRES' }
};
const TEXTS = {}, TITRES = {}, loading = {};
const ver = () => TEXTS[S.version] ? S.version : 'lsg';
const BIB = () => TEXTS[ver()];
const verseTxt = (b, c, v) => BIB()[b][c - 1][v - 1] || LSG[b][c - 1][v - 1] + ' (Segond)'; // 3 versets absents de la Darby
function loadVersion(id) {
  if (TEXTS[id]) return Promise.resolve();
  return loading[id] || (loading[id] = new Promise((ok, ko) => {
    const sc = document.createElement('script'); sc.src = VERSIONS[id].src;
    sc.onload = () => { TEXTS[id] = window[VERSIONS[id].glob]; TITRES[id] = window[VERSIONS[id].titres] || {}; TEXTS[id] ? ok() : ko(); };
    sc.onerror = () => { delete loading[id]; sc.remove(); ko(); };
    document.head.append(sc);
  }));
}
function rerender() { const y = scrollY; render(); scrollTo(0, y); }
function setVersion(id) {
  V.ver = 'txt'; S.version = id; save(); FOLDED = null;
  if (TEXTS[id]) return rerender();
  V.loadingVer = id; rerender();
  loadVersion(id).then(() => { V.loadingVer = null; FOLDED = null; rerender(); },
    () => { V.loadingVer = null; S.version = 'lsg'; save(); rerender(); alert('Impossible de charger la version Darby. Vérifiez votre connexion internet, puis réessayez.'); });
}
// Boutons de choix de la version (avec, dans la lecture du jour, le lien vers la Bible du Semeur)
function versionSeg(semeur) {
  const btns = Object.keys(VERSIONS).map(id => h('button', {
    class: V.ver !== 'bds' && (V.loadingVer || ver()) === id ? 'on' : '', onclick: () => setVersion(id) },
    V.loadingVer === id ? 'Chargement…' : VERSIONS[id].court));
  if (semeur) btns.push(h('button', { class: V.ver === 'bds' ? 'on' : '', onclick: () => { V.ver = 'bds'; render(); } }, 'Semeur'));
  return h('div', { class: 'seg', role: 'tablist', 'aria-label': 'Version de la Bible' }, btns);
}
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
const V = { g: null, tab: 'today', day: null, ver: 'txt', loadingVer: null, sel: new Set(), bv: 'read', bb: null, bc: 1, vback: 'chapters', q: '', qMax: 100, goto: null, pt: null, pg: null };

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
  s.vOff = s.vOff === true; // versets de la journée coupés, mais rappel de lecture possible
  s.lect = Object.assign({ on: false, h: Math.min(22, Math.max(5, parseInt(s.remind, 10) || 7)) }, s.lect);
  if (!(s.version in VERSIONS)) s.version = 'lsg';
  s.jeux = Object.assign({ qp: 'tout', src: 'connus', niv: 'facile' }, s.jeux);
  for (const g of ['qcm', 'trous']) s.jeux[g] = Object.assign({ n: 0, best: 0 }, s.jeux[g]);
  s.mt = s.mt && typeof s.mt === 'object' ? s.mt : {}; // dates de modification (synchronisation entre appareils)
  s.prenom = typeof s.prenom === 'string' ? s.prenom.slice(0, 30) : '';
  s.pri = Object.assign({ enf: '', fam: '', n: 0, fait: {} }, s.pri); // Prier avec la Parole : prénoms, nombre de temps de prière
  if (!s.pri.fait || typeof s.pri.fait !== 'object') s.pri.fait = {};
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
function save() { try { stamp(); } catch (e) {} try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {} try { syncLecture(); } catch (e) {} try { schedSync(); } catch (e) {} }

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
// Jour pour lequel la page a été dessinée : si l'appli reste ouverte (ou en arrière-plan) après minuit,
// on la redessine pour afficher le bon jour.
let renderedDay = '';
function checkNewDay() {
  if (!S.start || iso(today()) === renderedDay || V.sel.size) return;
  if (V.tab === 'bible' || V.tab === 'games' || V.tab === 'prayer') { renderedDay = iso(today()); return; } // ne pas perdre la lecture ou la partie en cours
  if (V.tab === 'today') V.day = null;
  render();
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkNewDay(); });
setInterval(checkNewDay, 60000);

function render() {
  renderedDay = iso(today());
  document.documentElement.style.setProperty('--read-size', S.font + 'px');
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === V.tab));
  view.replaceChildren();
  clearSel();
  if (!S.start && V.tab !== 'bible' && V.tab !== 'games' && V.tab !== 'prayer') { view.append(welcome()); return; }
  const fn = { today: viewToday, bible: viewBible, prayer: viewPriere, games: viewGames, plan: viewPlan, progress: viewProgress, settings: viewSettings }[V.tab];
  view.append(...[].concat(fn()).filter(Boolean));
  window.scrollTo(0, 0);
  if (V.goto) { const sp = verseEl(V.goto); V.goto = null; if (sp) { sp.scrollIntoView({ block: 'center' }); sp.classList.add('flash'); } }
  setupChapbar();
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
      h('button', { class: 'btn alt', onclick: () => startOn(iso(today())) }, 'Commencer aujourd’hui')),
    window.crypto && crypto.subtle ? h('details', { class: 'more-hours' }, h('summary', null, 'J’ai déjà commencé sur un autre appareil'),
      h('p', { class: 'small' }, 'Tapez le code personnel affiché dans Réglages → Mon profil sur votre autre appareil :'),
      linkForm(() => { V.tab = 'today'; render(); })) : null);
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
    h('div', { class: 'ref' }, v.r, h('div', { class: 'ref-acts' }, contextBtn(v.r), shareBtn(v))),
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

/* ---------- Partager un verset (WhatsApp, statut, story…) ---------- */
const SITE = 'https://bible-en-un-an.vercel.app';
const shareText = v => `« ${v.t} »\n— ${v.r} (${v.nom || 'Louis Segond'})\n\n🙏 Une parole de Dieu chaque jour avec l’appli gratuite « Bible en un an » : ${SITE}`;
// Découpe un texte en lignes qui tiennent dans la largeur donnée
function wrapLines(ctx, text, maxW) {
  const out = []; let line = '';
  for (const w of text.split(/[ \t\n]+/)) { // l'espace insécable ne coupe pas : « et » restent collés au texte
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
  }
  if (line) out.push(line);
  return out;
}
let shareIcon = null;
function loadShareIcon() {
  if (shareIcon) return shareIcon;
  return shareIcon = new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'icons/icon-192.png'; });
}
// Image au format story (1080 × 1920) : style Jardin (vert) ou Veillée (nuit étoilée)
/* --- Décors supplémentaires pour l'image d'un verset (inspirés des visuels choisis par l'utilisateur) --- */
const SERIF = '"Cormorant Garamond", Georgia, serif', SANS = '"Plus Jakarta Sans", system-ui, sans-serif', SCRIPT = '"Great Vibes", "Cormorant Garamond", cursive';
function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const spacing = (c, x) => { if ('letterSpacing' in c) c.letterSpacing = x; };
// Taille de texte la plus grande qui tient dans la largeur et la hauteur données
function fitText(c, text, font, maxW, maxH, from, to, lhk) {
  let size = from, lines, lh;
  for (; size >= to; size -= 2) { c.font = font(size); lines = wrapLines(c, text, maxW); lh = size * lhk; if (lines.length * lh <= maxH) break; }
  return { size, lines, lh, h: lines.length * lh };
}
// Signature de l'appli (icône + nom + adresse), centrée
function brandMark(c, y, icon, light) {
  const W = 1080;
  c.save(); c.textAlign = 'left'; c.font = `700 34px ${SANS}`;
  const w1 = c.measureText('Bible en un an').width; c.font = `500 25px ${SANS}`;
  const w2 = c.measureText('Appli gratuite · bible-en-un-an.vercel.app').width;
  const tw = 56 + 18 + Math.max(w1, w2), x = (W - tw) / 2;
  if (light) { c.fillStyle = 'rgba(20,12,6,.42)'; c.beginPath(); c.roundRect ? c.roundRect(x - 26, y - 46, tw + 52, 100, 28) : c.rect(x - 26, y - 46, tw + 52, 100); c.fill(); }
  if (icon) { c.save(); c.beginPath(); c.roundRect ? c.roundRect(x, y - 28, 56, 56, 14) : c.rect(x, y - 28, 56, 56); c.clip(); c.drawImage(icon, x, y - 28, 56, 56); c.restore(); }
  c.fillStyle = light ? '#fff8ec' : '#3d2f24'; c.font = `700 34px ${SANS}`; c.fillText('Bible en un an', x + 74, y);
  c.fillStyle = light ? 'rgba(255,240,215,.85)' : '#7d6a5a'; c.font = `500 25px ${SANS}`; c.fillText('Appli gratuite · bible-en-un-an.vercel.app', x + 74, y + 30);
  c.restore();
}
// Filet orné : deux traits et un petit motif au centre
function filet(c, y, color, w = 200, motif = 'losange') {
  const W = 1080; c.save(); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 2.5;
  c.beginPath(); c.moveTo(W / 2 - w, y); c.lineTo(W / 2 - 22, y); c.moveTo(W / 2 + 22, y); c.lineTo(W / 2 + w, y); c.stroke();
  c.translate(W / 2, y);
  if (motif === 'coeur') { c.beginPath(); c.moveTo(0, 12); c.bezierCurveTo(-20, -2, -12, -16, 0, -5); c.bezierCurveTo(12, -16, 20, -2, 0, 12); c.fill(); }
  else if (motif === 'anneaux') { c.lineWidth = 2.5; c.beginPath(); c.arc(-14, 0, 5, 0, 7); c.stroke(); c.beginPath(); c.arc(14, 0, 5, 0, 7); c.stroke(); c.beginPath(); c.ellipse(0, 0, 4, 9, 0, 0, 7); c.fill(); }
  else { c.rotate(Math.PI / 4); c.fillRect(-6, -6, 12, 12); }
  c.restore();
}
// Rameau de feuilles (olivier) : tige + feuilles allongées
function rameau(c, x, y, ang, len, col, rnd, blur = 0, alpha = 1) {
  c.save(); if (blur) c.filter = `blur(${blur}px)`; c.globalAlpha = alpha; c.translate(x, y); c.rotate(ang);
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len / 2, -len * .06, len, 0); c.stroke();
  for (let i = 1; i < 9; i++) { const t = i / 9; c.save(); c.translate(len * t, -len * .03 * Math.sin(t * Math.PI)); c.rotate((i % 2 ? 1 : -1) * (.55 + rnd() * .25)); c.beginPath(); c.ellipse(42, 0, 46, 13, 0, 0, 7); c.fill(); c.restore(); }
  c.restore();
}

// 1. Éclat : la page s'illumine (fond sombre et doré, gerbe de lumière, étincelles)
function drawEclat(c, v, icon, rnd) {
  const W = 1080, H = 1920;
  let g = c.createRadialGradient(540, 860, 40, 540, 900, 1300);
  g.addColorStop(0, '#8a5a2b'); g.addColorStop(.35, '#4a2e17'); g.addColorStop(1, '#120a05');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // Rayons venus d'en haut à gauche
  c.save(); c.globalCompositeOperation = 'lighter'; c.filter = 'blur(30px)';
  for (let i = 0; i < 5; i++) { c.save(); c.translate(150 + i * 90, -100); c.rotate(-.55 + i * .06); c.fillStyle = `rgba(255,214,150,${.06 + rnd() * .05})`; c.fillRect(-40, 0, 80 + rnd() * 60, 1400); c.restore(); }
  c.restore();
  // Texte du verset, mis en page pour savoir quelle zone éclairer
  const T = fitText(c, v.t.trim(), s => `600 ${s}px ${SERIF}`, 780, 640, 84, 34, 1.24);
  const refS = 46, blockH = T.h + 60 + 30 + refS, cy = 900, top = cy - blockH / 2;
  // Page de livre (papier ancien) en perspective
  c.save(); c.beginPath(); c.moveTo(-60, 420); c.bezierCurveTo(300, 360, 780, 360, 1140, 430); c.lineTo(1140, 1450); c.bezierCurveTo(760, 1400, 320, 1400, -60, 1460); c.closePath();
  const pg = c.createLinearGradient(0, 400, 0, 1460); pg.addColorStop(0, '#6b4c2c'); pg.addColorStop(.5, '#c9a878'); pg.addColorStop(1, '#5e4126');
  c.fillStyle = pg; c.fill(); c.clip();
  // Lignes de texte floues sur la page
  c.filter = 'blur(4px)'; c.fillStyle = 'rgba(40,25,12,.42)';
  for (let row = 0; row < 26; row++) { const y = 470 + row * 38; let x = 60 + rnd() * 30; while (x < 1020) { const w = 30 + rnd() * 110; c.fillRect(x, y, w, 12); x += w + 14 + rnd() * 10; } }
  c.restore();
  // Halo central (la zone du verset devient lumineuse)
  const rx = Math.max(...T.lines.map(l => { c.font = `600 ${T.size}px ${SERIF}`; return c.measureText(l).width; })) / 2 + 170, ry = blockH / 2 + 190;
  c.save(); c.translate(540, cy); c.scale(rx / ry, 1);
  let halo = c.createRadialGradient(0, 0, 10, 0, 0, ry);
  halo.addColorStop(0, 'rgba(255,248,228,1)'); halo.addColorStop(.55, 'rgba(255,236,196,.95)'); halo.addColorStop(.8, 'rgba(255,200,120,.45)'); halo.addColorStop(1, 'rgba(255,180,90,0)');
  c.fillStyle = halo; c.beginPath(); c.arc(0, 0, ry, 0, 7); c.fill(); c.restore();
  // Gerbe d'étincelles au-dessus du verset
  c.save(); c.globalCompositeOperation = 'lighter';
  const sx = 640, sy = top - 30;
  for (let i = 0; i < 70; i++) {
    const a = -Math.PI / 2 + (rnd() - .5) * 2.2, l = 80 + rnd() * 380;
    const lg = c.createLinearGradient(sx, sy, sx + Math.cos(a) * l, sy + Math.sin(a) * l);
    lg.addColorStop(0, 'rgba(255,230,170,.9)'); lg.addColorStop(1, 'rgba(255,180,80,0)');
    c.strokeStyle = lg; c.lineWidth = .8 + rnd() * 2; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l); c.stroke();
  }
  for (let i = 0; i < 220; i++) {
    const a = rnd() * Math.PI * 2, d = 40 + Math.pow(rnd(), .6) * 620, x = sx + Math.cos(a) * d, y = sy + Math.sin(a) * d * .75 - rnd() * 200;
    const r = rnd() * 4 + .6; const p = c.createRadialGradient(x, y, 0, x, y, r * 3);
    p.addColorStop(0, `rgba(255,226,160,${.4 + rnd() * .6})`); p.addColorStop(1, 'rgba(255,190,90,0)');
    c.fillStyle = p; c.beginPath(); c.arc(x, y, r * 3, 0, 7); c.fill();
  }
  const core = c.createRadialGradient(sx, sy, 0, sx, sy, 120); core.addColorStop(0, 'rgba(255,255,240,.95)'); core.addColorStop(1, 'rgba(255,200,100,0)');
  c.fillStyle = core; c.beginPath(); c.arc(sx, sy, 120, 0, 7); c.fill();
  c.restore();
  // Tranche du livre, table et reflet
  c.fillStyle = '#2a1a0e'; c.beginPath(); c.moveTo(-60, 1460); c.bezierCurveTo(320, 1400, 760, 1400, 1140, 1450); c.lineTo(1140, 1560); c.bezierCurveTo(700, 1520, 380, 1520, -60, 1570); c.fill();
  const tb = c.createLinearGradient(0, 1540, 0, H); tb.addColorStop(0, '#3a2414'); tb.addColorStop(1, '#0d0704'); c.fillStyle = tb; c.fillRect(0, 1555, W, H - 1555);
  c.save(); c.globalCompositeOperation = 'lighter'; c.filter = 'blur(10px)';
  for (let i = 0; i < 9; i++) { c.fillStyle = `rgba(255,190,90,${.5 - i * .05})`; c.beginPath(); c.ellipse(560 + (rnd() - .5) * 30, 1600 + i * 34, 26 - i * 1.5, 10, 0, 0, 7); c.fill(); }
  const star = c.createRadialGradient(560, 1500, 0, 560, 1500, 90); star.addColorStop(0, 'rgba(255,240,200,.9)'); star.addColorStop(1, 'rgba(255,170,60,0)'); c.fillStyle = star; c.filter = 'none'; c.beginPath(); c.arc(560, 1500, 90, 0, 7); c.fill();
  c.restore();
  // Feuilles d'olivier sombres (premier plan, floues)
  rameau(c, -30, 520, .25, 420, '#3c4a2c', rnd, 4, .9);
  rameau(c, -40, 1720, -.25, 520, '#46553a', rnd, 7, .85);
  // Verset
  c.textAlign = 'center'; c.fillStyle = '#2b1a0e';
  let y = top + T.size * .85;
  c.font = `600 ${T.size}px ${SERIF}`;
  for (const l of T.lines) { c.fillText(l, 540, y); y += T.lh; }
  // Laurier rouge et référence
  const ly = y - T.lh + 55;
  filet(c, ly, '#8e2a26', 170, 'coeur');
  c.fillStyle = '#2b1a0e'; c.font = `500 ${refS - 4}px Georgia, "Times New Roman", serif`; c.fillText(`— ${v.r} —`, 540, ly + 30 + refS);
  brandMark(c, 1760, icon, true);
}

// 2. Page surlignée : gros plan sur une page imprimée, passage surligné au feutre jaune
function drawPage(c, v, icon, rnd) {
  const W = 1080, H = 1920;
  let g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#d9d3c6'); g.addColorStop(.12, '#efebe2'); g.addColorStop(.7, '#f5f2ea'); g.addColorStop(1, '#e6e1d6');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  const vg = c.createRadialGradient(540, 960, 400, 540, 960, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(60,50,35,.28)');
  c.fillStyle = vg; c.fillRect(0, 0, W, H);
  // Texte imprimé flou au-dessus et au-dessous
  const mots = 'et il dit à ses disciples car voici que je vous le dis en vérité le Seigneur est ma lumière et mon salut de qui aurais-je crainte heureux celui qui marche dans la loi de l Éternel'.split(' ');
  const faux = (y0, y1, blur) => {
    c.save(); c.filter = `blur(${blur}px)`; c.fillStyle = 'rgba(30,28,24,.75)'; c.font = `500 40px Georgia, serif`; c.textAlign = 'left';
    for (let y = y0; y < y1; y += 58) { let line = ''; while (c.measureText(line).width < 1000) line += mots[Math.floor(rnd() * mots.length)] + ' '; c.fillText(line, 40 + rnd() * 20, y); }
    c.restore();
  };
  // Mise en page du passage
  c.textAlign = 'center';
  const T = fitText(c, v.t.trim(), s => `500 ${s}px Georgia, "Times New Roman", serif`, 900, 760, 64, 32, 1.32);
  const refS = 112, blockH = refS + 50 + T.h, top = 960 - blockH / 2;
  faux(60, top - 60, 6); faux(top + blockH + 110, 1700, 7.5);
  // Référence en très grand
  c.fillStyle = '#111'; c.font = `700 ${refS}px Georgia, "Times New Roman", serif`; c.fillText(v.r, 540, top + refS * .8);
  // Verset, avec surlignage jaune sur le milieu du passage
  c.font = `500 ${T.size}px Georgia, "Times New Roman", serif`;
  const n = T.lines.length, a = n < 3 ? 0 : Math.floor(n * .34), b = n < 3 ? n - 1 : Math.max(a, Math.ceil(n * .66) - 1);
  let y = top + refS + 50 + T.size * .85;
  T.lines.forEach((l, i) => {
    if (i >= a && i <= b) {
      const w = c.measureText(l).width; c.save(); c.fillStyle = 'rgba(250,240,40,.78)'; c.translate(540, y - T.size * .32); c.rotate(-.006 + (rnd() - .5) * .006);
      c.beginPath(); c.roundRect ? c.roundRect(-w / 2 - 12, -T.size * .5, w + 24, T.size * .92, 6) : c.rect(-w / 2 - 12, -T.size * .5, w + 24, T.size * .92); c.fill(); c.restore();
    }
    c.fillStyle = '#141414'; c.fillText(l, 540, y); y += T.lh;
  });
  // Ombre de la reliure à gauche
  const sp = c.createLinearGradient(0, 0, 90, 0); sp.addColorStop(0, 'rgba(60,50,35,.35)'); sp.addColorStop(1, 'rgba(60,50,35,0)'); c.fillStyle = sp; c.fillRect(0, 0, 90, H);
  const bas = c.createLinearGradient(0, 1620, 0, 1760); bas.addColorStop(0, 'rgba(242,238,229,0)'); bas.addColorStop(1, 'rgba(242,238,229,.96)'); c.fillStyle = bas; c.fillRect(0, 1620, W, 300);
  brandMark(c, 1790, icon, false);
}

// Montagnes en couches (lignes de crête irrégulières)
function crete(c, base, amp, col, rnd, W = 1080, H = 1920) {
  const f = [rnd() * 6, rnd() * 6, rnd() * 6], k = [.004 + rnd() * .003, .011 + rnd() * .006, .03 + rnd() * .01];
  c.beginPath(); c.moveTo(0, H);
  for (let x = 0; x <= W; x += 8) c.lineTo(x, base - amp * (Math.sin(x * k[0] + f[0]) * .6 + Math.sin(x * k[1] + f[1]) * .3 + Math.sin(x * k[2] + f[2]) * .1));
  c.lineTo(W, H); c.closePath(); c.fillStyle = col; c.fill();
}
// Nuages doux (amas d'ellipses floues)
function nuages(c, rnd, y0, y1, colTop, colBot, n = 7) {
  c.save(); c.filter = 'blur(22px)';
  for (let i = 0; i < n; i++) {
    const x = rnd() * 1080, y = y0 + rnd() * (y1 - y0), w = 160 + rnd() * 260;
    for (let j = 0; j < 6; j++) { const g = c.createLinearGradient(0, y - 60, 0, y + 60); g.addColorStop(0, colTop); g.addColorStop(1, colBot); c.fillStyle = g; c.beginPath(); c.ellipse(x + (rnd() - .5) * w, y + (rnd() - .5) * 40, w * (.3 + rnd() * .3), 30 + rnd() * 30, 0, 0, 7); c.fill(); }
  }
  c.restore();
}

// 3. Montagnes : lever de soleil sur les montagnes, sentier de pierres
function drawMontagne(c, v, icon, rnd) {
  const W = 1080, H = 1920;
  let g = c.createLinearGradient(0, 0, 0, 1300);
  g.addColorStop(0, '#8fa9c6'); g.addColorStop(.35, '#cdd3d6'); g.addColorStop(.7, '#f3dcb6'); g.addColorStop(1, '#f6b867');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  nuages(c, rnd, 80, 700, 'rgba(255,250,240,.75)', 'rgba(240,190,140,.55)', 8);
  const sun = c.createRadialGradient(930, 1230, 10, 930, 1230, 520); sun.addColorStop(0, 'rgba(255,252,230,1)'); sun.addColorStop(.12, 'rgba(255,230,160,.95)'); sun.addColorStop(1, 'rgba(255,190,100,0)');
  c.fillStyle = sun; c.fillRect(0, 0, W, H);
  crete(c, 1250, 90, '#d9b393', rnd); crete(c, 1330, 120, '#b98f72', rnd);
  const brume = c.createLinearGradient(0, 1180, 0, 1620); brume.addColorStop(0, 'rgba(250,215,170,0)'); brume.addColorStop(.55, 'rgba(250,215,170,.5)'); brume.addColorStop(1, 'rgba(250,215,170,0)'); c.fillStyle = brume; c.fillRect(0, 1180, W, 440);
  crete(c, 1440, 140, '#8a6a55', rnd); crete(c, 1560, 160, '#5d4a3c', rnd);
  // Sentier de pierres au premier plan
  c.fillStyle = '#3e3328'; c.beginPath(); c.moveTo(0, 1640); c.quadraticCurveTo(540, 1580, 1080, 1660); c.lineTo(1080, H); c.lineTo(0, H); c.fill();
  c.save(); c.beginPath(); c.moveTo(380, 1640); c.lineTo(640, 1630); c.lineTo(900, H); c.lineTo(80, H); c.closePath(); c.clip();
  const pth = c.createLinearGradient(0, 1630, 0, H); pth.addColorStop(0, '#a58c70'); pth.addColorStop(1, '#6f5c49'); c.fillStyle = pth; c.fillRect(0, 1600, W, 400);
  for (let i = 0; i < 70; i++) { const y = 1650 + Math.pow(rnd(), .8) * 280, s = 10 + (y - 1640) * .18; const px = 80 + rnd() * 820, rx = s * (1 + rnd()), ry = s * .5; c.fillStyle = 'rgba(40,30,20,.35)'; c.beginPath(); c.ellipse(px + 3, y + 4, rx, ry, 0, 0, 7); c.fill(); c.fillStyle = `hsl(32, ${10 + rnd() * 10}%, ${52 + rnd() * 22}%)`; c.beginPath(); c.ellipse(px, y, rx, ry, 0, 0, 7); c.fill(); }
  c.restore();
  // Herbes
  c.strokeStyle = 'rgba(70,80,40,.8)'; c.lineWidth = 3;
  for (let i = 0; i < 90; i++) { const x = rnd() < .5 ? rnd() * 330 : 760 + rnd() * 320, y = 1650 + rnd() * 120; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + (rnd() - .5) * 20, y - 30, x + (rnd() - .5) * 40, y - 50 - rnd() * 40); c.stroke(); }
  // Verset (bleu nuit, classique)
  c.textAlign = 'center';
  const T = fitText(c, v.t.trim(), s => `700 ${s}px ${SERIF}`, 860, 700, 92, 36, 1.2);
  const top = 230 + Math.max(0, (720 - T.h) / 2);
  c.fillStyle = '#1b2840'; c.font = `700 ${T.size}px ${SERIF}`;
  c.save(); c.shadowColor = 'rgba(255,250,235,.7)'; c.shadowBlur = 18;
  let y = top + T.size * .85; for (const l of T.lines) { c.fillText(l, 540, y); y += T.lh; }
  c.restore();
  const fy = y - T.lh + 70; filet(c, fy, '#6b4a33', 180, 'anneaux');
  c.fillStyle = '#2b2a2a'; c.font = `500 44px Georgia, "Times New Roman", serif`; c.fillText(v.r, 540, fy + 70);
  c.font = `500 34px ${SERIF}`; c.fillText(`(Version ${v.nom || 'Louis Segond'})`, 540, fy + 112);
  brandMark(c, 1830, icon, true);
}

// 4. Lac : coucher de soleil sur un lac, falaises, ponton et lanterne
function drawLac(c, v, icon, rnd) {
  const W = 1080, H = 1920, hz = 1080;
  let g = c.createLinearGradient(0, 0, 0, hz);
  g.addColorStop(0, '#e9d3bb'); g.addColorStop(.5, '#f5dcb7'); g.addColorStop(1, '#f5b46a');
  c.fillStyle = g; c.fillRect(0, 0, W, hz);
  nuages(c, rnd, 40, 560, 'rgba(255,245,230,.7)', 'rgba(190,140,110,.5)', 9);
  const sun = c.createRadialGradient(780, hz - 40, 5, 780, hz - 40, 480); sun.addColorStop(0, 'rgba(255,253,235,1)'); sun.addColorStop(.1, 'rgba(255,236,180,.95)'); sun.addColorStop(1, 'rgba(255,200,120,0)');
  c.fillStyle = sun; c.fillRect(0, 0, W, hz + 60);
  // Falaises à gauche et à droite
  const falaise = (pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (const [x, y] of pts.slice(1)) c.lineTo(x + (rnd() - .5) * 10, y + (rnd() - .5) * 10); c.closePath(); c.fillStyle = col; c.fill(); };
  const fg = c.createLinearGradient(0, 300, 0, hz); fg.addColorStop(0, '#6e4a33'); fg.addColorStop(1, '#3d2a1e');
  falaise([[0, hz], [0, 560], [60, 520], [120, 600], [170, 730], [215, 880], [270, hz]], fg);
  falaise([[W, hz], [W, 720], [1010, 690], [955, 790], [905, 920], [860, hz]], fg);
  c.save(); c.globalAlpha = .55; falaise([[420, hz], [470, 990], [560, 1010], [640, 975], [720, hz]], '#b98a68'); c.restore();
  const haze = c.createLinearGradient(0, 800, 0, hz); haze.addColorStop(0, 'rgba(255,220,170,0)'); haze.addColorStop(1, 'rgba(255,220,170,.55)'); c.fillStyle = haze; c.fillRect(0, 800, W, hz - 800);
  // Eau et reflet du soleil
  const wg = c.createLinearGradient(0, hz, 0, H); wg.addColorStop(0, '#e2a467'); wg.addColorStop(.4, '#8a6448'); wg.addColorStop(1, '#3a2a20'); c.fillStyle = wg; c.fillRect(0, hz, W, H - hz);
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 160; i++) { const y = hz + Math.pow(rnd(), 1.3) * 760, spread = 30 + (y - hz) * .25, x = 780 + (rnd() - .5) * spread * 2; c.fillStyle = `rgba(255,220,150,${.15 + rnd() * .35})`; c.fillRect(x, y, 20 + rnd() * 60, 3 + rnd() * 3); }
  c.restore();
  c.strokeStyle = 'rgba(255,230,190,.12)'; c.lineWidth = 2; for (let y = hz + 20; y < H; y += 26 + rnd() * 20) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + (rnd() - .5) * 6); c.stroke(); }
  // Ponton en bois
  c.save(); c.beginPath(); c.moveTo(330, H); c.lineTo(W, 1480); c.lineTo(W, H); c.closePath(); c.clip();
  const pt = c.createLinearGradient(330, H, W, 1480); pt.addColorStop(0, '#6a4a30'); pt.addColorStop(1, '#9b744f'); c.fillStyle = pt; c.fillRect(0, 1400, W, 600);
  c.strokeStyle = 'rgba(40,25,15,.6)'; c.lineWidth = 4; for (let i = 1; i < 9; i++) { const t = i / 9; c.beginPath(); c.moveTo(330 + (W - 330) * t, H); c.lineTo(W, H - (H - 1480) * (1 - t) - 30 * t); c.stroke(); }
  c.restore();
  // Lanterne allumée sur le ponton
  const lx = 900, ly = 1620;
  c.save(); c.globalCompositeOperation = 'lighter'; const lg = c.createRadialGradient(lx, ly, 0, lx, ly, 220); lg.addColorStop(0, 'rgba(255,200,110,.55)'); lg.addColorStop(1, 'rgba(255,160,60,0)'); c.fillStyle = lg; c.beginPath(); c.arc(lx, ly, 220, 0, 7); c.fill(); c.restore();
  c.fillStyle = 'rgba(255,226,160,.95)'; c.fillRect(lx - 45, ly - 70, 90, 130);
  c.fillStyle = '#fff6e0'; c.fillRect(lx - 14, ly - 10, 28, 60); c.fillStyle = '#ffcf6a'; c.beginPath(); c.ellipse(lx, ly - 24, 8, 16, 0, 0, 7); c.fill();
  c.strokeStyle = '#1c1612'; c.lineWidth = 8; c.strokeRect(lx - 45, ly - 70, 90, 130);
  c.beginPath(); c.moveTo(lx, ly - 70); c.lineTo(lx, ly + 60); c.stroke();
  c.fillStyle = '#1c1612'; c.beginPath(); c.moveTo(lx - 65, ly - 70); c.lineTo(lx, ly - 120); c.lineTo(lx + 65, ly - 70); c.fill(); c.fillRect(lx - 60, ly + 60, 120, 18);
  c.lineWidth = 5; c.beginPath(); c.arc(lx, ly - 132, 14, 0, 7); c.stroke();
  // Croix rayonnante, référence, filets, verset, « Amen » manuscrit
  const or = '#9a6a2e', brun = '#3a2618';
  c.save(); c.translate(540, 150); c.strokeStyle = or; c.fillStyle = or; c.lineWidth = 3;
  c.fillRect(-4, -46, 8, 92); c.fillRect(-26, -24, 52, 8);
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; c.beginPath(); c.moveTo(Math.cos(a) * 50, Math.sin(a) * 50 - 10); c.lineTo(Math.cos(a) * 70, Math.sin(a) * 70 - 10); c.stroke(); }
  c.restore();
  filet(c, 240, or, 150);
  c.textAlign = 'center'; c.fillStyle = brun; c.font = `600 56px Georgia, "Times New Roman", serif`; spacing(c, '3px'); c.fillText(v.r.toUpperCase(), 540, 325); spacing(c, '0px');
  filet(c, 370, or, 200);
  const T = fitText(c, v.t.trim(), s => `600 ${s}px ${SERIF}`, 660, 560, 78, 32, 1.22);
  let y = 440 + Math.max(0, (560 - T.h) / 2) + T.size * .85;
  c.save(); c.shadowColor = 'rgba(255,245,225,.8)'; c.shadowBlur = 16; c.fillStyle = brun; c.font = `600 ${T.size}px ${SERIF}`;
  for (const l of T.lines) { c.fillText(l, 540, y); y += T.lh; }
  c.restore();
  const fy = Math.min(y - T.lh + 60, 1060); filet(c, fy, or, 160, 'coeur');
  c.fillStyle = or; c.font = `400 96px ${SCRIPT}`; c.save(); c.shadowColor = 'rgba(255,240,210,.8)'; c.shadowBlur = 12; c.fillText('Amen !', 540, fy + 110); c.restore();
  brandMark(c, 1830, icon, true);
}
const STYLES_IMG = { lumiere: 'Lumière', eclat: 'Éclat', page: 'Page surlignée', montagne: 'Montagnes', lac: 'Lac', jardin: 'Jardin', veillee: 'Veillée' };

// Style « Lumière » : fond crème ensoleillé, ombres de feuillage, Bible ouverte, typographie classique
function drawLumiere(c, v, icon) {
  const W = 1080, H = 1920, serif = '"Cormorant Garamond", Georgia, serif';
  let s = 11; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  // Mur crème, lumière venant de la droite
  let g = c.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#efe4d3'); g.addColorStop(.45, '#f7f0e5'); g.addColorStop(1, '#eadcc6');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  const sun = c.createRadialGradient(W * .78, H * .28, 40, W * .78, H * .28, 900);
  sun.addColorStop(0, 'rgba(255,250,238,.95)'); sun.addColorStop(1, 'rgba(255,250,238,0)');
  c.fillStyle = sun; c.fillRect(0, 0, W, H);
  // Rayon de fenêtre (bande claire en biais)
  c.save(); c.translate(W * .62, 0); c.rotate(.18);
  const ray = c.createLinearGradient(-160, 0, 160, 0);
  ray.addColorStop(0, 'rgba(255,255,255,0)'); ray.addColorStop(.5, 'rgba(255,255,255,.35)'); ray.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = ray; c.fillRect(-160, -100, 320, H * 1.2); c.restore();
  // Ombres de feuillage (floues) en haut à gauche et à droite
  const branch = (x, y, ang, len, alpha, blur) => {
    c.save(); c.filter = `blur(${blur}px)`; c.fillStyle = `rgba(92,72,52,${alpha})`; c.strokeStyle = `rgba(92,72,52,${alpha})`;
    c.translate(x, y); c.rotate(ang); c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * .5, -len * .08, len, len * .05); c.stroke();
    for (let i = 1; i < 11; i++) {
      const t = i / 11, px = len * t, py = -len * .05 * Math.sin(t * Math.PI), side = i % 2 ? 1 : -1;
      c.save(); c.translate(px, py); c.rotate(side * (.7 + rnd() * .3)); c.beginPath(); c.ellipse(34, 0, 38 + rnd() * 10, 14, 0, 0, 7); c.fill(); c.restore();
    }
    c.restore();
  };
  branch(-40, 120, .35, 520, .13, 7); branch(-60, 360, .05, 420, .09, 10); branch(W + 40, 40, Math.PI - .5, 480, .11, 8); branch(W + 30, 300, Math.PI - .15, 360, .08, 11);
  // Brin de feuillage net, en haut à gauche (couleur douce)
  c.save(); c.translate(40, 40); c.rotate(.55); c.strokeStyle = '#8a9a78'; c.fillStyle = '#9fae8a'; c.lineWidth = 4;
  c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(140, -10, 260, 30); c.stroke();
  for (let i = 1; i < 8; i++) { const t = i / 8; c.save(); c.translate(260 * t, 30 * t * t - 10 * Math.sin(t * 3)); c.rotate((i % 2 ? 1 : -1) * .8); c.globalAlpha = .75; c.beginPath(); c.ellipse(20, 0, 24, 9, 0, 0, 7); c.fill(); c.restore(); }
  c.fillStyle = '#fffaf0'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(200 + rnd() * 90, -20 + rnd() * 60, 7, 0, 7); c.fill(); }
  c.restore();

  const brun = '#3d2f24', cuivre = '#a0784f', doux = '#8a7462';
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  const lettre = x => { if ('letterSpacing' in c) c.letterSpacing = x; };
  // Ornement : filet doré + petite fleur
  const orn = y => {
    const lg = c.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
    lg.addColorStop(0, 'rgba(160,120,79,0)'); lg.addColorStop(.5, cuivre); lg.addColorStop(1, 'rgba(160,120,79,0)');
    c.strokeStyle = lg; c.lineWidth = 2.5; c.beginPath(); c.moveTo(W / 2 - 200, y); c.lineTo(W / 2 - 26, y); c.moveTo(W / 2 + 26, y); c.lineTo(W / 2 + 200, y); c.stroke();
    c.save(); c.translate(W / 2, y); c.fillStyle = cuivre;
    for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.beginPath(); c.ellipse(0, -10, 5, 10, 0, 0, 7); c.fill(); }
    c.beginPath(); c.arc(0, 0, 3.5, 0, 7); c.fillStyle = '#f7f0e5'; c.fill(); c.restore();
  };
  // Taille du verset : la plus grande qui tient (840 px de large, 700 px de haut au plus)
  const maxW = 840;
  let size = 82, lines, lh;
  for (; size >= 36; size -= 2) {
    c.font = `600 ${size}px ${serif}`;
    lines = wrapLines(c, `“\u00a0${v.t.trim()}\u00a0”`, maxW); lh = size * 1.28;
    if (lines.length * lh <= 700) break;
  }
  // Tout le bloc (icône, référence, verset, « Parole de Dieu », cœur) est centré entre le haut et la signature
  const blockH = 60 + 80 + 45 + 70 + lines.length * lh + 45 + 72 + 80;
  const y0 = 130 + Math.max(0, (1300 - 130 - blockH) / 2);
  // Petite Bible ouverte (dessin au trait)
  c.save(); c.translate(W / 2, y0 + 30); c.strokeStyle = brun; c.lineWidth = 3.2; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(0, -18); c.quadraticCurveTo(-26, -30, -52, -24); c.lineTo(-52, 24); c.quadraticCurveTo(-26, 18, 0, 30); c.quadraticCurveTo(26, 18, 52, 24); c.lineTo(52, -24); c.quadraticCurveTo(26, -30, 0, -18); c.closePath(); c.stroke();
  c.beginPath(); c.moveTo(0, -18); c.lineTo(0, 30); c.stroke(); c.restore();
  // Référence en capitales espacées (chiffres bien lisibles)
  c.fillStyle = brun; c.font = `600 40px "Plus Jakarta Sans", system-ui, sans-serif`; lettre('7px');
  c.fillText(v.r.toUpperCase(), W / 2, y0 + 140); lettre('0px');
  orn(y0 + 185);
  // Verset
  let y = y0 + 255 + size * .85;
  c.fillStyle = brun; c.font = `600 ${size}px ${serif}`;
  for (const l of lines) { c.fillText(l, W / 2, y); y += lh; }
  // Second ornement, « Parole de Dieu » en italique, cœur au trait
  const yo = y - lh + size * .35 + 45;
  orn(yo);
  c.fillStyle = cuivre; c.font = `italic 600 48px ${serif}`;
  c.fillText('Parole de Dieu', W / 2, yo + 72);
  c.save(); c.translate(W / 2, yo + 122); c.strokeStyle = cuivre; c.lineWidth = 3;
  c.beginPath(); c.moveTo(0, 22); c.bezierCurveTo(-34, -2, -22, -26, 0, -8); c.bezierCurveTo(22, -26, 34, -2, 0, 22); c.stroke(); c.restore();

  // Bible ouverte posée en bas (perspective)
  const bt = 1470, cx = W / 2;
  c.save(); c.filter = 'blur(18px)'; c.fillStyle = 'rgba(70,50,30,.30)'; c.beginPath(); c.ellipse(cx, 1890, 560, 70, 0, 0, 7); c.fill(); c.restore();
  // Tranche et couverture
  c.fillStyle = '#4a3324'; c.beginPath(); c.moveTo(cx, 1905); c.quadraticCurveTo(cx - 280, 1870, -30, 1910); c.lineTo(-30, 1940); c.lineTo(W + 30, 1940); c.lineTo(W + 30, 1910); c.quadraticCurveTo(cx + 280, 1870, cx, 1905); c.fill();
  for (let k = 0; k < 7; k++) { // épaisseur des pages
    c.strokeStyle = k % 2 ? '#e2d3ba' : '#d4c2a4'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(cx, 1890 - k * 4); c.quadraticCurveTo(cx - 280, 1855 - k * 4, -20, 1895 - k * 5); c.stroke();
    c.beginPath(); c.moveTo(cx, 1890 - k * 4); c.quadraticCurveTo(cx + 280, 1855 - k * 4, W + 20, 1895 - k * 5); c.stroke();
  }
  const page = side => {
    const e = side * 600;
    c.beginPath(); c.moveTo(cx, bt + 40);
    c.bezierCurveTo(cx + side * 120, bt - 30, cx + side * 380, bt - 20, cx + e, bt + 40);
    c.lineTo(cx + e, 1860);
    c.bezierCurveTo(cx + side * 380, 1800, cx + side * 140, 1830, cx, 1868);
    c.closePath();
    const pg = c.createLinearGradient(cx, 0, cx + e, 0);
    pg.addColorStop(0, '#d9c8ab'); pg.addColorStop(.12, '#f4ead9'); pg.addColorStop(.7, '#fbf5ea'); pg.addColorStop(1, '#efe2cc');
    c.fillStyle = pg; c.fill();
    // lignes de texte suivant la courbure
    c.save(); c.clip();
    c.strokeStyle = 'rgba(70,55,40,.22)'; c.lineWidth = 3;
    for (let i = 0; i < 15; i++) {
      const t = i / 15, yy = bt + 70 + t * 300, x0 = cx + side * 70, x1 = cx + side * 540;
      c.beginPath(); c.moveTo(x0, yy + 10 - 30 * (1 - t)); c.quadraticCurveTo(cx + side * 250, yy - 40 * (1 - t * .6), x1, yy + 8); c.stroke();
    }
    c.restore();
  };
  page(-1); page(1);
  const sp = c.createLinearGradient(cx - 50, 0, cx + 50, 0);
  sp.addColorStop(0, 'rgba(90,65,40,0)'); sp.addColorStop(.5, 'rgba(90,65,40,.35)'); sp.addColorStop(1, 'rgba(90,65,40,0)');
  c.fillStyle = sp; c.fillRect(cx - 50, bt - 10, 100, 420);
  // Signet
  c.strokeStyle = '#7a2e2a'; c.lineWidth = 7; c.beginPath(); c.moveTo(cx + 8, bt + 60); c.quadraticCurveTo(cx + 30, 1800, cx - 10, 1935); c.stroke();
  // Signature de l'appli, discrète
  if (icon) { c.save(); c.beginPath(); c.roundRect ? c.roundRect(W / 2 - 245, 1352, 56, 56, 14) : c.rect(W / 2 - 245, 1352, 56, 56); c.clip(); c.drawImage(icon, W / 2 - 245, 1352, 56, 56); c.restore(); }
  c.textAlign = 'left'; c.fillStyle = brun; c.font = `700 34px "Plus Jakarta Sans", system-ui, sans-serif`;
  c.fillText('Bible en un an', W / 2 - 172, 1380);
  c.fillStyle = doux; c.font = `500 25px "Plus Jakarta Sans", system-ui, sans-serif`;
  c.fillText('Appli gratuite · bible-en-un-an.vercel.app', W / 2 - 172, 1410);
}
async function verseImage(v, style) {
  const W = 1080, H = 1920, nuit = style === 'veillee';
  const fam = nuit ? '"Cormorant Garamond", Georgia, serif' : '"Plus Jakarta Sans", system-ui, sans-serif';
  try { await Promise.all([document.fonts.load(`600 60px "Cormorant Garamond"`), document.fonts.load(`italic 600 60px "Cormorant Garamond"`), document.fonts.load(`700 60px "Plus Jakarta Sans"`), document.fonts.load(`400 60px "Great Vibes"`)]); } catch (e) {}
  const icon = await loadShareIcon();
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  const autres = { lumiere: drawLumiere, eclat: drawEclat, page: drawPage, montagne: drawMontagne, lac: drawLac };
  if (autres[style]) { c.save(); autres[style](c, v, icon, seeded(Math.random() * 1e9)); c.restore(); return new Promise(res => cv.toBlob(res, 'image/png')); }
  // Fond
  let g = c.createLinearGradient(0, 0, W * .4, H);
  if (nuit) { g.addColorStop(0, '#2a3470'); g.addColorStop(.55, '#141a3a'); g.addColorStop(1, '#0d1128'); }
  else { g.addColorStop(0, '#3f8a66'); g.addColorStop(.5, '#2f6b4f'); g.addColorStop(1, '#1d4433'); }
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  const glow = c.createRadialGradient(W * .85, H * .12, 10, W * .85, H * .12, 700);
  glow.addColorStop(0, nuit ? 'rgba(240,214,153,.28)' : 'rgba(255,255,255,.16)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = glow; c.fillRect(0, 0, W, H);
  if (nuit) { // étoiles (toujours les mêmes)
    let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 90; i++) { c.globalAlpha = .25 + rnd() * .6; c.fillStyle = '#fff'; c.beginPath(); c.arc(rnd() * W, rnd() * H * .8, rnd() * 2.6 + .6, 0, 7); c.fill(); }
    c.globalAlpha = 1;
  }
  const ink = nuit ? '#fbf4e4' : '#ffffff', accent = nuit ? '#e3c27f' : '#c9ecd3';
  // Grand guillemet décoratif
  c.fillStyle = nuit ? 'rgba(217,183,112,.22)' : 'rgba(255,255,255,.14)';
  c.font = `700 360px ${fam}`; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  c.fillText('“', 70, 480);
  // Petit titre
  c.fillStyle = accent; c.textAlign = 'center';
  c.font = `700 34px "Plus Jakarta Sans", system-ui, sans-serif`;
  if ('letterSpacing' in c) c.letterSpacing = '6px';
  c.fillText('PAROLE DE DIEU', W / 2, 300);
  if ('letterSpacing' in c) c.letterSpacing = '0px';
  // Verset : taille ajustée pour tenir dans la zone
  const maxW = 860, zoneTop = 380, zoneH = 1040;
  let size = 84, lines, lh;
  for (; size >= 34; size -= 2) {
    c.font = nuit ? `italic 600 ${size}px ${fam}` : `700 ${size}px ${fam}`;
    lines = wrapLines(c, `« ${v.t.trim()} »`, maxW); lh = size * (nuit ? 1.3 : 1.36);
    if (lines.length * lh <= zoneH) break;
  }
  const refSize = Math.max(38, Math.min(54, size * .7));
  const block = lines.length * lh + 70 + refSize;
  let y = zoneTop + Math.max(0, (zoneH - block) / 2) + size;
  c.fillStyle = ink;
  for (const l of lines) { c.fillText(l, W / 2, y); y += lh; }
  // Référence
  c.fillStyle = accent; c.font = `700 ${refSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
  c.fillText(v.r, W / 2, y - lh + 70 + refSize);
  // Pied : l'appli
  const by = 1560, bw = 860, bx = (W - bw) / 2, bh = 200;
  c.fillStyle = nuit ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.12)';
  c.beginPath(); c.roundRect ? c.roundRect(bx, by, bw, bh, 40) : c.rect(bx, by, bw, bh); c.fill();
  if (icon) { c.save(); c.beginPath(); c.roundRect ? c.roundRect(bx + 36, by + 40, 120, 120, 30) : c.rect(bx + 36, by + 40, 120, 120); c.clip(); c.drawImage(icon, bx + 36, by + 40, 120, 120); c.restore(); }
  c.textAlign = 'left'; c.fillStyle = ink;
  c.font = `800 50px "Plus Jakarta Sans", system-ui, sans-serif`; c.fillText('Bible en un an', bx + 190, by + 92);
  c.fillStyle = accent; c.font = `600 32px "Plus Jakarta Sans", system-ui, sans-serif`;
  c.fillText('Appli gratuite · bible-en-un-an.vercel.app', bx + 190, by + 146);
  return new Promise(res => cv.toBlob(res, 'image/png'));
}
// Fenêtre de partage : aperçu de l'image + WhatsApp, image (statut / story), autres applis
const shareBack = h('div', { class: 'bubble-back share-back', hidden: true, onclick: e => { if (e.target === shareBack) closeShare(); } },
  h('div', { class: 'bubble share-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Partager ce verset' }));
let shareUrl = null;
function closeShare() { shareBack.hidden = true; if (shareUrl) { URL.revokeObjectURL(shareUrl); shareUrl = null; } }
async function openShare(v) {
  if (!shareBack.isConnected) document.body.append(shareBack);
  const ids = Object.keys(STYLES_IMG), auHasard = sauf => { const l = ids.filter(x => x !== sauf); return l[Math.floor(Math.random() * l.length)]; };
  let style = auHasard(), blob = null;
  const box = shareBack.firstChild, img = h('img', { class: 'share-prev', alt: `Image du verset ${v.r}` });
  const msg = h('p', { class: 'small muted share-msg' });
  const file = () => new File([blob], `verset-${v.r.replace(/[^\p{L}\d]+/gu, '-')}.png`, { type: 'image/png' });
  const draw = async () => {
    img.style.opacity = '.4';
    blob = await verseImage(v, style);
    if (shareUrl) URL.revokeObjectURL(shareUrl);
    shareUrl = URL.createObjectURL(blob); img.src = shareUrl; img.style.opacity = '1';
  };
  const nomStyle = h('span', { class: 'share-style' }, STYLES_IMG[style]);
  const styles = h('div', { class: 'share-row' }, nomStyle,
    h('button', { class: 'btn alt share-other', onclick: () => { style = auHasard(style); nomStyle.textContent = STYLES_IMG[style]; draw(); } }, '🔀 Une autre image'));
  const shareImg = async () => {
    if (!blob) return;
    const f = file();
    if (navigator.canShare && navigator.canShare({ files: [f] })) {
      try { await navigator.share({ files: [f], text: `${v.r} · ${SITE}` }); } catch (e) {}
    } else saveImg();
  };
  const saveImg = () => {
    if (!blob) return;
    downloadBlob(file().name, 'image/png', blob);
    msg.textContent = 'Image enregistrée dans vos téléchargements : vous pouvez l’ajouter à votre statut WhatsApp ou à votre story depuis vos photos.';
  };
  const shareWa = () => { window.open('https://wa.me/?text=' + encodeURIComponent(shareText(v)), '_blank', 'noopener'); };
  const shareOther = async () => {
    const txt = shareText(v);
    if (navigator.share) { try { await navigator.share({ text: txt }); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(txt); msg.textContent = 'Texte copié : collez-le où vous voulez.'; } catch (e) { prompt('Copiez le texte :', txt); }
  };
  box.replaceChildren(
    h('div', { class: 'picker-head' }, h('div', { class: 'kicker' }, 'Partager ce verset'), h('button', { class: 'sel-link', onclick: closeShare }, 'Fermer')),
    img, styles,
    h('button', { class: 'btn block share-wa', onclick: shareImg }, 'Partager l’image', h('small', null, 'WhatsApp, statut, Instagram, Facebook…')),
    h('button', { class: 'btn block alt', onclick: saveImg }, 'Enregistrer l’image'),
    msg,
    h('p', { class: 'share-txt' }, 'Texte seulement : ', h('button', { class: 'sel-link', onclick: shareWa }, 'WhatsApp'), ' · ', h('button', { class: 'sel-link', onclick: shareOther }, 'autres applis')));
  shareBack.hidden = false;
  await draw();
}
const shareBtn = (v, before) => h('button', { class: 'share-link', onclick: () => { if (before) before(); openShare(v); } }, '↗ Partager');
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !shareBack.hidden) closeShare(); });

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
    h('div', { class: 'ref' }, v.r, h('div', { class: 'ref-acts' }, contextBtn(v.r, () => { bubble.hidden = true; }), shareBtn(v, () => { bubble.hidden = true; }))),
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
    top.push(priTodayCard());
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
      h('div', null, h('small', null, cap(fmtLong(today()))), h('h2', null, `${salut}${S.prenom ? ' ' + S.prenom : ''}, que Dieu bénisse ${moment}`)),
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

  const seg = versionSeg(true);

  const body = V.ver === 'bds' ? readerSemeur(n) : readerLSG(n);

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

/* ---------- Rappel du chapitre en cours, en bas de l'écran ----------
   Onglet Bible : le chapitre ouvert, avec chapitre précédent / suivant.
   Lecture du jour : le chapitre qu'on est en train de lire (selon le défilement),
   avec passage au chapitre précédent / suivant du passage du jour. */
const cbPrev = h('button', { class: 'cb-btn', 'aria-label': 'Chapitre précédent', onclick: () => chapStep(-1) }, '‹');
const cbNext = h('button', { class: 'cb-btn', 'aria-label': 'Chapitre suivant', onclick: () => chapStep(1) }, '›');
const cbTitle = h('span', { class: 'cb-title' });
const cbSub = h('span', { class: 'cb-sub' });
const cbMid = h('button', { class: 'cb-mid', onclick: () => { if (chapCtx && chapCtx.kind === 'bible') { V.bv = 'books'; render(); } } }, cbTitle, cbSub);
const chapbar = h('nav', { class: 'chapbar', hidden: true, 'aria-label': 'Chapitre en cours' }, cbPrev, cbMid, cbNext);
document.body.append(chapbar);
let chapCtx = null, chapIdx = 0, cbRaf = 0;
function setupChapbar() {
  chapCtx = null;
  if (V.tab === 'bible' && V.bv === 'read') chapCtx = { kind: 'bible' };
  else if (V.tab === 'today') {
    const heads = [...view.querySelectorAll('.reader .ch-head')];
    if (heads.length) chapCtx = { kind: 'plan', heads, reader: view.querySelector('.reader') };
  }
  updateChapbar();
}
function showChapbar(on) {
  chapbar.hidden = !on; document.body.classList.toggle('has-chapbar', on);
}
function updateChapbar() {
  if (!chapCtx) return showChapbar(false);
  if (chapCtx.kind === 'bible') {
    const { b, c } = S.pos;
    cbTitle.textContent = `${BOOKS[b][0]} ${c}`;
    cbSub.textContent = `chapitre ${c} sur ${LSG[b].length}`;
    cbPrev.disabled = b === 0 && c === 1;
    cbNext.disabled = b === BOOKS.length - 1 && c === LSG[b].length;
    return showChapbar(true);
  }
  // Lecture du jour : visible seulement quand le texte est à l'écran
  const vh = innerHeight, r = chapCtx.reader.getBoundingClientRect();
  if (!chapCtx.reader.isConnected || r.top > vh * 0.6 || r.bottom < vh * 0.3) return showChapbar(false);
  const hs = chapCtx.heads;
  let i = 0; hs.forEach((el, k) => { if (el.getBoundingClientRect().top < vh * 0.35) i = k; });
  chapIdx = i;
  cbTitle.textContent = hs[i].textContent;
  cbSub.textContent = hs.length > 1 ? `chapitre ${i + 1} sur ${hs.length} du jour` : 'lecture du jour';
  cbPrev.disabled = i === 0; cbNext.disabled = i === hs.length - 1;
  showChapbar(true);
}
function chapStep(d) {
  if (!chapCtx) return;
  if (chapCtx.kind === 'bible') return stepChapter(d);
  const t = chapCtx.heads[chapIdx + d]; if (!t) return;
  t.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
addEventListener('scroll', () => { if (!cbRaf) cbRaf = requestAnimationFrame(() => { cbRaf = 0; if (chapCtx && chapCtx.kind === 'plan') updateChapbar(); }); }, { passive: true });
addEventListener('resize', () => updateChapbar());

function readerLSG(n) {
  const wrap = h('div', { class: 'card' },
    h('div', { class: 'tools' },
      h('button', { 'aria-label': 'Réduire la taille du texte', onclick: () => { S.font = Math.max(15, S.font - 1); save(); render(); } }, 'A−'),
      h('button', { 'aria-label': 'Agrandir la taille du texte', onclick: () => { S.font = Math.min(30, S.font + 1); save(); render(); } }, 'A+')));
  const reader = h('div', { class: 'reader' });
  for (const [b, c1, c2] of PLAN[n - 1].s)
    for (let c = c1; c <= c2; c++) reader.append(h('h3', { class: 'ch-head' }, `${BOOKS[b][0]} ${c}`), chapterEl(b, c));
  wrap.append(reader, h('p', { class: 'hint' }, 'Touchez un ou plusieurs versets, puis choisissez une couleur.'));
  return wrap;
}

// Texte d'un chapitre, versets touchables pour les surligner
function chapterEl(b, c) {
  const p = h('p', { class: BLOCK_BOOKS.has(b) ? 'blocks' : '' });
  const titre = (TITRES[ver()] || {})[`${b}.${c}`]; // titres des psaumes (Darby)
  BIB()[b][c - 1].forEach((txt, i) => {
    const key = `${b}.${c}.${i + 1}`;
    const sp = h('span', { class: 'vs' + (txt ? '' : ' absent'), 'data-k': key, onclick: () => toggleSel(key) }, h('sup', null, i + 1), (txt || 'Ce verset ne figure pas dans cette traduction.') + ' ');
    paintVerse(sp, !!S.hl[key]);
    p.append(sp);
  });
  if (!titre) return p;
  const f = document.createDocumentFragment(); f.append(h('p', { class: 'ps-title' }, titre), p); return f;
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
    h('p', { class: 'muted small' }, 'Astuce : lisez d’abord dans la Bible du Semeur, puis revenez dans « Segond » ou « Darby » pour comparer et surligner votre verset.'));
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
function refOf(key) { const [b, c, v] = key.split('.').map(Number); return { b, c, v, txt: verseTxt(b, c, v) }; }
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
  const txt = `« ${ks.map(k => refOf(k).txt).join(' ')} » (${refLabel(ks)}, ${VERSIONS[ver()].nom})`;
  const done = () => { copyBtn.textContent = 'Copié ✓'; setTimeout(() => { copyBtn.textContent = 'Copier'; }, 1500); };
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => prompt('Copiez le texte :', txt));
  else prompt('Copiez le texte :', txt);
}
const selRef = h('span', { class: 'sel-ref' });
const selColors = h('div', { class: 'sel-colors' });
const copyBtn = h('button', { class: 'sel-act', onclick: copySel }, 'Copier');
const shareSelBtn = h('button', { class: 'sel-act', onclick: () => { const ks = selOrdered(); if (!ks.length) return; openShare({ t: ks.map(k => refOf(k).txt).join(' '), r: refLabel(ks), nom: VERSIONS[ver()].nom }); } }, 'Partager');
const selBar = h('div', { class: 'selbar', hidden: true, role: 'toolbar', 'aria-label': 'Surligner les versets sélectionnés' },
  h('div', { class: 'sel-top' }, h('button', { class: 'sel-link', onclick: clearSel }, 'Annuler'), selRef, shareSelBtn, copyBtn),
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
    h('p', null, verseTxt(b, c, v)));
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
  else if (V.bv === 'verses') out.push(versePicker(V.bb, V.bc));
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
    versionSeg(false),
    h('div', { class: 'tools' },
      h('button', { class: 'goto-v', 'aria-label': 'Aller à un verset', onclick: () => { V.bb = b; V.bc = c; V.bv = 'verses'; V.vback = 'read'; render(); scrollTo(0, 0); } }, 'Aller au verset ▾'),
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
      V.bb = b; if (LSG[b].length === 1) { V.bc = 1; V.bv = 'verses'; V.vback = 'books'; } else V.bv = 'chapters'; render();
    } }, x[0])));
  return [
    h('div', { class: 'card' }, h('div', { class: 'picker-head' }, h('h2', null, 'Ancien Testament'), h('button', { class: 'sel-link', onclick: () => { V.bv = 'read'; render(); } }, 'Fermer')), grid(0, 39)),
    h('div', { class: 'card' }, h('h2', null, 'Nouveau Testament'), grid(39, 66))];
}
function chapterPicker(b) {
  return h('div', { class: 'card' },
    h('div', { class: 'picker-head' }, h('button', { class: 'sel-link', onclick: () => { V.bv = 'books'; render(); } }, '‹ Livres'), h('h2', null, BOOKS[b][0]), h('span')),
    h('div', { class: 'chap-grid' }, LSG[b].map((_, i) => h('button', { class: 'chap' + (b === S.pos.b && i + 1 === S.pos.c ? ' on' : ''), onclick: () => { V.bc = i + 1; V.bv = 'verses'; V.vback = 'chapters'; render(); scrollTo(0, 0); } }, i + 1))));
}
// Choix du verset : ouvre le chapitre directement sur le verset (surligné un instant)
function versePicker(b, c) {
  const back = V.vback === 'read' ? ['‹ Lecture', () => { V.bv = 'read'; render(); }]
    : V.vback === 'books' ? ['‹ Livres', () => { V.bv = 'books'; render(); }]
    : ['‹ Chapitres', () => { V.bv = 'chapters'; render(); }];
  const n = LSG[b][c - 1].length;
  return h('div', { class: 'card' },
    h('div', { class: 'picker-head' }, h('button', { class: 'sel-link', onclick: back[1] }, back[0]), h('h2', null, LSG[b].length > 1 ? `${BOOKS[b][0]} ${c}` : BOOKS[b][0]), h('span')),
    h('button', { class: 'btn block', onclick: () => openBible(b, c) }, 'Lire tout le chapitre'),
    h('p', { class: 'muted small pick-sub' }, `Ou choisissez un verset (${n}) :`),
    h('div', { class: 'chap-grid' }, Array.from({ length: n }, (_, i) => h('button', { class: 'chap', onclick: () => openBible(b, c, i + 1) }, i + 1))));
}
let FOLDED = null; // texte de toute la Bible (version choisie) sans accents, préparé à la première recherche
function searchResults(q) {
  const fq = fold(q).replace(/\s+/g, ' ');
  if (!FOLDED) FOLDED = BIB().map(book => book.map(ch => ch.map(fold)));
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
    const txt = BIB()[x.b][x.c - 1][x.v - 1];
    return h('button', { class: 'hit', onclick: () => { V.q = q; openBible(x.b, x.c, x.v); } },
      h('div', { class: 'ref' }, `${BOOKS[x.b][0]} ${x.c}:${x.v}`),
      h('p', null, txt.slice(0, x.i), h('mark', null, txt.slice(x.i, x.i + fq.length)), txt.slice(x.i + fq.length)));
  });
  const fr = n => n.toLocaleString('fr-FR');
  return h('div', { class: 'card' }, back,
    h('h2', null, `${fr(total)} verset${total > 1 ? 's' : ''} avec « ${q} »`),
    h('p', { class: 'muted small' }, `Version ${VERSIONS[ver()].nom} · ${fr(total - nt)} dans l’Ancien Testament, ${fr(nt)} dans le Nouveau. Touchez un verset pour l’ouvrir dans son chapitre.`),
    list,
    total > hits.length ? h('button', { class: 'btn alt block', onclick: () => { V.qMax += 100; const y = scrollY; render(); scrollTo(0, y); } }, `Afficher plus (${fr(hits.length)} sur ${fr(total)})`) : null);
}

/* ---------- Jeux : connaître la Bible et retenir la Parole ----------
   Quiz : 10 questions à choix multiples (data/quiz.js), avec la référence de chaque réponse.
   Versets à compléter : mots manquants à remettre en place, en touchant un mot ou en le faisant glisser. */
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const NB_QUIZ = 10, NB_TROUS = 5;
const NIVEAUX = { facile: { nom: 'Facile', trous: 1, leurres: 2 }, moyen: { nom: 'Moyen', trous: 2, leurres: 3 }, difficile: { nom: 'Difficile', trous: 3, leurres: 4 } };
// Petits mots qu'on ne fait pas deviner
const MOTS_VIDES = new Set('avec dans pour mais donc sont nous vous leur leurs cette celui celle celles ceux cela ceci elle elles comme point tout tous toute toutes plus sans sous vers chez aussi ainsi alors soit sera seront etait etaient avait avaient quand dont encore meme votre notre afin parce entre jusqu lorsque puis contre selon avant apres depuis ayant etant aura auront avez avons etes suis fais fait voici voila quelque quiconque jamais peut doit lequel laquelle lesquels lesquelles dire disant'
  .split(' '));
const foldW = w => fold(w).replace(/[^a-z]/g, '');
function gameStats(g) {
  const st = S.jeux[g], n = g === 'qcm' ? NB_QUIZ : NB_TROUS;
  if (!st.n) return h('div', { class: 'gstats' }, h('span', { class: 'gstat new' }, '✨ Nouveau : à vous de jouer !'));
  return h('div', { class: 'gstats' },
    h('span', { class: 'gstat' }, '🏆 Meilleur : ', h('b', null, `${st.best} / ${n}`)),
    h('span', { class: 'gstat' }, '🎯 ', h('b', null, st.n), ` partie${st.n > 1 ? 's' : ''}`));
}
const SVG_NS = 'http://www.w3.org/2000/svg';
function gameIcon(paths) {
  const svg = document.createElementNS(SVG_NS, 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
  for (const d of paths) { const p = document.createElementNS(SVG_NS, 'path'); p.setAttribute('d', d); svg.append(p); }
  return svg;
}
const ICON_QUIZ = ['M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5', 'M12 18h.01', 'M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19z'];
const ICON_TROUS = ['M4 6h16', 'M4 11h5M15 11h5', 'M4 16h9', 'M10 9.5h4v3h-4z', 'M17 15.5h3v1.5h-3z'];
function endGame(g, score) {
  const st = S.jeux[g]; st.n++; const record = score > st.best; if (record) st.best = score; save(); return record;
}
function segOf(opts, cur, set) {
  return h('div', { class: 'seg' }, opts.map(([id, nom, dis]) => h('button', { class: cur === id ? 'on' : '', disabled: !!dis, onclick: () => { set(id); save(); rerender(); } }, nom)));
}
function viewGames() {
  if (V.g && V.g.type === 'qcm') return quizView();
  if (V.g && V.g.type === 'trous') return gapView();
  const mine = myGapVerses().length;
  if (S.jeux.src === 'miens' && !mine) S.jeux.src = 'connus';
  const parties = S.jeux.qcm.n + S.jeux.trous.n;
  return [
    h('div', { class: 'card games-hero' },
      h('div', { class: 'gh-deco', 'aria-hidden': 'true' }, '✦'),
      h('div', { class: 'gh-kicker' }, 'Jeux bibliques'),
      h('h2', null, 'Apprendre en jouant'),
      h('p', null, 'Pour mieux connaître la Bible et garder la Parole de Dieu dans son cœur.'),
      parties ? h('p', { class: 'gh-count' }, `${parties} partie${parties > 1 ? 's' : ''} jouée${parties > 1 ? 's' : ''} · continuez !`) : null),
    h('div', { class: 'card game-card gc-quiz' },
      h('div', { class: 'gc-head' },
        h('div', { class: 'gc-art' }, gameIcon(ICON_QUIZ)),
        h('div', null, h('div', { class: 'kicker' }, 'Quiz biblique'), h('h2', null, 'Questions à choix multiples'))),
      h('p', { class: 'small' }, `${NB_QUIZ} questions tirées au hasard. Après chaque réponse, la référence permet de lire le passage.`),
      segOf([['tout', 'Toute la Bible'], ['at', 'Ancien T.'], ['nt', 'Nouveau T.']], S.jeux.qp, v => { S.jeux.qp = v; }),
      gameStats('qcm'),
      h('button', { class: 'btn block play', onclick: startQuiz }, 'Jouer ▸')),
    h('div', { class: 'card game-card gc-trous' },
      h('div', { class: 'gc-head' },
        h('div', { class: 'gc-art' }, gameIcon(ICON_TROUS)),
        h('div', null, h('div', { class: 'kicker' }, 'Versets à compléter'), h('h2', null, 'Retrouver les mots manquants'))),
      h('p', { class: 'small' }, `${NB_TROUS} versets. Touchez un mot pour le placer dans la case vide, ou faites-le glisser.`),
      h('p', { class: 'f small' }, 'Quels versets ?'),
      segOf([['connus', 'Versets d’encouragement'], ['miens', `Mes versets surlignés (${mine})`, !mine]], S.jeux.src, v => { S.jeux.src = v; }),
      mine ? null : h('p', { class: 'muted small' }, 'Surlignez des versets pendant vos lectures : vous pourrez ensuite vous entraîner à les retenir.'),
      h('p', { class: 'f small' }, 'Niveau'),
      segOf(Object.entries(NIVEAUX).map(([id, n]) => [id, n.nom]), S.jeux.niv, v => { S.jeux.niv = v; }),
      gameStats('trous'),
      h('button', { class: 'btn block play', onclick: startGap }, 'Jouer ▸'))
  ];
}
function gameTop(label, i, n, score) {
  return h('div', { class: 'card game-top' },
    h('div', { class: 'gt-row' },
      h('span', { class: 'gt-label' }, label, h('b', null, ` ${Math.min(i + 1, n)} / ${n}`)),
      h('span', { class: 'gt-score' }, '⭐ ', h('b', null, score)),
      h('button', { class: 'sel-link', onclick: () => { if (V.g.done || confirm('Quitter la partie en cours ?')) { V.g = null; render(); } } }, 'Quitter')),
    h('div', { class: 'gt-bar' }, h('span', { style: `width:${Math.round(100 * Math.min(i, n) / n)}%` })));
}
function resultCard(g, score, n, record, again, extra) {
  const ratio = score / n;
  const msg = ratio === 1 ? 'Parfait ! Quelle connaissance de la Parole !' : ratio >= .7 ? 'Très bien ! Continuez ainsi.' : ratio >= .4 ? 'Bien joué ! Chaque partie fait grandir.' : 'Courage ! On apprend en jouant : rejouez quand vous voulez.';
  const stars = ratio === 1 ? 3 : ratio >= .7 ? 2 : ratio >= .4 ? 1 : 0;
  return [h('div', { class: 'card center result-card' },
    h('div', { class: 'kicker' }, 'Résultat'),
    h('div', { class: 'score-ring', style: `--p:${Math.round(ratio * 100)}` }, h('div', null, h('b', null, score), h('span', null, `sur ${n}`))),
    h('div', { class: 'stars', 'aria-label': `${stars} étoile${stars > 1 ? 's' : ''} sur 3` }, [0, 1, 2].map(i => h('span', { class: i < stars ? 'on' : '' }, '★'))),
    h('p', { class: 'result-msg' }, msg),
    record ? h('p', { class: 'record' }, '🏆 Nouveau meilleur score !') : null,
    h('div', { class: 'result-btns' }, h('button', { class: 'btn', onclick: again }, 'Rejouer'), h('button', { class: 'btn alt', onclick: () => { V.g = null; render(); } }, 'Retour aux jeux'))),
    extra];
}

/* --- Quiz --- */
function startQuiz() {
  const pool = (window.QUIZ || []).filter(x => { const p = parseRef(x.ref); const nt = p && p.b >= 39; return S.jeux.qp === 'tout' || (S.jeux.qp === 'nt') === nt; });
  V.g = { type: 'qcm', qs: shuffle(pool).slice(0, NB_QUIZ).map(x => ({ ...x, opts: shuffle(x.r) })), i: 0, score: 0, pick: null, missed: [] };
  render();
}
function quizView() {
  const g = V.g, n = g.qs.length;
  if (g.done) return [gameTop('Question', n, n, g.score), ...resultCard('qcm', g.score, n, g.record, startQuiz,
    g.missed.length ? h('div', { class: 'card' }, h('div', { class: 'kicker' }, 'À revoir'),
      g.missed.map(x => h('div', { class: 'review' }, h('p', { class: 'small' }, x.q), h('p', null, h('b', null, x.r[0]), ' — ', x.ref), contextBtn(x.ref)))) : null)];
  const x = g.qs[g.i], answered = g.pick != null;
  const next = () => {
    if (g.i + 1 < n) { g.i++; g.pick = null; render(); }
    else { g.done = true; g.record = endGame('qcm', g.score); render(); }
  };
  return [gameTop('Question', g.i, n, g.score),
    h('div', { class: 'card' },
      h('div', { class: 'q-pill' }, `Question ${g.i + 1}`),
      h('h2', { class: 'quiz-q' }, x.q),
      h('div', { class: 'opts' }, x.opts.map((o, j) => h('button', {
        class: 'opt' + (answered && o === x.r[0] ? ' ok' : '') + (answered && o === g.pick && o !== x.r[0] ? ' ko' : ''),
        disabled: answered,
        onclick: () => { g.pick = o; if (o === x.r[0]) g.score++; else g.missed.push(x); rerender(); } },
        h('span', { class: 'opt-l', 'aria-hidden': 'true' }, answered && o === x.r[0] ? '✓' : answered && o === g.pick ? '✗' : 'ABCD'[j]), h('span', null, o)))),
      answered ? h('div', { class: 'feedback ' + (g.pick === x.r[0] ? 'fb-ok' : 'fb-ko') },
        h('p', { class: g.pick === x.r[0] ? 'ok-txt' : 'ko-txt' }, g.pick === x.r[0] ? '✓ Bonne réponse !' : `La bonne réponse : ${x.r[0]}`),
        h('p', { class: 'small muted' }, `Référence : ${x.ref}`), contextBtn(x.ref),
        h('button', { class: 'btn block', onclick: next }, g.i + 1 < n ? 'Question suivante ›' : 'Voir le résultat')) : null)];
}

/* --- Versets à compléter --- */
function myGapVerses() {
  return Object.keys(S.hl).sort(byRef).map(k => { const [b, c, v] = k.split('.').map(Number); return { r: `${BOOKS[b][0]} ${c}:${v}`, t: verseTxt(b, c, v) }; })
    .filter(x => x.t && x.t.split(' ').length >= 5);
}
const splitWords = t => t.split(/(\p{L}[\p{L}-]*)/u); // [texte, mot, texte, mot, …]
const isCandidate = w => w.length >= 4 && !MOTS_VIDES.has(foldW(w));
function makeGap(verse, niv, wordPool) {
  const parts = splitWords(verse.t);
  const idx = []; for (let i = 1; i < parts.length; i += 2) if (isCandidate(parts[i])) idx.push(i);
  // de préférence les mots longs (souvent les plus importants), sans répéter deux fois le même mot
  const best = shuffle(idx.sort((a, b) => parts[b].length - parts[a].length).slice(0, Math.max(4, niv.trous * 3)));
  const pick = [], seen = new Set();
  for (const i of best) { const f = foldW(parts[i]); if (!seen.has(f) && pick.length < niv.trous) { seen.add(f); pick.push(i); } }
  pick.sort((a, b) => a - b);
  const answers = pick.map(i => parts[i]);
  // mots « leurres » : pris dans d'autres versets, d'une longueur proche, avec la même majuscule que la réponse
  const decoys = [];
  for (const w of shuffle(wordPool)) {
    if (decoys.length >= niv.leurres) break;
    const ref = answers[decoys.length % answers.length];
    const f = foldW(w);
    if (seen.has(f) || Math.abs(w.length - ref.length) > 3) continue;
    seen.add(f);
    const up = ref[0] === ref[0].toUpperCase();
    decoys.push(up ? w[0].toUpperCase() + w.slice(1) : w[0].toLowerCase() + w.slice(1));
  }
  const segs = []; let k = 0;
  parts.forEach((p, i) => { if (pick.includes(i)) segs.push({ blank: k++ }); else if (p) segs.push({ t: p }); });
  return { r: verse.r, t: verse.t, segs, answers, chips: shuffle([...answers, ...decoys]).map((w, id) => ({ id, w })), fill: answers.map(() => null), marks: null, target: null, tries: 0 };
}
function startGap() {
  const niv = NIVEAUX[S.jeux.niv] || NIVEAUX.facile;
  const src = S.jeux.src === 'miens' ? myGapVerses() : (window.VERSETS || []).map(v => ({ r: v.r, t: v.t }));
  const pool = [];
  for (const v of [...src, ...(window.VERSETS || [])]) for (const w of splitWords(v.t).filter((_, i) => i % 2)) if (isCandidate(w)) pool.push(w);
  V.g = { type: 'trous', items: shuffle(src).slice(0, NB_TROUS).map(v => makeGap(v, niv, pool)), i: 0, score: 0 };
  render();
}
// Placer un mot (chip) dans une case ; si la case était occupée, l'ancien mot retourne dans la réserve
function placeChip(it, chipId, k) {
  if (it.done) return;
  const prev = it.fill.indexOf(chipId); if (prev >= 0) it.fill[prev] = null;
  if (k == null) k = it.target != null && it.fill[it.target] == null ? it.target : it.fill.indexOf(null);
  if (k < 0) return;
  it.fill[k] = chipId; it.target = null; it.marks = null;
  rerender();
}
let drag = null; // glisser-déposer au doigt ou à la souris (pointer events : marche aussi sur téléphone)
function chipEl(it, c) {
  const used = it.fill.includes(c.id);
  const el = h('button', { class: 'wchip' + (used ? ' used' : ''), disabled: used || it.done }, c.w);
  el.addEventListener('pointerdown', e => {
    if (used || it.done) return;
    drag = { it, c, el, x: e.clientX, y: e.clientY, ghost: null, over: null };
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
  });
  el.addEventListener('pointermove', e => {
    if (!drag || drag.el !== el) return;
    if (!drag.ghost) {
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
      drag.ghost = h('div', { class: 'wchip ghost' }, c.w); document.body.append(drag.ghost); el.classList.add('dragging');
    }
    drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
    const t = document.elementFromPoint(e.clientX, e.clientY), b = t && t.closest('.blank');
    if (drag.over && drag.over !== b) drag.over.classList.remove('over');
    if (b) b.classList.add('over'); drag.over = b;
  });
  const end = e => {
    if (!drag || drag.el !== el) return;
    const d = drag; drag = null;
    if (!d.ghost) return placeChip(it, c.id); // simple toucher
    d.ghost.remove(); el.classList.remove('dragging');
    if (d.over) placeChip(it, c.id, +d.over.dataset.k);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', () => { if (drag && drag.el === el) { if (drag.ghost) drag.ghost.remove(); el.classList.remove('dragging'); drag = null; } });
  return el;
}
function gapView() {
  const g = V.g, n = g.items.length;
  if (g.done) return [gameTop('Verset', n, n, g.score), ...resultCard('trous', g.score, n, g.record, startGap)];
  const it = g.items[g.i];
  const word = id => it.chips.find(c => c.id === id).w;
  const text = h('p', { class: 'gap-text' }, it.segs.map(s => {
    if (s.t != null) return s.t;
    const k = s.blank, f = it.fill[k], m = it.marks && it.marks[k];
    return h('button', {
      class: 'blank' + (f == null ? ' empty' : '') + (it.target === k ? ' target' : '') + (m === true ? ' ok' : m === false ? ' ko' : '') + (it.done ? ' done' : ''),
      'data-k': k, 'aria-label': f == null ? 'Case vide' : `Retirer « ${word(f)} »`,
      onclick: () => { if (it.done) return; if (f != null) { it.fill[k] = null; it.marks = null; } else it.target = it.target === k ? null : k; rerender(); }
    }, f == null ? ' ' : word(f));
  }));
  const full = !it.fill.includes(null);
  const check = () => {
    it.marks = it.fill.map((id, k) => foldW(word(id)) === foldW(it.answers[k]));
    if (it.marks.every(Boolean)) { it.done = true; it.won = true; if (!it.tries) g.score++; }
    else it.tries++;
    rerender();
  };
  const reveal = () => {
    it.fill = it.answers.map(a => it.chips.find(c => c.w === a).id);
    it.marks = it.answers.map(() => true); it.done = true; rerender();
  };
  const next = () => {
    if (g.i + 1 < n) { g.i++; render(); }
    else { g.done = true; g.record = endGame('trous', g.score); render(); }
  };
  const nbWrong = it.marks ? it.marks.filter(m => !m).length : 0;
  return [gameTop('Verset', g.i, n, g.score),
    h('div', { class: 'card' },
      h('div', { class: 'q-pill' }, it.r),
      text,
      it.done ? null : h('div', { class: 'wbank', 'aria-label': 'Mots proposés' }, it.chips.map(c => chipEl(it, c))),
      it.done
        ? h('div', { class: 'feedback ' + (it.won ? 'fb-ok' : 'fb-info') },
            h('p', { class: it.won ? 'ok-txt' : 'muted' }, it.won ? (it.tries ? '✓ C’est juste !' : '✓ Bravo, du premier coup !') : 'Voici le verset complet. Vous le retiendrez la prochaine fois !'),
            h('p', { class: 'small muted' }, contextBtn(it.r)),
            h('button', { class: 'btn block', onclick: next }, g.i + 1 < n ? 'Verset suivant ›' : 'Voir le résultat'))
        : h('div', { class: 'feedback' },
            nbWrong ? h('p', { class: 'ko-txt small' }, nbWrong > 1 ? `${nbWrong} mots ne sont pas à la bonne place. Touchez un mot en rouge pour le retirer.` : 'Un mot n’est pas à la bonne place. Touchez le mot en rouge pour le retirer.') : null,
            h('button', { class: 'btn block', disabled: !full, onclick: check }, 'Vérifier'),
            it.tries ? h('button', { class: 'sel-link', onclick: reveal }, 'Voir la réponse') : null))];
}

/* ---------- Prier avec la Parole : sujets de prière, versets et prière tirée de chaque verset ---------- */
const PRI = () => window.PRIERE || [];
function parsePriRef(r) { // "Psaumes 51:1-2,10" → { b, c, parts: [[1, 2], [10, 10]] } ; "3 Jean 4" → chapitre 1, verset 4
  const m = r.match(/^(.+) (\d+)(?::([\d,-]+))?$/), b = BOOKS.findIndex(x => x[0] === m[1]);
  if (!m[3]) return { b, c: 1, parts: [[+m[2], +m[2]]] };
  return { b, c: +m[2], parts: m[3].split(',').map(p => { const [a, z] = p.split('-').map(Number); return [a, z || a]; }) };
}
const priLabel = r => r.replace(/,/g, ' et ').replace(/^Psaumes /, 'Psaume ');
function priVerse(r) {
  const p = parsePriRef(r), seg = [];
  for (const [a, z] of p.parts) { const t = []; for (let v = a; v <= z; v++) t.push(verseTxt(p.b, p.c, v)); seg.push(t.join(' ')); }
  return { b: p.b, c: p.c, v: p.parts[0][0], t: seg.join(' […] '), r: priLabel(r), nom: VERSIONS[ver()].nom };
}
// Prénoms glissés dans la prière : {E} enfants, {F} proches ; {E:a|b} = a pour un seul prénom, b sinon
const nomsList = s => (s || '').split(/\s*(?:[,;\n]|\set\s)\s*/).map(x => x.trim()).filter(Boolean);
const joinNoms = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' et ' + a[a.length - 1];
function fillNoms(t) {
  const g = { E: nomsList(S.pri.enf), F: nomsList(S.pri.fam) }, def = { E: 'mes enfants', F: 'mes proches' };
  return t.replace(/\{([EF])(?::([^|}]*)\|([^}]*))?\}/g, (_, k, a, b) => a === undefined ? (g[k].length ? joinNoms(g[k]) : def[k]) : (g[k].length === 1 ? a : b));
}
const priCount = t => t.v.filter(Array.isArray).length;
const priDuJour = () => { const l = PRI(); return l[Math.floor(today().getTime() / 864e5 + 0.5) % l.length]; };
function openPri(id, guide) { V.tab = 'prayer'; V.pt = id; V.pg = guide ? 0 : null; render(); }
function markPrayed(t) {
  const d = iso(today());
  if (S.pri.fait[t.id] !== d) { S.pri.fait[t.id] = d; S.pri.n++; save(); }
}
const prayedToday = t => S.pri.fait[t.id] === iso(today());
function viewPriere() {
  const t = PRI().find(x => x.id === V.pt);
  if (t && V.pg != null) return priGuide(t);
  if (t) return priTheme(t);
  V.pt = null; return priHome();
}
function priTodayCard() {
  const t = priDuJour(); if (!t) return null;
  return h('button', { class: 'card pri-today', onclick: () => openPri(t.id) },
    h('span', { class: 'pri-ic' }, t.ic),
    h('span', { class: 'pt-txt' }, h('small', null, 'Prier avec la Parole · sujet du jour'), h('b', null, t.t)),
    h('span', { class: 'pt-go', 'aria-hidden': 'true' }, '›'));
}
function priHome() {
  const n = S.pri.n;
  return [
    h('div', { class: 'card games-hero pri-hero' },
      h('div', { class: 'gh-deco', 'aria-hidden': 'true' }, '✦'),
      h('div', { class: 'gh-kicker' }, 'Prier avec la Parole'),
      h('h2', null, 'Appuyer ma prière sur la Parole de Dieu'),
      h('p', null, 'Choisissez un sujet. Lisez chaque verset, puis faites-en votre prière.'),
      n ? h('p', { class: 'gh-count' }, `${n} temps de prière avec la Parole · continuez !`) : null),
    h('div', { class: 'pri-grid' }, PRI().map(t => h('button', { class: 'pri-tile' + (prayedToday(t) ? ' fait' : ''), onclick: () => openPri(t.id) },
      h('span', { class: 'pri-ic' }, t.ic), h('b', null, t.t), h('small', null, prayedToday(t) ? 'Prié aujourd’hui ✓' : `${priCount(t)} versets`)))),
    h('div', { class: 'card pri-how' },
      h('h2', null, 'Comment prier avec ces versets'),
      h('ol', null,
        h('li', null, 'Lisez le verset lentement, à voix haute si vous le pouvez.'),
        h('li', null, 'Redites-le à Dieu avec vos mots, à la première personne. Par exemple, avec Jacques 1:19 : « Seigneur, rends-moi prompt à écouter, lent à parler, lent à me mettre en colère. »'),
        h('li', null, 'Pour vos enfants et votre famille, mettez leurs prénoms dans la prière : l’appli peut le faire pour vous.'),
        h('li', null, 'Terminez en remerciant Dieu : il est fidèle à sa Parole.')),
      h('p', { class: 'muted small' }, 'Versets de la Louis Segond 1910. Chaque prière proposée n’est qu’un exemple : dites-la avec votre cœur.'))
  ];
}
function nomsEditor(k) {
  const key = k === 'E' ? 'enf' : 'fam';
  const inp = h('input', { type: 'text', value: S.pri[key], maxlength: 150, placeholder: k === 'E' ? 'Ex. : Paul, Marie' : 'Ex. : Papa, Awa, Jean', 'aria-label': k === 'E' ? 'Prénoms de mes enfants' : 'Prénoms de mes proches' });
  const ok = () => { S.pri[key] = inp.value.trim().slice(0, 150); save(); rerender(); };
  return h('form', { class: 'pri-noms', onsubmit: e => { e.preventDefault(); ok(); } },
    h('label', null, k === 'E' ? 'Prénoms de mes enfants' : 'Prénoms des personnes de ma famille'),
    h('div', { class: 'code-row' }, inp, h('button', { class: 'btn', type: 'submit' }, 'Mettre dans la prière')),
    h('p', { class: 'muted small' }, 'Facultatif. Séparez les prénoms par une virgule. Ils restent sur votre appareil.'));
}
function priVerseCard(it) {
  const v = priVerse(it[0]);
  return h('div', { class: 'card pri-v' },
    h('div', { class: 'pri-ref' }, v.r),
    h('blockquote', { class: 'pri-txt' }, v.t),
    h('div', { class: 'pri-pray' }, h('span', { class: 'pp-k' }, '🙏 Ma prière'), h('p', null, fillNoms(it[1]))),
    h('div', { class: 'ref-acts' }, h('button', { class: 'ctx-link', onclick: () => openBible(v.b, v.c, v.v) }, 'Lire dans son contexte ›'), shareBtn(v)));
}
function priAmen(t, after) {
  return prayedToday(t)
    ? h('p', { class: 'fb-ok pri-done' }, 'Amen ✓ Que Dieu vous bénisse et vous garde.')
    : h('button', { class: 'btn block', onclick: () => { markPrayed(t); after(); } }, 'Amen 🙏 J’ai prié');
}
function priTheme(t) {
  const out = [
    h('div', { class: 'picker-head pri-back' }, h('button', { class: 'sel-link', onclick: () => { V.pt = null; render(); } }, '‹ Sujets de prière'), h('span')),
    h('div', { class: 'card pri-head' },
      h('div', { class: 'gc-head' }, h('div', { class: 'gc-art pri-art' }, t.ic), h('div', null, h('div', { class: 'kicker' }, `${priCount(t)} versets`), h('h2', null, t.t))),
      h('p', { class: 'small' }, t.d),
      t.noms ? nomsEditor(t.noms) : null,
      h('button', { class: 'btn block play', onclick: () => { V.pg = 0; render(); } }, 'Prier pas à pas ▸'),
      h('p', { class: 'muted small center' }, 'Un verset à la fois, avec sa prière. Ou lisez la liste ci-dessous.'))];
  for (const it of t.v) out.push(Array.isArray(it) ? priVerseCard(it) : h('h3', { class: 'pri-sub' }, it.h));
  out.push(h('div', { class: 'card pri-end' },
    h('div', { class: 'kicker' }, 'Pour conclure'),
    h('p', { class: 'pri-final' }, fillNoms(t.p)),
    priAmen(t, rerender)));
  return out;
}
function priGuide(t) {
  const items = t.v.filter(Array.isArray), n = items.length, i = Math.min(V.pg, n);
  const go = d => { V.pg = Math.max(0, i + d); render(); };
  const quit = h('button', { class: 'sel-link', onclick: () => { V.pg = null; render(); } }, 'Quitter');
  const dots = h('div', { class: 'pri-dots', 'aria-hidden': 'true' }, Array.from({ length: n + 1 }, (_, k) => h('i', { class: k < i ? 'ok' : k === i ? 'on' : '' })));
  if (i === n) return [
    h('div', { class: 'picker-head' }, h('span', { class: 'muted small' }, t.t), quit), dots,
    h('div', { class: 'card pri-step pri-end' },
      h('div', { class: 'kicker' }, 'Pour conclure'),
      h('p', { class: 'pri-final big' }, fillNoms(t.p)),
      priAmen(t, render),
      h('div', { class: 'chap-foot' },
        h('button', { class: 'btn alt', onclick: () => go(-1) }, '‹ Retour'),
        h('button', { class: 'btn alt', onclick: () => { V.pg = null; V.pt = null; render(); } }, 'Autres sujets')))];
  const it = items[i], v = priVerse(it[0]);
  return [
    h('div', { class: 'picker-head' }, h('span', { class: 'muted small' }, `${t.ic} ${t.t} · ${i + 1} / ${n}`), quit), dots,
    h('div', { class: 'card pri-step' },
      h('div', { class: 'pri-ref' }, v.r),
      h('blockquote', { class: 'pri-txt big' }, v.t),
      h('p', { class: 'pri-hint' }, 'Lisez-le lentement… puis priez :'),
      h('div', { class: 'pri-pray' }, h('span', { class: 'pp-k' }, '🙏 Ma prière'), h('p', null, fillNoms(it[1]))),
      h('div', { class: 'ref-acts' }, shareBtn(v))),
    h('div', { class: 'chap-foot' },
      h('button', { class: 'btn alt', disabled: i === 0, onclick: () => go(-1) }, '‹ Précédent'),
      h('button', { class: 'btn', onclick: () => go(1) }, i === n - 1 ? 'Conclure ›' : 'Verset suivant ›'))];
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

/* ---------- Profil : retrouver sa progression sur tous ses appareils ----------
   Pas d'inscription : un code personnel (9 caractères). Le serveur ne reçoit qu'une empreinte du code
   et la progression chiffrée sur l'appareil (AES-GCM, clé tirée du code) : illisible sans le code.
   Chaque modification est datée (S.mt) : en cas de changements sur deux appareils, la plus récente l'emporte. */
const PROFIL_KEY = 'bible-an-profil';
const CODE_ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sans I, L, O, 0, 1 (faciles à confondre)
let P = null; try { P = JSON.parse(localStorage.getItem(PROFIL_KEY)) || null; } catch (e) {}
const saveP = () => { try { if (P) localStorage.setItem(PROFIL_KEY, JSON.stringify(P)); else localStorage.removeItem(PROFIL_KEY); } catch (e) {} };
const fmtCode = c => c.match(/.{3}/g).join('-');
const normCode = s => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const codeOk = c => c.length === 9 && [...c].every(x => CODE_ABC.includes(x));
function newCode() { const a = new Uint32Array(9); crypto.getRandomValues(a); return [...a].map(x => CODE_ABC[x % CODE_ABC.length]).join(''); }
const profilUrl = code => `${SITE}/?profil=${fmtCode(code)}`;
// Dates de modification : relevées automatiquement à chaque enregistrement (save)
let snap = snapOf(S);
function snapOf(s) { return { done: { ...s.done }, hl: { ...s.hl }, start: s.start, cats: JSON.stringify(s.cats), prenom: s.prenom || '', pri: JSON.stringify([s.pri.enf, s.pri.fam]) }; }
function stamp() {
  if (!snap) { snap = snapOf(S); return; }
  const now = Date.now(), mt = S.mt;
  for (const k of new Set([...Object.keys(snap.done), ...Object.keys(S.done)])) if (snap.done[k] !== S.done[k]) mt['d' + k] = now;
  for (const k of new Set([...Object.keys(snap.hl), ...Object.keys(S.hl)])) if (snap.hl[k] !== S.hl[k]) mt['h' + k] = now;
  if (snap.start !== S.start) mt.start = now;
  if (snap.cats !== JSON.stringify(S.cats)) mt.cats = now;
  if (snap.prenom !== (S.prenom || '')) mt.prenom = now;
  if (snap.pri !== JSON.stringify([S.pri.enf, S.pri.fam])) mt.pri = now;
  snap = snapOf(S);
}
const syncData = () => ({ v: 1, start: S.start, done: S.done, hl: S.hl, cats: S.cats, prenom: S.prenom || '', pri: { enf: S.pri.enf, fam: S.pri.fam, n: S.pri.n }, jeux: { qcm: S.jeux.qcm, trous: S.jeux.trous }, mt: S.mt });
// Réunit la progression d'un autre appareil (r) avec celle-ci
function mergeRemote(r) {
  const mtL = S.mt, mtR = r.mt || {}, mt = { ...mtL };
  const win = k => { const a = mtL[k] || 0, b = mtR[k] || 0; return b > a ? 'r' : a > b ? 'l' : '='; };
  const take = k => { if (mtR[k]) mt[k] = Math.max(mt[k] || 0, mtR[k]); };
  const map = (lm, rm, p) => {
    const keys = new Set([...Object.keys(lm), ...Object.keys(rm || {}), ...[...Object.keys(mtL), ...Object.keys(mtR)].filter(x => x[0] === p).map(x => x.slice(1))]);
    const out = {};
    for (const k of keys) {
      const w = win(p + k), val = w === 'r' ? (rm || {})[k] : w === 'l' ? lm[k] : (lm[k] !== undefined ? lm[k] : (rm || {})[k]);
      if (val !== undefined && val !== null) out[k] = val;
      take(p + k);
    }
    return out;
  };
  S.done = map(S.done, r.done, 'd');
  S.hl = map(S.hl, r.hl, 'h');
  for (const k of ['start', 'cats']) { const w = win(k); if (w === 'r' || (w === '=' && r[k])) S[k] = r[k]; take(k); }
  { const w = win('prenom'); if (w === 'r' || (w === '=' && !S.prenom && r.prenom)) S.prenom = r.prenom || ''; take('prenom'); }
  if (r.pri) { const w = win('pri'); if (w === 'r' || (w === '=' && !S.pri.enf && !S.pri.fam)) { S.pri.enf = r.pri.enf || ''; S.pri.fam = r.pri.fam || ''; } take('pri'); S.pri.n = Math.max(S.pri.n, r.pri.n || 0); }
  for (const g of ['qcm', 'trous']) { const o = (r.jeux || {})[g] || {}; S.jeux[g] = { n: Math.max(S.jeux[g].n, o.n || 0), best: Math.max(S.jeux[g].best, o.best || 0) }; }
  S.mt = mt;
  S = norm(S);
}
// Chiffrement
const TXT = new TextEncoder();
const toB64 = buf => { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
const fromB64 = s => Uint8Array.from(atob(s), ch => ch.charCodeAt(0));
let keyCache = {};
async function profilKeys(code) {
  if (keyCache.code === code) return keyCache;
  const base = await crypto.subtle.importKey('raw', TXT.encode(code), 'PBKDF2', false, ['deriveBits']);
  const bits = salt => crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: TXT.encode('bible-en-un-an/' + salt), iterations: 60000 }, base, 256);
  const id = [...new Uint8Array(await bits('id'))].map(b => b.toString(16).padStart(2, '0')).join('');
  const key = await crypto.subtle.importKey('raw', await bits('cle'), 'AES-GCM', false, ['encrypt', 'decrypt']);
  return keyCache = { code, id, key };
}
async function encrypt(key, text) { const iv = crypto.getRandomValues(new Uint8Array(12)); const c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, TXT.encode(text)); return { iv: toB64(iv), c: toB64(c) }; }
async function decrypt(key, iv, c) { return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(iv) }, key, fromB64(c))); }
// Synchronisation : lire la version en ligne, réunir, renvoyer si besoin
let syncing = null, syncT = 0, syncEtat = '';
function schedSync(ms = 2500) { if (!P) return; clearTimeout(syncT); syncT = setTimeout(() => syncNow(), ms); }
function saveQuiet() { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {} snap = snapOf(S); try { syncLecture(); } catch (e) {} }
function syncNow() {
  if (!P || !(window.crypto && crypto.subtle)) return Promise.resolve(false);
  if (syncing) return syncing;
  syncEtat = 'encours'; updateProfilStatus();
  syncing = (async () => {
    const k = await profilKeys(P.code);
    for (let essai = 0; essai < 3; essai++) {
      const r = await fetch('api/profil?id=' + k.id, { cache: 'no-store' });
      let remote = null, rev = 0, remoteTxt = '';
      if (r.status === 200) { const j = await r.json(); rev = j.rev; remoteTxt = await decrypt(k.key, j.iv, j.c); remote = JSON.parse(remoteTxt); }
      else if (r.status !== 404) throw new Error('serveur ' + r.status);
      const avant = JSON.stringify(syncData());
      if (remote) mergeRemote(remote);
      const apres = JSON.stringify(syncData());
      if (apres !== avant) { saveQuiet(); if (document.visibilityState === 'visible' && !(document.activeElement && document.activeElement.matches('input,textarea'))) rerender(); }
      if (apres !== remoteTxt) {
        const { iv, c } = await encrypt(k.key, apres);
        const pr = await fetch('api/profil', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: k.id, rev, iv, c }) });
        if (pr.status === 409) continue; // un autre appareil vient d'écrire : on recommence
        if (!pr.ok) throw new Error('serveur ' + pr.status);
        rev = (await pr.json()).rev;
      }
      P.last = Date.now(); P.rev = rev; saveP(); syncEtat = 'ok'; return true;
    }
    throw new Error('conflit');
  })().catch(e => { syncEtat = navigator.onLine === false ? 'horsligne' : 'erreur'; return false; })
    .finally(() => { syncing = null; updateProfilStatus(); });
  return syncing;
}
async function createProfil() { P = { code: newCode(), rev: 0, last: 0 }; saveP(); await syncNow(); }
async function linkProfil(code) {
  const k = await profilKeys(code);
  const r = await fetch('api/profil?id=' + k.id, { cache: 'no-store' });
  if (r.status === 404) throw new Error('inconnu');
  if (!r.ok) throw new Error('réseau');
  P = { code, rev: 0, last: 0 }; saveP();
  if (!await syncNow()) throw new Error('réseau');
}
function profilStatusText() {
  if (!P) return '';
  if (syncEtat === 'encours') return 'Synchronisation…';
  if (syncEtat === 'horsligne') return 'Pas de connexion : la synchronisation se fera au retour du réseau.';
  if (syncEtat === 'erreur') return 'La synchronisation n’a pas abouti. Elle sera retentée automatiquement.';
  if (P.last) { const d = new Date(P.last); return `✓ Synchronisé ${iso(d) === iso(new Date()) ? 'aujourd’hui' : 'le ' + d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à ${pad(d.getHours())} h ${pad(d.getMinutes())}`; }
  return '';
}
function updateProfilStatus() { const el = document.getElementById('profil-status'); if (el) { el.textContent = profilStatusText(); el.className = 'small ' + (syncEtat === 'ok' ? 'ok-txt' : 'muted'); } }
function loadQR() {
  if (window.qrcode) return Promise.resolve();
  return new Promise((ok, ko) => { const s = document.createElement('script'); s.src = 'lib/qrcode.min.js'; s.onload = ok; s.onerror = ko; document.head.append(s); });
}
// Formulaire « J'ai déjà un code » (Réglages et page d'accueil)
function linkForm(after) {
  const inp = h('input', { type: 'text', class: 'code-in', placeholder: 'ABC-DEF-GHJ', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', 'aria-label': 'Code personnel', maxlength: 13 });
  const msg = h('p', { class: 'small' });
  const go = async () => {
    const code = normCode(inp.value);
    if (!codeOk(code)) { msg.textContent = 'Ce code n’est pas valide : il comporte 9 lettres et chiffres, par exemple ABC-DEF-GHJ.'; msg.className = 'small ko-txt'; return; }
    msg.textContent = 'Un instant…'; msg.className = 'small muted';
    try { await linkProfil(code); msg.textContent = ''; if (after) after(); else rerender(); }
    catch (e) { msg.className = 'small ko-txt'; msg.textContent = e.message === 'inconnu' ? 'Aucun profil ne correspond à ce code. Vérifiez-le sur votre autre appareil.' : 'Impossible de joindre le serveur : vérifiez votre connexion et réessayez.'; }
  };
  return h('div', { class: 'link-form' }, h('div', { class: 'code-row' }, inp, h('button', { class: 'btn', onclick: go }, 'Relier')), msg);
}
function profilCard() {
  const prenomIn = h('input', { type: 'text', value: S.prenom || '', placeholder: 'Votre prénom', maxlength: 30, autocomplete: 'given-name',
    onchange: e => { S.prenom = e.target.value.trim().slice(0, 30); save(); } });
  const head = [h('h2', null, 'Mon profil'), h('label', { class: 'f' }, 'Prénom (facultatif, pour vous saluer)'), prenomIn];
  if (!(window.crypto && crypto.subtle)) return h('div', { class: 'card' }, ...head, h('p', { class: 'small muted' }, 'Ce navigateur ne permet pas la synchronisation entre appareils.'));
  const status = h('p', { id: 'profil-status', class: 'small ' + (syncEtat === 'ok' || (P && P.last && !syncEtat) ? 'ok-txt' : 'muted') }, profilStatusText());
  const run = fn => async () => { status.textContent = 'Un instant…'; try { await fn(); } catch (e) { status.textContent = 'Échec : vérifiez votre connexion et réessayez.'; return; } rerender(); };
  if (!P) return h('div', { class: 'card profil-card' }, ...head,
    h('p', { class: 'small' }, 'Retrouvez votre progression, vos versets surlignés et vos scores sur votre téléphone, votre tablette et votre ordinateur. Pas d’inscription ni de mot de passe : l’appli vous donne un code personnel.'),
    h('button', { class: 'btn block', onclick: run(createProfil) }, 'Créer mon profil'), status,
    h('hr', { class: 'sep' }),
    h('p', { class: 'small' }, h('b', null, 'Vous avez déjà un profil sur un autre appareil ?'), ' Tapez votre code : votre progression sur cet appareil sera réunie avec celle du profil.'),
    linkForm());
  const code = fmtCode(P.code);
  const qr = h('div', { class: 'qr-box' });
  const details = h('details', { class: 'more-hours', ontoggle: e => { if (e.target.open && !qr.firstChild) loadQR().then(() => { const q = qrcode(0, 'M'); q.addData(profilUrl(P.code)); q.make(); qr.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); }).catch(() => { qr.textContent = 'QR code indisponible hors connexion.'; }); } },
    h('summary', null, 'Utiliser mon profil sur un autre appareil'),
    h('p', { class: 'small' }, 'Avec l’appareil photo de l’autre appareil, scannez ce QR code. Ou bien, sur l’autre appareil, ouvrez l’appli, allez dans Réglages → Mon profil, et tapez votre code.'), qr);
  const copy = h('button', { class: 'btn alt', onclick: async () => { try { await navigator.clipboard.writeText(code); copy.textContent = 'Copié ✓'; setTimeout(() => { copy.textContent = 'Copier'; }, 1500); } catch (e) { prompt('Votre code :', code); } } }, 'Copier');
  return h('div', { class: 'card profil-card' }, ...head,
    h('p', { class: 'f' }, 'Votre code personnel'),
    h('div', { class: 'code-big' }, code),
    h('p', { class: 'small muted' }, 'Gardez-le précieusement : c’est la seule clé de votre profil. Personne, pas même nous, ne peut le retrouver ni lire votre progression sans lui.'),
    h('p', null,
      h('button', { class: 'btn', onclick: () => window.open('https://wa.me/?text=' + encodeURIComponent(`Mon code personnel « Bible en un an » : ${code}\nÀ garder précieusement. Pour relier un appareil : ${profilUrl(P.code)}`), '_blank', 'noopener') }, 'M’envoyer le code sur WhatsApp'),
      copy),
    details,
    status,
    h('p', null, h('button', { class: 'btn alt', onclick: () => syncNow() }, 'Synchroniser maintenant')),
    h('hr', { class: 'sep' }),
    h('p', { class: 'small' },
      h('button', { class: 'sel-link', onclick: () => { if (confirm('Ne plus synchroniser cet appareil ? Votre progression reste sur cet appareil et sur le profil en ligne ; vous pourrez le relier à nouveau avec votre code.')) { P = null; saveP(); rerender(); } } }, 'Ne plus synchroniser cet appareil'),
      ' · ',
      h('button', { class: 'sel-link', onclick: run(async () => { if (!confirm('Supprimer définitivement votre profil en ligne ? Votre progression reste sur cet appareil, mais vos autres appareils ne seront plus synchronisés.')) return; const k = await profilKeys(P.code); const r = await fetch('api/profil', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: k.id }) }); if (!r.ok) throw new Error('serveur'); P = null; saveP(); }) }, 'Supprimer mon profil en ligne')));
}
// Lien reçu (QR code scanné) : ?profil=ABC-DEF-GHJ
async function profilFromUrl() {
  const qs = new URLSearchParams(location.search), code = normCode(qs.get('profil'));
  if (!qs.has('profil')) return;
  history.replaceState(null, '', location.pathname);
  if (!codeOk(code) || (P && P.code === code)) return;
  if (!confirm(`Relier cet appareil au profil ${fmtCode(code)} ?\n\nVotre progression sur cet appareil sera réunie avec celle de vos autres appareils.`)) return;
  try { await linkProfil(code); V.tab = 'today'; render(); alert('Cet appareil est relié à votre profil ✓'); }
  catch (e) { alert(e.message === 'inconnu' ? 'Aucun profil ne correspond à ce code.' : 'Impossible de joindre le serveur : réessayez depuis Réglages → Mon profil.'); }
}

/* ---------- Réglages ---------- */
function viewSettings() {
  const startIn = h('input', { type: 'date', value: S.start });
  const fileIn = h('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: importData });
  return [
    profilCard(),
    ...installCard(),
    themeCard(),
    ...pushCard(),
    catsCard(),
    lectureCard(),
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
      h('button', { class: 'btn alt', onclick: () => { if (confirm(P ? 'Effacer toute la progression et recommencer ? Elle sera aussi effacée sur vos autres appareils reliés à votre profil.' : 'Effacer toute la progression et recommencer ?')) { S = norm(); save(); V.day = null; V.tab = 'today'; render(); } } }, 'Tout réinitialiser')),
    h('div', { class: 'card small muted' },
      versionLine(),
      h('p', null, 'Textes bibliques : Louis Segond (1910) et Darby (1885), domaine public. La Bible du Semeur (© Biblica) n’est pas incluse : l’application renvoie vers les sources officielles.'),
      h('p', null, 'Aucune donnée personnelle n’est collectée : votre progression reste sur cet appareil. Si vous créez un profil, votre progression est enregistrée en ligne de façon chiffrée, lisible seulement avec votre code personnel. Si vous activez les notifications, seuls l’adresse technique de notification de votre navigateur, votre fuseau horaire et les heures choisies sont conservés (et, pour le rappel de lecture, la date de départ du plan et les numéros des jours lus). Tout est effacé dès que vous désactivez.'),
      h('p', null, h('a', { href: 'confidentialite.html' }, 'Politique de confidentialité')))
  ];
}

// Numéro de version installé (nom du cache hors ligne) et style affiché, pour comparer deux appareils
function versionLine() {
  const p = h('p', { class: 'version' }, 'Version : …');
  const style = { jardin: 'Jardin', veillee: 'Veillée' }[document.documentElement.getAttribute('data-theme')] || '';
  const choix = { auto: 'Automatique', jardin: 'Jardin', veillee: 'Veillée' }[S.theme || 'auto'];
  const show = v => { p.textContent = `Version : ${v} · Apparence : ${choix}${choix !== style ? ` (${style} en ce moment)` : ''}`; };
  if ('caches' in window) caches.keys().then(ks => { const k = ks.filter(x => x.startsWith('bible-an-v')).sort().pop(); show(k ? k.replace('bible-an-v', '') : '?'); }).catch(() => show('?'));
  else show('?');
  return p;
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
    body: JSON.stringify({ subscription: sub, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, hours: myHours(), versets: !S.vOff, lecture: lectureInfo() }) });
  if (!r.ok) throw new Error('serveur ' + r.status);
}
// Rappel de lecture : le serveur a besoin de l'heure, de la date de départ et des jours déjà lus (pour se taire une fois la lecture faite)
const lectureInfo = () => S.lect.on && S.start ? { h: S.lect.h, start: S.start, lus: Object.keys(S.done).map(Number) } : null;
let lectSig = null, lectT = 0;
function syncLecture() {
  if (!pushSub || !S.lect.on) return;
  const sig = [S.start, Object.keys(S.done).sort().join(','), S.lect.h].join('|');
  if (sig === lectSig) return;
  lectSig = sig; clearTimeout(lectT);
  lectT = setTimeout(() => sendSub(pushSub, 'POST').catch(() => { lectSig = null; }), 1500);
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
    checkPushSub();
    const status = h('p', { class: 'small' });
    const run = fn => async () => { status.textContent = 'Un instant…'; try { await fn(); status.textContent = ''; render(); } catch (e) { status.textContent = 'Échec : vérifiez votre connexion et réessayez.'; } };
    const actif = pushSub && !S.vOff;
    notif = [
      actif ? h('p', { class: 'small ok-txt' }, '✓ Notifications activées sur cet appareil') : h('p', { class: 'small muted' }, 'Activez les notifications pour recevoir ces versets même quand l’application est fermée.'),
      h('p', null, actif ? h('button', { class: 'btn alt', onclick: run(async () => { S.vOff = true; save(); if (S.lect.on) await sendSub(pushSub, 'POST'); else await pushOff(); }) }, 'Désactiver les notifications')
        : h('button', { class: 'btn', onclick: run(async () => { S.vOff = false; save(); await pushOn(); }) }, 'Activer les notifications')),
      status];
  }
  return [h('div', { class: 'card' }, title, ...chooser, h('hr', { class: 'sep' }), ...notif)];
}

function checkPushSub() {
  if (pushSub !== undefined || checkPushSub.busy || !pushSupported()) return;
  checkPushSub.busy = true;
  navigator.serviceWorker.ready.then(r => r.pushManager.getSubscription()).then(s => {
    pushSub = s; checkPushSub.busy = false; syncLecture();
    if (V.tab === 'settings') { const y = scrollY; render(); scrollTo(0, y); }
  });
}
// Rappel de la lecture du jour, par notification (du lundi au samedi, sauf si la lecture est déjà faite)
function lectureCard() {
  const title = h('h2', null, 'Rappel de la lecture du jour');
  const intro = h('p', { class: 'muted small' }, 'Du lundi au samedi, une notification vous rappelle le passage du jour, par exemple « Genèse 26–28 · environ 12 min ». Pas de rappel le dimanche, ni si la lecture du jour est déjà marquée comme faite. Toucher la notification ouvre la lecture.');
  const hourSel = h('select', { 'aria-label': 'Heure du rappel', onchange: e => {
    S.lect.h = +e.target.value; save();
    if (pushSub && S.lect.on) sendSub(pushSub, 'POST').catch(() => {});
  } }, Array.from({ length: 18 }, (_, i) => i + 5).map(x => h('option', { value: x, selected: x === S.lect.h }, `${pad(x)} h`)));
  const ics = h('details', { class: 'more-hours' }, h('summary', null, 'Ou ajouter un rappel dans le calendrier du téléphone'),
    h('p', { class: 'muted small' }, 'Crée un rendez-vous répété du lundi au samedi dans l’agenda, à l’heure choisie ci-dessus.'),
    h('button', { class: 'btn alt', onclick: () => { S.remind = pad(S.lect.h) + ':00'; save(); downloadICS(S.remind); } }, 'Ajouter au calendrier (.ics)'));
  const body = [intro, h('label', { class: 'f' }, 'Heure du rappel'), hourSel];
  if (!S.start) body.push(h('p', { class: 'small muted' }, 'Choisissez d’abord une date de départ du plan.'));
  else if (!PUSH_PRET || !pushSupported()) body.push(h('p', { class: 'small muted' }, 'Ce navigateur ne permet pas les notifications : utilisez plutôt le rappel dans le calendrier, ci-dessous.'));
  else if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !(matchMedia('(display-mode: standalone)').matches || navigator.standalone))
    body.push(h('p', { class: 'small' }, 'Sur iPhone, installez d’abord l’application sur l’écran d’accueil, puis ouvrez-la depuis son icône.'));
  else {
    checkPushSub();
    const actif = pushSub && S.lect.on;
    const status = h('p', { class: 'small' });
    const run = fn => async () => { status.textContent = 'Un instant…'; try { await fn(); status.textContent = ''; const y = scrollY; render(); scrollTo(0, y); } catch (e) { status.textContent = 'Échec : vérifiez votre connexion et réessayez.'; } };
    body.push(
      actif ? h('p', { class: 'small ok-txt' }, `✓ Rappel activé : chaque jour de lecture à ${pad(S.lect.h)} h`) : null,
      h('p', null, actif
        ? h('button', { class: 'btn alt', onclick: run(async () => { S.lect.on = false; save(); if (S.vOff) await pushOff(); else await sendSub(pushSub, 'POST'); }) }, 'Désactiver le rappel')
        : h('button', { class: 'btn', onclick: run(async () => { if (!pushSub) S.vOff = true; S.lect.on = true; save(); await pushOn(); }) }, 'Activer le rappel')),
      status);
  }
  return h('div', { class: 'card' }, title, ...body, h('hr', { class: 'sep' }), ics);
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

// Ouvrir la lecture du jour (rappel touché) : onglet Aujourd'hui, descendu jusqu'au texte
function openLecture() {
  V.tab = 'today'; V.day = null; render();
  setTimeout(() => { const el = view.querySelector('.day-head'); if (el) el.scrollIntoView({ block: 'start' }); }, 50);
}
/* ---------- Démarrage ---------- */
applyTheme();
document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => { if (b.dataset.tab === 'prayer' && V.tab === 'prayer') { V.pt = null; V.pg = null; } V.tab = b.dataset.tab; if (V.tab === 'today') V.day = null; if (V.tab === 'bible') V.bv = 'read'; render(); }));

if (window.BIBLE_LSG && window.BIBLE_PLAN) {
  LSG = TEXTS.lsg = window.BIBLE_LSG; PLAN = window.BIBLE_PLAN; TOTAL_CHARS = PLAN.reduce((a, d) => a + d.n, 0); render();
  if (P) syncNow();
  profilFromUrl();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') schedSync(300); });
  addEventListener('online', () => schedSync(500));
  if (S.lect.on) checkPushSub(); // remet à jour le serveur (jours lus hors connexion…)
  if (S.version !== 'lsg') loadVersion(S.version).then(() => { FOLDED = null; rerender(); }, () => {});
  if (window.VERSETS && VERSETS.length) {
    document.body.append(fab, bubble); scheduleHourRefresh();
    const qs = new URLSearchParams(location.search), fromNotif = qs.has('verset'), fromLect = qs.has('lecture');
    if (fromNotif || fromLect) history.replaceState(null, '', location.pathname);
    if (fromLect) openLecture(); else if (fromNotif) openBubble(); else maybeAutoOpen();
    // Notification touchée alors que l'appli était déjà ouverte
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'verset') openBubble(); if (e.data && e.data.type === 'lecture') openLecture(); });
  }
} else {
  view.replaceChildren(h('div', { class: 'card' }, h('h2', null, 'Chargement impossible'),
    h('p', null, 'Les fichiers de données (dossier « data ») sont introuvables. Vérifiez que tout le dossier a bien été décompressé.')));
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
})();
