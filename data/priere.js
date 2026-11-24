// Prier avec la Parole : sujets de prière, versets (Louis Segond 1910, numérotation de l'appli)
// et une courte prière tirée de chaque verset.
// Référence : "Livre chapitre:versets" ; plusieurs morceaux du même chapitre séparés par une virgule.
// {E} = prénoms des enfants (ou « mes enfants »), {F} = prénoms des proches (ou « les membres de ma famille »).
// {E:a|b} : « a » s'il n'y a qu'un prénom, « b » sinon (même chose avec {F:a|b}).
window.PRIERE = [
  { id: 'grace', ic: '🙌', t: 'Rendre grâce à Dieu', d: 'Remercier Dieu pour qui il est et pour tout ce qu’il fait.',
    v: [
      ['Psaumes 136:1', 'Seigneur, je te loue, car tu es bon. Ta miséricorde envers moi ne s’arrête jamais.'],
      ['Psaumes 103:2', 'Mon âme, bénis l’Éternel ! Seigneur, garde-moi d’oublier un seul de tes bienfaits.'],
      ['1 Thessaloniciens 5:18', 'Père, je te dis merci en toutes choses, même aujourd’hui, car c’est ta volonté pour moi en Jésus-Christ.'],
      ['Psaumes 100:4', 'J’entre dans ta présence avec des louanges et des chants. Je bénis ton nom.'],
      ['Philippiens 4:6', 'Seigneur, je ne veux pas m’inquiéter. Je te présente mes besoins, et je te remercie déjà.']
    ],
    p: 'Père, merci pour la vie, pour ta Parole et pour ton amour. Merci pour tes bienfaits, ceux que je vois et ceux que je ne vois pas. Que ma bouche soit pleine de reconnaissance aujourd’hui. Au nom de Jésus. Amen.' },

  { id: 'pardon', ic: '🕊️', t: 'Se repentir, demander pardon', d: 'Confesser ses fautes et recevoir le pardon de Dieu.',
    v: [
      ['1 Jean 1:9', 'Seigneur, je confesse mes péchés devant toi. Tu es fidèle et juste : pardonne-moi et purifie-moi de toute iniquité.'],
      ['Psaumes 51:1-2,10', 'Ô Dieu, aie pitié de moi dans ta bonté. Lave-moi de mon péché et crée en moi un cœur pur.'],
      ['Psaumes 32:5', 'Je ne veux rien te cacher, Seigneur. Je t’avoue mes fautes, et je te remercie de les effacer.'],
      ['Proverbes 28:13', 'Seigneur, aide-moi non seulement à avouer mes péchés, mais aussi à les laisser derrière moi.'],
      ['Actes 3:19', 'Je me tourne vers toi, Seigneur. Efface mes péchés et envoie-moi des temps de rafraîchissement.'],
      ['Daniel 9:9', 'Auprès de toi sont la miséricorde et le pardon. Je m’approche de toi avec confiance.']
    ],
    p: 'Seigneur, tu connais mon cœur. Je reconnais ce que j’ai fait de mal en pensées, en paroles et en actes. Pardonne-moi, purifie-moi et rends-moi la joie de ton salut. Aide-moi à marcher dans ta lumière. Au nom de Jésus. Amen.' },

  { id: 'sang', ic: '✝️', t: 'Être purifié par le sang de Jésus', d: 'S’approcher de Dieu avec assurance grâce au sacrifice de Christ.',
    v: [
      ['1 Jean 1:7', 'Seigneur Jésus, je veux marcher dans la lumière. Merci, ton sang me purifie de tout péché.'],
      ['Hébreux 9:14', 'Que ton sang, Christ, purifie ma conscience des œuvres mortes, afin que je serve le Dieu vivant.'],
      ['Éphésiens 1:7', 'Merci Jésus : en toi j’ai la rédemption par ton sang et le pardon de mes péchés, selon la richesse de ta grâce.'],
      ['Apocalypse 1:5', 'Jésus, tu m’aimes et tu m’as délivré de mes péchés par ton sang. Je t’adore.'],
      ['Hébreux 10:19-22', 'Grâce à ton sang, j’ai libre accès auprès de toi. Je m’approche avec un cœur sincère et plein de foi.'],
      ['Apocalypse 12:11', 'Je proclame la victoire du sang de l’Agneau sur ma vie et sur ma maison.'],
      ['1 Pierre 1:18-19', 'Seigneur, ce n’est pas l’or qui m’a racheté, mais ton sang précieux. Merci pour ce prix immense.']
    ],
    p: 'Seigneur Jésus, merci d’avoir donné ta vie pour moi. Par ton sang, tu me pardonnes, tu me laves et tu me rachètes. Je m’approche de Dieu avec assurance, non par mes mérites, mais par ta grâce. Au nom de Jésus. Amen.' },

  { id: 'enfants', ic: '👨‍👩‍👧', t: 'La conversion de mes enfants', d: 'Confier ses enfants à Dieu et prier pour leur salut.', noms: 'E',
    v: [
      ['Ésaïe 54:13', 'Seigneur, je te présente {E}. Fais-en {E:ton disciple|tes disciples}, et accorde-{E:lui|leur} ta paix.'],
      ['Ésaïe 44:3', 'Répands ton Esprit sur {E}, comme l’eau sur une terre desséchée, et ta bénédiction sur toute ma descendance.'],
      ['Ésaïe 49:25', 'Seigneur, combats pour {E}. Délivre {E:son âme|leurs âmes} de toute emprise du mal, et accorde-{E:lui|leur} ton salut.'],
      ['Jérémie 31:16-17', 'Je retiens mes larmes, car il y a de l’espérance. Ramène {E} vers toi, Seigneur.'],
      ['Proverbes 22:6', 'Donne-moi la sagesse pour instruire {E} dans ta voie, afin qu’en grandissant, {E} ne s’en {E:détourne|détournent} jamais.'],
      ['Joël 2:28', 'Répands ton Esprit sur nos fils et nos filles, Seigneur. Fais-toi connaître personnellement à {E}.'],
      ['3 Jean 4', 'Ma plus grande joie sera de voir {E} marcher dans la vérité. Seigneur, accomplis cela.']
    ],
    p: 'Père, je te confie {E}. Tu {E:l’aimes|les aimes} plus que moi. Ouvre {E:son cœur|leurs cœurs} à ta Parole, attire {E:son âme|leurs âmes} à Jésus, garde {E:sa vie|leurs vies} du mal, et que ton Esprit repose sur {E:sa vie|leurs vies}. Je crois que tu es fidèle. Au nom de Jésus. Amen.' },

  { id: 'famille', ic: '🏠', t: 'La conversion de ma famille', d: 'Prier pour que toute sa maison connaisse le Seigneur.', noms: 'F',
    v: [
      ['Actes 16:31', 'Seigneur Jésus, je crois en toi. Je réclame ta promesse pour {F} : accorde-{F:lui|leur} le salut.'],
      ['Actes 11:14', 'Envoie à {F} des paroles de vie par lesquelles toute ma maison sera sauvée.'],
      ['Josué 24:15', 'Seigneur, j’ai choisi : moi et ma maison, nous servirons l’Éternel.'],
      ['Ézéchiel 36:26', 'Ôte le cœur de pierre de {F}, et donne-{F:lui|leur} un cœur nouveau, un cœur de chair.'],
      ['1 Timothée 2:3-4', 'Tu veux que tous soient sauvés. Conduis {F} à la connaissance de la vérité.'],
      ['2 Pierre 3:9', 'Merci pour ta patience envers {F}. Amène {F} à la repentance.'],
      ['Luc 19:9', 'Seigneur, qu’un jour on puisse dire de ma maison : « Le salut est entré aujourd’hui dans cette maison. »']
    ],
    p: 'Père, je te présente {F}. Ouvre {F:ses yeux|leurs yeux} sur ton amour, place sur {F:son|leur} chemin des témoins fidèles, et fais de moi un exemple de ta grâce. Que toute ma maison te serve. Au nom de Jésus. Amen.' },

  { id: 'patience', ic: '🌿', t: 'Être patient et lent à la colère', d: 'Demander la douceur, la maîtrise de soi et la paix du cœur.',
    v: [
      ['Jacques 1:19-20', 'Seigneur, rends-moi prompt à écouter, lent à parler et lent à me mettre en colère.'],
      ['Proverbes 14:29', 'Donne-moi la sagesse d’être lent à la colère, plutôt que de m’emporter.'],
      ['Proverbes 15:1', 'Mets sur mes lèvres des réponses douces qui apaisent au lieu d’attiser.'],
      ['Proverbes 16:32', 'Apprends-moi à être maître de moi-même ; c’est une vraie victoire.'],
      ['Galates 5:22-23', 'Saint-Esprit, produis en moi ton fruit : l’amour, la paix, la patience, la douceur et la maîtrise de soi.'],
      ['Éphésiens 4:26-27,31-32', 'Que le soleil ne se couche pas sur ma colère. Ôte de moi toute amertume, et aide-moi à pardonner comme tu m’as pardonné.'],
      ['Psaumes 103:8', 'Seigneur, tu es lent à la colère et riche en bonté. Rends-moi semblable à toi.'],
      ['Psaumes 141:3', 'Éternel, mets une garde à ma bouche et veille sur mes lèvres.']
    ],
    p: 'Seigneur, tu connais mes réactions et mes colères. Remplis-moi de ton Esprit, afin que la patience et la douceur remplacent l’impatience. Aide-moi à écouter avant de parler et à pardonner vite. Au nom de Jésus. Amen.' },

  { id: 'identite', ic: '👑', t: 'Mon identité en Christ', d: 'Se rappeler qui l’on est devant Dieu.',
    v: [
      ['2 Corinthiens 5:17', 'Merci Seigneur : en Christ, je suis une nouvelle créature. Les choses anciennes sont passées.'],
      ['Jean 1:12', 'J’ai reçu Jésus et je crois en son nom : je suis enfant de Dieu.'],
      ['Romains 8:1', 'Il n’y a plus aucune condamnation pour moi, car je suis en Jésus-Christ. Merci Père.'],
      ['Romains 8:15-17', 'Je n’ai pas reçu un esprit de crainte. Abba, Père, je suis ton enfant, et j’ai part à ton héritage avec Christ.'],
      ['Romains 8:37', 'Dans toutes ces choses, je suis plus que vainqueur par celui qui m’a aimé.'],
      ['Éphésiens 2:10', 'Je suis ton ouvrage, Seigneur. Conduis-moi dans les bonnes œuvres que tu as préparées pour moi.'],
      ['Éphésiens 1:4-5', 'Tu m’as choisi avant la fondation du monde, par amour. Merci de m’avoir adopté.'],
      ['1 Pierre 2:9', 'Je fais partie de ton peuple. Que ma vie annonce celui qui m’a appelé à son admirable lumière.'],
      ['Galates 2:20', 'Ce n’est plus moi qui vis, c’est Christ qui vit en moi. Je vis par la foi au Fils de Dieu, qui m’a aimé.'],
      ['Colossiens 3:3', 'Ma vie est cachée avec Christ en Dieu. Je suis en sécurité en toi.'],
      ['1 Jean 3:1', 'Père, quel amour ! Tu m’appelles ton enfant, et je le suis.'],
      ['Jean 15:15', 'Jésus, tu m’appelles ton ami. Merci de me faire connaître ce que tu as appris du Père.']
    ],
    p: 'Père, je refuse les mensonges qui disent que je ne vaux rien. Ta Parole dit que je suis ton enfant, que tu m’aimes, que tu me pardonnes et qu’en Christ je suis plus que vainqueur. Aide-moi à vivre aujourd’hui selon ce que tu dis de moi. Au nom de Jésus. Amen.' },

  { id: 'benediction', ic: '🌾', t: 'La bénédiction qui est mienne', d: 'Recevoir avec foi ce que Dieu a donné en Christ.',
    v: [
      ['Éphésiens 1:3', 'Béni sois-tu, Père, qui m’as béni de toutes sortes de bénédictions spirituelles en Christ.'],
      ['Galates 3:13-14', 'Christ m’a racheté de la malédiction. Je reçois par la foi la bénédiction d’Abraham et l’Esprit promis.'],
      ['Galates 3:29', 'J’appartiens à Christ : j’ai part à l’héritage selon la promesse.'],
      ['Nombres 6:24-26', 'Éternel, bénis-moi et garde-moi. Fais luire ta face sur moi, accorde-moi ta grâce et donne-moi la paix.'],
      ['Deutéronome 28:1-6', 'Aide-moi à écouter ta voix et à t’obéir. Bénis ma maison, mon travail, mes entrées et mes sorties.'],
      ['Psaumes 1:1-3', 'Que je trouve mon plaisir dans ta Parole et que je la médite jour et nuit, comme un arbre planté près de l’eau.'],
      ['Romains 8:32', 'Tu n’as pas épargné ton Fils pour moi : je sais que tu me donneras aussi toutes choses avec lui.'],
      ['2 Pierre 1:3', 'Merci, ta puissance m’a donné tout ce qui contribue à la vie et à la piété.'],
      ['Philippiens 4:19', 'Mon Dieu, tu pourvoiras à tous mes besoins selon ta richesse, en Jésus-Christ.'],
      ['Proverbes 10:22', 'Que ta bénédiction m’enrichisse, Seigneur, sans chagrin.'],
      ['Psaumes 23:6', 'Le bonheur et ta grâce m’accompagneront tous les jours de ma vie.']
    ],
    p: 'Père, merci pour toutes les bénédictions que j’ai en Christ. Je les reçois par la foi. Bénis ma maison, mon travail et mes proches, et fais de moi une bénédiction pour les autres. Au nom de Jésus. Amen.' },

  { id: 'promesses', ic: '🌈', t: 'Les promesses de Dieu pour ses enfants', d: 'S’appuyer sur ce que Dieu a promis : il est fidèle.',
    v: [
      ['2 Corinthiens 1:20', 'Toutes tes promesses sont « oui » en Christ. Je dis « Amen » à ta Parole, pour ta gloire.'],
      { h: 'Le salut et le pardon' },
      ['Jean 3:16', 'Merci Père, tu as tant aimé le monde que tu as donné ton Fils. Je crois en lui : j’ai la vie éternelle.'],
      ['Jean 5:24', 'J’écoute ta parole et je crois : tu m’as fait passer de la mort à la vie.'],
      ['Psaumes 103:12', 'Autant l’orient est loin de l’occident, autant tu as éloigné de moi mes péchés. Merci.'],
      ['Jean 10:27-28', 'Je suis ta brebis, Jésus. J’écoute ta voix, et personne ne me ravira de ta main.'],
      { h: 'Sa présence et sa fidélité' },
      ['Matthieu 28:20', 'Seigneur Jésus, tu es avec moi tous les jours, jusqu’à la fin. Tu ne me laisses jamais.'],
      ['Hébreux 13:5', 'Tu ne me délaisseras point et tu ne m’abandonneras point. Je me contente de ce que tu me donnes.'],
      ['Ésaïe 41:10', 'Je ne crains rien, car tu es avec moi. Tu me fortifies, tu viens à mon secours, tu me soutiens.'],
      ['Romains 8:38-39', 'Rien ne pourra me séparer de ton amour en Jésus-Christ. Je m’appuie sur cette assurance.'],
      ['Philippiens 1:6', 'Tu as commencé une bonne œuvre en moi, et tu l’achèveras. Merci pour ta fidélité.'],
      { h: 'La paix' },
      ['Jean 14:27', 'Jésus, je reçois ta paix. Que mon cœur ne se trouble pas et ne s’alarme pas.'],
      ['Philippiens 4:6-7', 'Je te confie mes soucis avec reconnaissance. Que ta paix garde mon cœur et mes pensées.'],
      { h: 'La provision' },
      ['Philippiens 4:19', 'Mon Dieu, tu pourvoiras à tous mes besoins. Je me repose sur toi.'],
      ['Matthieu 6:33', 'Je veux chercher d’abord ton royaume et ta justice. Je te fais confiance pour le reste.'],
      ['Psaumes 23:1', 'L’Éternel est mon berger : je ne manquerai de rien.'],
      { h: 'L’exaucement de la prière' },
      ['Matthieu 7:7', 'Seigneur, je demande, je cherche, je frappe, et je crois que tu réponds.'],
      ['Jean 14:13-14', 'Je te demande ces choses au nom de Jésus, afin que le Père soit glorifié dans le Fils.'],
      ['1 Jean 5:14-15', 'Je prie selon ta volonté, et j’ai l’assurance que tu m’écoutes.'],
      ['Jérémie 33:3', 'Je t’invoque, Seigneur. Réponds-moi et montre-moi de grandes choses que je ne connais pas.'],
      { h: 'La force dans l’épreuve' },
      ['Ésaïe 40:31', 'Je me confie en toi, Seigneur : renouvelle mes forces, que je coure sans me lasser.'],
      ['Philippiens 4:13', 'Je puis tout par celui qui me fortifie.'],
      ['2 Corinthiens 12:9', 'Ta grâce me suffit. Que ta puissance s’accomplisse dans ma faiblesse.'],
      ['Romains 8:28', 'Je t’aime, Seigneur, et je crois que toutes choses concourent à mon bien.'],
      { h: 'La protection' },
      ['Psaumes 91:1-2', 'Tu es mon refuge et ma forteresse, mon Dieu en qui je me confie. Je demeure à ton abri.'],
      ['Psaumes 121:7-8', 'Garde-moi de tout mal, Seigneur. Garde mon âme, mes départs et mes arrivées.'],
      ['Ésaïe 54:17', 'Toute arme forgée contre moi sera sans effet. C’est l’héritage de tes serviteurs.'],
      { h: 'La direction' },
      ['Proverbes 3:5-6', 'Je me confie en toi de tout mon cœur, sans m’appuyer sur ma sagesse. Aplanis mes sentiers.'],
      ['Psaumes 32:8', 'Instruis-moi, Seigneur, et montre-moi la voie que je dois suivre.'],
      ['Jean 16:13', 'Esprit de vérité, conduis-moi dans toute la vérité.'],
      { h: 'Le Saint-Esprit, pour vous et vos enfants' },
      ['Actes 2:38-39', 'Ta promesse est pour moi et pour mes enfants. Remplis-nous de ton Saint-Esprit.'],
      ['Jean 14:16', 'Merci pour le Consolateur, qui demeure éternellement avec moi.'],
      { h: 'La victoire et la vie éternelle' },
      ['1 Corinthiens 15:57', 'Grâces te soient rendues, Seigneur : tu me donnes la victoire par Jésus-Christ.'],
      ['1 Jean 5:11-13', 'J’ai le Fils, j’ai la vie. Merci, je sais que j’ai la vie éternelle.'],
      ['Jean 14:2-3', 'Jésus, tu me prépares une place et tu reviendras me prendre. Je t’attends avec joie.']
    ],
    p: 'Père, tes promesses sont « oui » et « amen » en Jésus-Christ. Je m’appuie sur ta Parole plus que sur ce que je vois. Tu es fidèle : tu me sauves, tu me gardes, tu pourvois et tu me conduis. Au nom de Jésus. Amen.' }
];
