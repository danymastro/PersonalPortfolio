export type Language = 'en' | 'it';

/* ------------------------------------------------------------------ */
/* Shared copy shapes                                                  */
/* ------------------------------------------------------------------ */

export interface ProblemCopy {
  id: string;
  /** Said in the client's own words */
  problem: string;
  pain: string;
  solutionTitle: string;
  solutionText: string;
  deliverables: string[];
  timeline: string;
}

export interface SolutionCopy {
  title: string;
  category: string;
  description: string;
  bullets: string[];
}

export interface ProjectCopy {
  title: string;
  category: string;
  badge: string;
  subtitle: string;
  overview: string;
  challenge: string;
  solution: string;
  role: string;
}

export interface StackGroupCopy {
  title: string;
  blurb: string;
}

export interface ProcessStepCopy {
  title: string;
  description: string;
  duration: string;
}

export interface TranslationSchema {
  nav: {
    solutions: string;
    work: string;
    venture: string;
    stack: string;
    about: string;
    letsTalk: string;
    menu: string;
  };
  hero: {
    badge: string;
    line1: string;
    line2: string;
    line3: string;
    subtext: string;
    rotatingPrefix: string;
    rotatingWords: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    quickFacts: string[];
    scrollHint: string;
  };
  marquee: string[];
  problems: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTrail: string;
    subtitle: string;
    listLabel: string;
    solutionLabel: string;
    deliverablesLabel: string;
    timelineLabel: string;
    cta: string;
    hint: string;
    items: ProblemCopy[];
  };
  solutions: {
    eyebrow: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    items: Record<string, SolutionCopy>;
    footnote: string;
    footnoteCta: string;
  };
  works: {
    eyebrow: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    exploreCaseStudy: string;
    caseStudyBtn: string;
    viewCode: string;
    techUsed: string;
    theChallenge: string;
    theSolution: string;
    roleLabel: string;
    closeWindow: string;
    liveProject: string;
    kindProduct: string;
    kindBlueprint: string;
    blueprintNote: string;
    projects: Record<string, ProjectCopy>;
  };
  venture: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    role: string;
    paragraphs: string[];
    bullets: string[];
    liveLabel: string;
    visitCta: string;
    fallbackNote: string;
    reloadLabel: string;
  };
  speed: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTrail: string;
    subtitle: string;
    points: { title: string; description: string }[];
    processLabel: string;
    steps: Record<string, ProcessStepCopy>;
  };
  stack: {
    eyebrow: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    groups: Record<string, StackGroupCopy>;
  };
  about: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    roleTag: string;
    stickers: { location: string; founder: string; speed: string };
    paragraphs: string[];
    stats: Record<string, string>;
    getInTouch: string;
  };
  footer: {
    availableBadge: string;
    letsTalk: string;
    description: string;
    prompt: string;
    backToTop: string;
    allRightsReserved: string;
  };
  contactModal: {
    badge: string;
    title: string;
    topicQuestion: string;
    topics: string[];
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendBtn: string;
    sendingBtn: string;
    directEmail: string;
    successTitle: string;
    successDesc: string;
    errorTitle: string;
    errorDesc: string;
    closeBtn: string;
  };
  assistant: {
    welcome: string;
    processing: string;
    inputPlaceholder: string;
    sendBtn: string;
    quickPrompts: string[];
    talkDirectly: string;
    progressLabel: string;
    completeNote: string;
    requestQuoteBtn: string;
    briefIntro: string;
    briefNamePlaceholder: string;
    briefEmailPlaceholder: string;
    briefSendBtn: string;
    briefSendingBtn: string;
    briefSent: string;
    briefError: string;
    offlineNote: string;
    errorGeneric: string;
  };
}

/* ------------------------------------------------------------------ */
/* Italian                                                             */
/* ------------------------------------------------------------------ */

const it: TranslationSchema = {
  nav: {
    solutions: 'Cosa risolvo',
    work: 'Progetti',
    venture: 'VibesOut',
    stack: 'Stack',
    about: 'Chi sono',
    letsTalk: 'Parliamone',
    menu: 'Navigazione',
  },

  hero: {
    badge: 'DISPONIBILE PER NUOVI PROGETTI',
    line1: 'FULL-STACK',
    line2: 'DEVELOPER',
    line3: '& PROBLEM SOLVER',
    subtext:
      'Tu hai un problema. Io lo traduco in codice che funziona: piattaforme web, gestionali su misura, call center digitali e automazioni AI. Dal database al deploy, un solo interlocutore — e tempi che si misurano in settimane, non in trimestri.',
    rotatingPrefix: 'Oggi traduco in codice',
    rotatingWords: [
      'piattaforme web complete',
      'gestionali su misura',
      'automazioni AI',
      'web app & prodotti digitali',
      'call center digitali',
      'migrazioni e infrastrutture',
    ],
    ctaPrimary: 'Raccontami il problema',
    ctaSecondary: 'Vedi cosa costruisco',
    quickFacts: [
      'Prototipo cliccabile in 7 giorni',
      'Dal database al dominio: faccio tutto io',
      'AI-assisted, progettato da un umano',
    ],
    scrollHint: 'Scorri',
  },

  marquee: [
    'NEXT.JS',
    'REACT',
    'TYPESCRIPT',
    'NODE.JS',
    'POSTGRESQL',
    'MONGODB',
    'CLOUDFLARE',
    'AI AGENTS',
    'CLAUDE CODE',
    'DEPLOY & DEVOPS',
    'MOTION',
    'FULL-STACK',
  ],

  problems: {
    eyebrow: 'Il punto di partenza',
    titleLead: 'Ogni riga di codice nasce da un',
    titleAccent: 'problema',
    titleTrail: ' vero.',
    subtitle:
      'Non parto dalla tecnologia, parto da cosa ti sta costando tempo o soldi. Scegli la frase che assomiglia di più alla tua situazione: ti mostro come la trasformo in un progetto.',
    listLabel: 'Riconosci qualcosa?',
    solutionLabel: 'La soluzione',
    deliverablesLabel: 'Cosa ti consegno',
    timelineLabel: 'Tempi indicativi',
    cta: 'Parliamo di questo',
    hint: 'Clicca su un problema per vedere la soluzione',
    items: [
      {
        id: 'phone',
        problem: 'Il mio team passa la giornata al telefono.',
        pain:
          'Chiamate perse, richieste che si accavallano, clienti che aspettano. E ogni informazione utile resta nella testa di chi ha risposto.',
        solutionTitle: 'Call center digitale con agenti AI',
        solutionText:
          'Costruisco un centralino intelligente che risponde 24 ore su 24, capisce la richiesta, qualifica il contatto e passa all’operatore umano solo quando serve davvero. Ogni conversazione finisce nel gestionale già trascritta e riassunta.',
        deliverables: [
          'Agente vocale e chat attivi 24/7',
          'Qualifica e instradamento automatico',
          'Trascrizioni e riassunti nel CRM',
          'Dashboard live su chiamate, code e picchi',
          'Escalation immediata verso l’operatore',
        ],
        timeline: '3–5 settimane',
      },
      {
        id: 'spreadsheets',
        problem: 'I dati sono sparsi tra Excel, WhatsApp e mail.',
        pain:
          'Nessuno sa quale sia la versione giusta del file, i numeri non tornano mai e ogni report costa mezza giornata di lavoro manuale.',
        solutionTitle: 'Gestionale su misura, una sola fonte di verità',
        solutionText:
          'Progetto il modello dati e costruisco il gestionale attorno al processo che avete davvero, non attorno a quello che il software del momento vi impone. Ruoli, permessi, storico delle modifiche e report che si generano da soli.',
        deliverables: [
          'Modellazione dati e migrazione dello storico',
          'Ruoli, permessi e log delle modifiche',
          'Automazioni sui passaggi ripetitivi',
          'Report e dashboard in tempo reale',
          'Import, export e integrazione contabile',
        ],
        timeline: '4–8 settimane',
      },
      {
        id: 'idea',
        problem: 'Ho un’idea di prodotto, ma resta ferma.',
        pain:
          'Hai il concept, forse anche il design. Ti manca la persona che lo trasforma in un prodotto vero, online, che qualcuno possa usare davvero.',
        solutionTitle: 'Piattaforma web completa, dal Figma alla produzione',
        solutionText:
          'Prendo l’idea e la porto in produzione: interfaccia, API, database, autenticazione, pagamenti, deploy e dominio. La prima settimana si chiude con un prototipo cliccabile, non con una presentazione.',
        deliverables: [
          'Prototipo navigabile in 7 giorni',
          'Frontend Next.js con API e database',
          'Login, pagamenti e area riservata',
          'Deploy sull’edge, dominio e certificati',
          'Handover con documentazione e credenziali',
        ],
        timeline: '4–10 settimane',
      },
      {
        id: 'repetitive',
        problem: 'Ogni giorno rifacciamo le stesse cose a mano.',
        pain:
          'Copia-incolla tra sistemi che non si parlano, mail riscritte da zero, documenti da leggere e ricopiare. Ore di lavoro che non diventano mai valore.',
        solutionTitle: 'Automazioni AI sui processi interni',
        solutionText:
          'Individuo i punti in cui il lavoro si ripete e ci metto un agente: legge i documenti, estrae i dati, compila, risponde e tiene allineati i sistemi tra loro. Sempre con log e controlli, perché resti verificabile da te.',
        deliverables: [
          'Agenti AI su documenti, mail e ticket',
          'Integrazione con i sistemi già in uso',
          'Estrazione dati e compilazione automatica',
          'Log, controlli e fallback umano',
          'Misurazione delle ore risparmiate',
        ],
        timeline: '2–6 settimane',
      },
      {
        id: 'legacy',
        problem: 'Il sito è lento, vecchio e non porta contatti.',
        pain:
          'Pagine che ci mettono secondi ad aprirsi, nessun posizionamento e visite che non diventano mai una richiesta di preventivo.',
        solutionTitle: 'Ricostruzione performante e orientata alla conversione',
        solutionText:
          'Rifaccio la piattaforma web per massimizzare velocità, conversioni e posizionamento sui motori di ricerca: caricamento istantaneo ovunque e contenuti costruiti per portare la persona a contattarti.',
        deliverables: [
          'Rebuild Next.js distribuito su CDN edge',
          'Core Web Vitals ottimizzati',
          'SEO tecnica, sitemap e dati strutturati',
          'Struttura e copy orientati alla conversione',
          'Analytics e tracciamento degli eventi',
        ],
        timeline: '2–5 settimane',
      },
      {
        id: 'infra',
        problem: 'L’infrastruttura è fragile e ho paura a toccarla.',
        pain:
          'Un server che nessuno ha mai documentato, deploy fatti a mano, backup incerti e un dominio configurato anni fa da qualcun altro.',
        solutionTitle: 'Migrazione, infrastruttura e deploy sotto controllo',
        solutionText:
          'Metto ordine: migrazione senza downtime, configurazione dei server, DNS e certificati, pipeline di deploy automatiche, backup e monitoraggio. Poi ti lascio la documentazione, così non dipendi da me.',
        deliverables: [
          'Migrazione senza interruzioni di servizio',
          'Cloudflare: DNS, CDN, WAF e Workers',
          'Server, Nginx, Docker e certificati',
          'CI/CD con ambiente di staging',
          'Backup, monitoraggio e documentazione',
        ],
        timeline: '1–3 settimane',
      },
    ],
  },

  solutions: {
    eyebrow: 'Cosa costruisco',
    titleMain: 'DAL PROBLEMA',
    titleHighlight: 'AL PRODOTTO',
    subtitle:
      'Sei aree, un unico modo di lavorare: capire il processo, progettarlo, scriverlo in codice e metterlo online.',
    items: {
      'call-center': {
        title: 'Call center digitali',
        category: 'Voce & AI',
        description:
          'Centralini intelligenti che rispondono sempre, capiscono la richiesta e lasciano agli umani solo le conversazioni che contano davvero.',
        bullets: ['Agenti vocali e chat', 'Instradamento automatico', 'Trascrizioni nel CRM', 'Dashboard operativa'],
      },
      'ai-automation': {
        title: 'Automazioni AI',
        category: 'Processi interni',
        description:
          'Agenti su misura che leggono, scrivono, estraggono dati e tengono in sincronia i sistemi. Il lavoro ripetitivo smette di essere lavoro.',
        bullets: ['Agenti su documenti', 'RAG sui dati aziendali', 'Integrazioni fra sistemi', 'Log e controllo umano'],
      },
      platforms: {
        title: 'Piattaforme & gestionali',
        category: 'Software su misura',
        description:
          'Gestionali, portali e SaaS costruiti attorno al vostro processo reale: ruoli, permessi, automazioni e numeri sempre aggiornati.',
        bullets: ['Multi-utente e permessi', 'Modellazione dati', 'Report in tempo reale', 'Integrazioni e API'],
      },
      products: {
        title: 'Prodotti web end-to-end',
        category: 'Dal design al deploy',
        description:
          'Siti, e-commerce e web app completi: interfaccia, backend, pagamenti e infrastruttura. Una sola persona dall’inizio alla messa online.',
        bullets: ['Next.js e React', 'Pagamenti e login', 'SEO e performance', 'Dominio e go-live'],
      },
      infra: {
        title: 'Deploy & infrastruttura',
        category: 'Cloud & DevOps',
        description:
          'Migrazioni senza downtime, server configurati come si deve, DNS, CDN e pipeline automatiche. Specializzato sull’ecosistema Cloudflare.',
        bullets: ['Cloudflare Pages & Workers', 'Migrazioni e DNS', 'CI/CD e staging', 'Backup e monitoraggio'],
      },
      motion: {
        title: 'Brand, Video & Lancio Web',
        category: 'Pacchetto All-In-One',
        description:
          'Coordino direttamente studi partner di fotografia, videomaking e grafica per offrirti un lancio completo: logo, video promozionale e piattaforma web con un unico referente, senza impazzire a gestire agenzie separate.',
        bullets: ['Logo e identità visiva', 'Video promo e shooting foto', 'Sviluppo piattaforma web', 'Unico referente di progetto'],
      },
    },
    footnote: 'Il tuo caso non rientra in nessuna di queste caselle?',
    footnoteCta: 'Scrivimelo comunque',
  },

  works: {
    eyebrow: 'Portfolio',
    titleMain: 'PROGETTI',
    titleHighlight: '& SOLUZIONI',
    subtitle:
      'I prodotti che fondo e sviluppo: da piattaforme live a progetti innovativi in fase di sviluppo riservato.',
    exploreCaseStudy: 'SCOPRI IL PROGETTO ↗',
    caseStudyBtn: 'Dettagli',
    viewCode: 'Codice',
    techUsed: 'Design & Tecnologie',
    theChallenge: 'La Visione',
    theSolution: 'L’Innovazione',
    roleLabel: 'Il mio ruolo',
    closeWindow: 'Chiudi',
    liveProject: 'Vedi live',
    kindProduct: 'Prodotto live',
    kindBlueprint: 'In Sviluppo',
    blueprintNote:
      'Progetti proprietari e su misura: sviluppati con cura maniacale per la UI/UX e focalizzati sull’esperienza utente.',
    projects: {
      vibesout: {
        title: 'VIBESOUT',
        category: 'Startup · Founder',
        badge: 'Prodotto live',
        subtitle:
          'Il social layer degli eventi reali: vedi chi c’è, connetti con le persone prima di arrivare, vivi la serata invece di scorrerla.',
        overview:
          'VibesOut non è un aggregatore di eventi: è il livello sociale che mancava alla vita reale. App iOS e Android, backend, infrastruttura e sito nascono dalla stessa mano.',
        challenge:
          'Costruire da zero un prodotto social completo — mobile, backend real-time, moderazione, notifiche e infrastruttura — con le risorse di una startup agli inizi.',
        solution:
          'Sviluppo completo dall’idea al rilascio su iOS, Android e web: interfaccia fluida, sincronizzazione in tempo reale ed elevata affidabilità, guidati dai feedback costanti degli utenti.',
        role: 'Founder · Full-stack · Prodotto & Brand',
      },
      budokan: {
        title: 'BUDOKAN KARATE',
        category: 'Piattaforma & Gestionale',
        badge: 'Prodotto live',
        subtitle:
          'Gestionale completo per la società sportiva e CMS nativo per il sito web con interfaccia grafica realizzata su misura del cliente.',
        overview:
          'Ho sviluppato un gestionale completo a 360° per digitalizzare l’intera amministrazione della società sportiva, unito a un CMS nativo e a una UI del sito web progettata interamente su misura in base alle scelte e all’identità visiva richiesta dal cliente.',
        challenge:
          'Amministrazione societaria completa: anagrafica atleti, iscrizioni, rinnovi, certificati medici, scadenze e documentazione societaria gestiti in un unico pannello centralizzato.',
        solution:
          'CMS nativo & UI personalizzata: interfaccia grafica realizzata su misura della scelta del cliente e pannello integrato per pubblicare in autonomia news, gare, risultati e gallerie.',
        role: 'Full-Stack Developer · Progettazione & Sviluppo',
      },
      spotdiary: {
        title: 'SPOTDIARY',
        category: 'Progetto Riservato · iOS',
        badge: 'In Sviluppo',
        subtitle:
          'Rivoluzionerà il modo in cui salveremo i nostri ricordi. Il semplice diario personale si trasforma in una nuova dimensione social.',
        overview:
          'Un progetto coperto da riservatezza in fase di sviluppo attivo. Qualcosa di completamente inaspettato che cambierà per sempre il modo in cui custodiamo ciò che viviamo.',
        challenge:
          'Trasformare la memoria da archivio statico a esperienza viva e condivisa, rompendo i vecchi schemi.',
        solution:
          'Un nuovo paradigma tra diario intimo e interazione sociale. Nessun dettaglio o anticipazione tecnica fino al lancio ufficiale.',
        role: 'Founder & Full-Stack Engineer',
      },
    },
  },

  venture: {
    eyebrow: 'Startup & Prodotto Proprietario',
    titleLead: 'Dall’idea',
    titleAccent: 'al mercato.',
    role: 'Founder & Full-Stack Engineer',
    paragraphs: [
      'Da 0 porto un prodotto in produzione. Ho fondato e sviluppato VibesOut: il social layer degli eventi reali che connette le persone prima di arrivare e trasforma ogni serata in un’esperienza vissuta. Dall’app mobile all’infrastruttura, curato al 100%.',
    ],
    bullets: [
      'App pubblicata e attiva su iOS e Android',
      'Architettura full-stack: mobile, backend real-time e cloud',
      'Sviluppo guidato da metriche e utenti reali',
    ],
    liveLabel: 'Visita vibesout.com ↗',
    visitCta: 'Scopri vibesout.com',
    fallbackNote: 'Piattaforma live su vibesout.com',
    reloadLabel: 'Ricarica',
  },

  speed: {
    eyebrow: 'Come lavoro',
    titleLead: 'Consegno in',
    titleAccent: 'giorni,',
    titleTrail: ' non in trimestri.',
    subtitle:
      'Uso l’intelligenza artificiale come moltiplicatore di velocità: sviluppo e consegno software in tempi record mantenendo il pieno controllo qualitativo su ogni riga di codice.',
    points: [
      {
        title: 'Prototipo in 7 giorni',
        description:
          'La prima settimana si chiude con qualcosa che puoi cliccare e mostrare a un socio o a un cliente, non con una slide.',
      },
      {
        title: 'AI-assisted engineering',
        description:
          'Sono specializzato nel vibe coding e negli strumenti AI come Claude Code: quello che richiedeva un team richiede me e poche settimane.',
      },
      {
        title: 'Un solo interlocutore',
        description:
          'Design, frontend, backend, database, deploy e dominio. Nessun rimpallo tra agenzia, sviluppatore e sistemista.',
      },
      {
        title: 'Il codice resta tuo',
        description:
          'Repository, documentazione e credenziali sono tue dal primo giorno. Se domani vuoi cambiare, puoi farlo senza chiedermi il permesso.',
      },
    ],
    processLabel: 'Il percorso, dal primo messaggio al go-live',
    steps: {
      discovery: {
        title: 'Chiamata di 30 minuti',
        description:
          'Parliamo del problema, non delle funzionalità. Se non sono la persona giusta per risolverlo, te lo dico subito.',
        duration: 'Giorno 0',
      },
      blueprint: {
        title: 'Piano operativo e prezzo fisso',
        description:
          'Ricevi la proposta completa con elenco dei rilasci, tempistiche certe e costi chiari. Nessuna sorpresa a metà progetto.',
        duration: 'Giorni 1–3',
      },
      build: {
        title: 'Sviluppo a sprint visibili',
        description:
          'Ogni settimana c’è un link aggiornato da provare. Il progetto lo vedi crescere, non te lo racconto.',
        duration: 'Settimane 1–6',
      },
      ship: {
        title: 'Deploy e passaggio di consegne',
        description:
          'Messa online, dominio, monitoraggio e documentazione. Più un periodo di assistenza per assestare tutto.',
        duration: 'Go live',
      },
    },
  },

  stack: {
    eyebrow: 'Competenze',
    titleMain: 'LO',
    titleHighlight: 'STACK',
    subtitle:
      'Full-stack vero: scrivo l’interfaccia, l’API, il database, l’automazione AI e poi metto tutto online. Senza passare la palla a nessuno.',
    groups: {
      frontend: {
        title: 'Frontend',
        blurb:
          'Interfacce veloci, accessibili e curate nel dettaglio. Next.js e React sono il mio terreno di casa.',
      },
      backend: {
        title: 'Backend & API',
        blurb:
          'API solide, autenticazione, pagamenti, webhook e integrazioni con i sistemi che usi già.',
      },
      database: {
        title: 'Database',
        blurb:
          'Relazionali o documentali, non fa differenza: modellazione, query, indici, migrazioni e dati che restano coerenti.',
      },
      infra: {
        title: 'Deploy & infrastruttura',
        blurb:
          'Particolarmente ferrato su Cloudflare, ma mi occupo anche di server, migrazioni, DNS e pipeline di rilascio.',
      },
      ai: {
        title: 'AI & automazioni',
        blurb:
          'Agenti, RAG sui documenti aziendali, assistenti vocali e flussi automatici collegati ai tuoi strumenti.',
      },
      motion: {
        title: 'Motion & grafica',
        blurb:
          'Animazioni e motion graphics generate da codice, più le grafiche e gli asset di base che servono al progetto.',
      },
    },
  },

  about: {
    badge: 'Dietro lo schermo',
    titleLine1: 'Vi racconto',
    titleHighlight: 'di me.',
    titleLine2: '',
    roleTag: 'Full-Stack Developer · Founder di VibesOut',
    stickers: {
      location: '📍 Campobasso · Remoto',
      founder: '🚀 Founder VibesOut',
      speed: '🎓 UniMol Informatica',
    },
    paragraphs: [
      'Nasco a Campobasso l’11 maggio 2005 e fin da bambino coltivo una forte passione per l’informatica e i computer. Mi sono affacciato al mondo della programmazione a 15 anni e da quel momento non ho più smesso di costruire.',
      'Ho iniziato con lo sviluppo di interfacce web in React per poi evolvere verso un profilo Full-Stack completo, accelerato dall’uscita degli strumenti di intelligenza artificiale di cui mi sono subito appassionato. Ho visto sin dall’inizio nell’AI uno strumento potente per ottimizzare il tempo: spendere meno tempo sulla scrittura di codice ripetitivo e concentrarmi sul problema concreto che il prodotto deve risolvere.',
      'Attualmente sono al secondo anno del corso di Laurea in Informatica presso l’Università degli Studi del Molise (UniMol, Polo di Pesche). In parallelo sono founder di VibesOut, piattaforma social per eventi che ho ideato, sviluppato e rilasciato su iOS e Android.',
    ],
    stats: {
      years: 'Anni di esperienza',
      projects: 'Progetti rilasciati',
      endToEnd: 'End-to-end, un solo referente',
      founded: 'Startup fondata',
    },
    getInTouch: 'Parliamone',
  },

  footer: {
    availableBadge: 'Disponibile per nuovi progetti',
    letsTalk: 'PARLIAMONE',
    description:
      'Descrivimi il problema in due righe. Ti rispondo entro 24 ore con una prima idea di come lo risolverei — gratis, anche se poi non lavoriamo insieme.',
    prompt: 'Hai un problema. Il resto è codice.',
    backToTop: 'Torna in cima',
    allRightsReserved: 'Tutti i diritti riservati.',
  },

  contactModal: {
    badge: 'Iniziamo da qui',
    title: 'Raccontami il problema',
    topicQuestion: 'Di cosa hai bisogno?',
    topics: [
      'Lancio Brand Completo (Web + Video + Logo)',
      'Call center digitale',
      'Automazione AI',
      'Gestionale / piattaforma',
      'Sito o prodotto web',
      'Deploy & infrastruttura',
      'Non lo so ancora',
    ],
    nameLabel: 'Il tuo nome',
    namePlaceholder: 'Mario Rossi',
    emailLabel: 'La tua email',
    emailPlaceholder: 'mario@azienda.it',
    messageLabel: 'Qual è il problema?',
    messagePlaceholder:
      'Descrivimi cosa non funziona oggi, chi ne subisce le conseguenze e quanto tempo o denaro ti sta costando...',
    sendBtn: 'Invia messaggio',
    sendingBtn: 'Invio in corso...',
    directEmail: 'Email diretta',
    successTitle: 'Messaggio ricevuto!',
    successDesc:
      'Grazie. Leggo il tuo problema e ti rispondo entro 24 ore con una prima ipotesi di soluzione e i tempi indicativi.',
    errorTitle: 'Si è verificato un errore',
    errorDesc:
      'Non sono riuscito a inviare il messaggio in automatico. Scrivimi direttamente a danilo.mastropaolo05@gmail.com',
    closeBtn: 'Fatto',
  },

  assistant: {
    welcome:
      '➜  ~  Assistente di Danilo attivo. Raccontami cosa vuoi realizzare: ti faccio due domande veloci e passo tutto a Danilo, che ti risponde via email con una prima ipotesi e i tempi.',
    processing: 'Sto pensando…',
    inputPlaceholder: 'Scrivi qui il tuo progetto o la tua domanda…',
    sendBtn: 'Invia',
    quickPrompts: [
      'Devo lanciare un MVP in 2 settimane',
      'Voglio lanciare un brand (logo, video e sito)',
      'Ho un design Figma pronto da sviluppare',
      'Serve un’app iOS / Android completa',
    ],
    talkDirectly: 'Parliamone direttamente',
    progressLabel: 'aree coperte',
    completeNote:
      '✓ Riepilogo pronto. Lascia la tua email qui sotto e Danilo ti risponde con una prima ipotesi di soluzione e tempi.',
    requestQuoteBtn: 'Invia il riepilogo a Danilo',
    briefIntro: 'Dove ti mando la prima ipotesi di soluzione?',
    briefNamePlaceholder: 'Nome (facoltativo)',
    briefEmailPlaceholder: 'La tua email',
    briefSendBtn: 'Invia a Danilo',
    briefSendingBtn: 'Invio…',
    briefSent:
      '✓ Fatto. Danilo ha ricevuto il riepilogo della nostra chat e ti risponde via email a breve.',
    briefError: 'Non sono riuscito a inviare il riepilogo. Riprova o usa il form contatti.',
    offlineNote:
      'ℹ  L’assistente AI risponde solo online (in locale serve `wrangler pages dev`). Qui trovi comunque i contatti diretti di Danilo.',
    errorGeneric: 'Qualcosa è andato storto, riprova tra poco.',
  },
};

/* ------------------------------------------------------------------ */
/* English                                                             */
/* ------------------------------------------------------------------ */

const en: TranslationSchema = {
  nav: {
    solutions: 'What I solve',
    work: 'Work',
    venture: 'VibesOut',
    stack: 'Stack',
    about: 'About',
    letsTalk: "Let's talk",
    menu: 'Navigation',
  },

  hero: {
    badge: 'AVAILABLE FOR NEW PROJECTS',
    line1: 'FULL-STACK',
    line2: 'DEVELOPER',
    line3: '& PROBLEM SOLVER',
    subtext:
      'You have a problem. I translate it into working code: web platforms, custom internal tools, digital call centres and AI automations. From the database to the deploy, one single point of contact — and timelines measured in weeks, not quarters.',
    rotatingPrefix: 'Today I turn into code',
    rotatingWords: [
      'complete web platforms',
      'custom internal tools',
      'AI automations',
      'web apps & digital products',
      'digital call centres',
      'cloud migrations & infra',
    ],
    ctaPrimary: 'Tell me the problem',
    ctaSecondary: 'See what I build',
    quickFacts: [
      'Clickable prototype in 7 days',
      'From database to domain: all handled by me',
      'AI-assisted, engineered by a human',
    ],
    scrollHint: 'Scroll',
  },

  marquee: [
    'NEXT.JS',
    'REACT',
    'TYPESCRIPT',
    'NODE.JS',
    'POSTGRESQL',
    'MONGODB',
    'CLOUDFLARE',
    'AI AGENTS',
    'CLAUDE CODE',
    'DEPLOY & DEVOPS',
    'MOTION',
    'FULL-STACK',
  ],

  problems: {
    eyebrow: 'The starting point',
    titleLead: 'Every line of code starts from a',
    titleAccent: 'real',
    titleTrail: ' problem.',
    subtitle:
      'I don’t start from technology, I start from what is costing you time or money. Pick the sentence closest to your situation and see how I turn it into a project.',
    listLabel: 'Sound familiar?',
    solutionLabel: 'The solution',
    deliverablesLabel: 'What you get',
    timelineLabel: 'Typical timeline',
    cta: "Let's talk about this",
    hint: 'Click a problem to see the solution',
    items: [
      {
        id: 'phone',
        problem: 'My team spends the whole day on the phone.',
        pain:
          'Missed calls, overlapping requests, customers left waiting. And every useful detail stays in the head of whoever picked up.',
        solutionTitle: 'Digital call centre powered by AI agents',
        solutionText:
          'I build a smart front desk that answers around the clock, understands the request, qualifies the contact and hands over to a human only when it genuinely matters. Every conversation lands in your CRM already transcribed and summarised.',
        deliverables: [
          'Voice and chat agents live 24/7',
          'Automatic qualification and routing',
          'Transcripts and summaries in the CRM',
          'Live dashboard on calls, queues and peaks',
          'Instant escalation to a human operator',
        ],
        timeline: '3–5 weeks',
      },
      {
        id: 'spreadsheets',
        problem: 'Our data is scattered across spreadsheets, chats and email.',
        pain:
          'Nobody knows which file is the current one, the numbers never match, and every report costs half a day of manual work.',
        solutionTitle: 'A custom internal tool, one single source of truth',
        solutionText:
          'I design the data model and build the system around the process you actually run, not around what off-the-shelf software forces on you. Roles, permissions, change history and reports that generate themselves.',
        deliverables: [
          'Data modelling and migration of your history',
          'Roles, permissions and audit log',
          'Automation of the repetitive steps',
          'Real-time reports and dashboards',
          'Import, export and accounting integration',
        ],
        timeline: '4–8 weeks',
      },
      {
        id: 'idea',
        problem: 'I have a product idea, but it never leaves the drawer.',
        pain:
          'You have the concept, maybe even the design. What you are missing is the person who turns it into a real product that someone can actually use.',
        solutionTitle: 'A complete web platform, from Figma to production',
        solutionText:
          'I take the idea and ship it: interface, APIs, database, authentication, payments, deploy and domain. The first week ends with a clickable prototype, not a slide deck.',
        deliverables: [
          'Navigable prototype within 7 days',
          'Next.js frontend with APIs and database',
          'Login, payments and member area',
          'Edge deploy, domain and certificates',
          'Handover with documentation and credentials',
        ],
        timeline: '4–10 weeks',
      },
      {
        id: 'repetitive',
        problem: 'Every day we redo the same things by hand.',
        pain:
          'Copy-pasting between systems that don’t talk to each other, rewriting the same emails, reading documents just to retype them. Hours that never become value.',
        solutionTitle: 'AI automation across your internal processes',
        solutionText:
          'I find the points where work repeats itself and put an agent there: it reads documents, extracts the data, fills things in, replies and keeps your systems in sync. Always with logs and checks, so it stays auditable.',
        deliverables: [
          'AI agents over documents, email and tickets',
          'Integration with the systems already in place',
          'Data extraction and automatic filling',
          'Logs, guardrails and human fallback',
          'Measurement of the hours saved',
        ],
        timeline: '2–6 weeks',
      },
      {
        id: 'legacy',
        problem: 'The website is slow, dated and brings in no leads.',
        pain:
          'Pages that take seconds to open, no search visibility, and visits that never turn into an enquiry.',
        solutionTitle: 'A fast rebuild designed around conversion',
        solutionText:
          'I rebuild the web platform to maximize speed, conversions and search rankings: near-instant loading everywhere and messaging designed to turn visitors into inquiries.',
        deliverables: [
          'Next.js rebuild distributed on an edge CDN',
          'Core Web Vitals tuned',
          'Technical SEO, sitemap and structured data',
          'Structure and copy built for conversion',
          'Analytics and event tracking',
        ],
        timeline: '2–5 weeks',
      },
      {
        id: 'infra',
        problem: 'The infrastructure is fragile and I’m afraid to touch it.',
        pain:
          'A server nobody ever documented, manual deploys, uncertain backups and a domain configured years ago by someone else.',
        solutionTitle: 'Migration, infrastructure and deploys under control',
        solutionText:
          'I clean it up: zero-downtime migration, proper server configuration, DNS and certificates, automated deploy pipelines, backups and monitoring. Then I hand over the documentation, so you don’t depend on me.',
        deliverables: [
          'Migration with no service interruption',
          'Cloudflare: DNS, CDN, WAF and Workers',
          'Servers, Nginx, Docker and certificates',
          'CI/CD with a staging environment',
          'Backups, monitoring and documentation',
        ],
        timeline: '1–3 weeks',
      },
    ],
  },

  solutions: {
    eyebrow: 'What I build',
    titleMain: 'FROM PROBLEM',
    titleHighlight: 'TO PRODUCT',
    subtitle:
      'Six areas, one way of working: understand the process, design it, write it in code and put it online.',
    items: {
      'call-center': {
        title: 'Digital call centres',
        category: 'Voice & AI',
        description:
          'Smart front desks that always answer, understand the request, and leave humans only the conversations that truly deserve them.',
        bullets: ['Voice and chat agents', 'Automatic routing', 'Transcripts into the CRM', 'Operations dashboard'],
      },
      'ai-automation': {
        title: 'AI automations',
        category: 'Internal processes',
        description:
          'Custom agents that read, write, extract data and keep systems in sync. Repetitive work stops being work.',
        bullets: ['Document agents', 'RAG over company data', 'System integrations', 'Logs and human oversight'],
      },
      platforms: {
        title: 'Platforms & internal tools',
        category: 'Custom software',
        description:
          'Back-office systems, portals and SaaS built around your real process: roles, permissions, automation and numbers that stay current.',
        bullets: ['Multi-user and permissions', 'Data modelling', 'Real-time reporting', 'Integrations and APIs'],
      },
      products: {
        title: 'End-to-end web products',
        category: 'Design to deploy',
        description:
          'Complete sites, stores and web apps: interface, backend, payments and infrastructure. One person from kick-off to go-live.',
        bullets: ['Next.js and React', 'Payments and auth', 'SEO and performance', 'Domain and go-live'],
      },
      infra: {
        title: 'Deploy & infrastructure',
        category: 'Cloud & DevOps',
        description:
          'Zero-downtime migrations, properly configured servers, DNS, CDN and automated pipelines. Specialised in the Cloudflare ecosystem.',
        bullets: ['Cloudflare Pages & Workers', 'Migrations and DNS', 'CI/CD and staging', 'Backups and monitoring'],
      },
      motion: {
        title: 'Brand, Video & Web Launch',
        category: 'All-In-One Package',
        description:
          'I directly coordinate partner studios for photography, video production, and branding to deliver turnkey launches: logo, promo video, and custom web platform with a single point of contact.',
        bullets: ['Logo & visual brand identity', 'Promo video & photography shoot', 'Custom web platform build', 'Single project manager'],
      },
    },
    footnote: 'Your case doesn’t fit any of these boxes?',
    footnoteCta: 'Tell me anyway',
  },

  works: {
    eyebrow: 'Portfolio',
    titleMain: 'WORK',
    titleHighlight: '& SOLUTIONS',
    subtitle:
      'Products I build and scale: from live consumer apps to upcoming stealth projects.',
    exploreCaseStudy: 'EXPLORE PROJECT ↗',
    caseStudyBtn: 'Details',
    viewCode: 'Code',
    techUsed: 'Design & Technologies',
    theChallenge: 'The Vision',
    theSolution: 'The Innovation',
    roleLabel: 'My role',
    closeWindow: 'Close',
    liveProject: 'View live',
    kindProduct: 'Live product',
    kindBlueprint: 'In Development',
    blueprintNote:
      'Proprietary products: built with obsessive attention to UI/UX and focused on human experience.',
    projects: {
      vibesout: {
        title: 'VIBESOUT',
        category: 'Startup · Founder',
        badge: 'Live product',
        subtitle:
          'The social layer of real-life events: see who’s going, connect with people before you arrive, live the night instead of scrolling it.',
        overview:
          'VibesOut is not an event aggregator: it’s the social layer real life was missing. The iOS and Android apps, the backend, the infrastructure and the website all come from the same hand.',
        challenge:
          'Building a complete social product from scratch — mobile, real-time backend, moderation, notifications and infrastructure — with early-stage startup resources.',
        solution:
          'End-to-end execution from concept to release on iOS, Android and web: fluid UX, real-time sync and rock-solid reliability driven by active user feedback.',
        role: 'Founder · Full-stack · Product & Brand',
      },
      budokan: {
        title: 'BUDOKAN KARATE',
        category: 'Platform & Custom Management System',
        badge: 'Live product',
        subtitle:
          'Complete sports club management software and native website CMS with custom UI tailored to the client’s specifications.',
        overview:
          'Designed and developed a complete 360° management platform for the entire sports club administration, paired with a native CMS and a website UI custom-designed to the client’s exact preferences and brand identity.',
        challenge:
          'Full club administration: athlete registry, enrollments, renewals, medical certificate tracking, and administrative documents unified in one dashboard.',
        solution:
          'Native CMS & Tailored UI: a custom user interface built to the client’s choices, featuring an integrated panel to autonomously manage news, events, competition results, and media galleries.',
        role: 'Full-Stack Developer · Product Design & Engineering',
      },
      spotdiary: {
        title: 'SPOTDIARY',
        category: 'Stealth Project · iOS',
        badge: 'In Development',
        subtitle:
          'Revolutionizing how we save and cherish our memories. The classic personal diary transforming into a new social dimension.',
        overview:
          'A stealth project under active development. Something entirely unexpected that will redefine how we preserve our life moments.',
        challenge:
          'Evolving personal memories from a passive archive into an active, social experience without repeating existing formulas.',
        solution:
          'A new paradigm bridging intimate diaries and social discovery. Everything else remains strictly confidential until release.',
        role: 'Founder & Full-Stack Engineer',
      },
    },
  },

  venture: {
    eyebrow: 'Startup & Proprietary Product',
    titleLead: 'From idea',
    titleAccent: 'to market.',
    role: 'Founder & Full-Stack Engineer',
    paragraphs: [
      'From zero, I bring products all the way to production. I founded and engineered VibesOut from scratch: the real-world events social layer connecting people before arrival and turning nights out into shared experiences. From mobile apps to cloud infra, built 100% end-to-end.',
    ],
    bullets: [
      'Published and active app on iOS and Android',
      'Full-stack architecture: mobile, real-time backend & cloud',
      'Iterative growth driven by real user metrics',
    ],
    liveLabel: 'Visit vibesout.com ↗',
    visitCta: 'Explore vibesout.com',
    fallbackNote: 'Live platform on vibesout.com',
    reloadLabel: 'Reload',
  },

  speed: {
    eyebrow: 'How I work',
    titleLead: 'I ship in',
    titleAccent: 'days,',
    titleTrail: ' not quarters.',
    subtitle:
      'I use AI as a speed multiplier: shipping software in record time while maintaining full quality control over every deliverable.',
    points: [
      {
        title: 'Prototype in 7 days',
        description:
          'The first week ends with something you can click and show to a partner or a customer, not with a slide.',
      },
      {
        title: 'AI-assisted engineering',
        description:
          'I specialise in vibe coding and AI tooling like Claude Code: what used to need a team now needs me and a few weeks.',
      },
      {
        title: 'One point of contact',
        description:
          'Design, frontend, backend, database, deploy and domain. No ping-pong between agency, developer and sysadmin.',
      },
      {
        title: 'The code stays yours',
        description:
          'Repository, documentation and credentials are yours from day one. If you want to move on tomorrow, you can.',
      },
    ],
    processLabel: 'The path, from first message to go-live',
    steps: {
      discovery: {
        title: '30-minute call',
        description:
          'We talk about the problem, not the features. If I’m not the right person to solve it, I’ll say so straight away.',
        duration: 'Day 0',
      },
      blueprint: {
        title: 'Operational plan and fixed price',
        description:
          'You receive a clear proposal with detailed deliverables, fixed timeline and transparent pricing. No surprises halfway through.',
        duration: 'Days 1–3',
      },
      build: {
        title: 'Build in visible sprints',
        description:
          'Every week there’s an updated link to try. You watch the project grow instead of hearing about it.',
        duration: 'Weeks 1–6',
      },
      ship: {
        title: 'Deploy and handover',
        description:
          'Go-live, domain, monitoring and documentation. Plus a support window to settle everything in.',
        duration: 'Go live',
      },
    },
  },

  stack: {
    eyebrow: 'Capabilities',
    titleMain: 'THE',
    titleHighlight: 'STACK',
    subtitle:
      'Genuinely full-stack: I write the interface, the API, the database, the AI automation, and then I put it all online myself.',
    groups: {
      frontend: {
        title: 'Frontend',
        blurb: 'Fast, accessible, carefully detailed interfaces. Next.js and React are home ground.',
      },
      backend: {
        title: 'Backend & APIs',
        blurb: 'Solid APIs, authentication, payments, webhooks and integrations with the systems you already use.',
      },
      database: {
        title: 'Databases',
        blurb:
          'Relational or document-based, it makes no difference: modelling, queries, indexes, migrations and data that stays consistent.',
      },
      infra: {
        title: 'Deploy & infrastructure',
        blurb:
          'Particularly strong on Cloudflare, but I also handle servers, migrations, DNS and release pipelines.',
      },
      ai: {
        title: 'AI & automation',
        blurb: 'Agents, RAG over company documents, voice assistants and automated flows wired into your tools.',
      },
      motion: {
        title: 'Motion & graphics',
        blurb:
          'Code-generated animation and motion graphics, plus the graphics and assets a project needs along the way.',
      },
    },
  },

  about: {
    badge: 'Behind the screen',
    titleLine1: 'A little',
    titleHighlight: 'about me.',
    titleLine2: '',
    roleTag: 'Full-Stack Developer · Founder of VibesOut',
    stickers: {
      location: '📍 Campobasso · Remote',
      founder: '🚀 VibesOut founder',
      speed: '🎓 UniMol CompSci',
    },
    paragraphs: [
      'Born in Campobasso on May 11, 2005, I’ve had a deep passion for computer science and technology since childhood. I got into programming at 15 and haven’t stopped building ever since.',
      'I started out building web interfaces with React before expanding into full-stack engineering, a transition heavily accelerated by the rise of AI tools. I immediately saw AI as a powerful catalyst: spending less time on boilerplate code and more time focusing on solving the core business problem.',
      'I am currently in my second year of Computer Science at the University of Molise (UniMol, Pesche Campus). In parallel, I am the founder of VibesOut, an event-based social platform I designed, built and shipped to iOS and Android.',
    ],
    stats: {
      years: 'Years of experience',
      projects: 'Projects shipped',
      endToEnd: 'End-to-end, one contact',
      founded: 'Startup founded',
    },
    getInTouch: "Let's talk",
  },

  footer: {
    availableBadge: 'Available for new projects',
    letsTalk: "LET'S TALK",
    description:
      'Describe the problem in two lines. I reply within 24 hours with a first take on how I’d solve it — free, even if we never end up working together.',
    prompt: 'You have a problem. The rest is code.',
    backToTop: 'Back to top',
    allRightsReserved: 'All rights reserved.',
  },

  contactModal: {
    badge: 'Start here',
    title: 'Tell me the problem',
    topicQuestion: 'What do you need?',
    topics: [
      'Full Brand Launch (Web + Video + Logo)',
      'Digital call centre',
      'AI automation',
      'Internal tool / platform',
      'Website or web product',
      'Deploy & infrastructure',
      'Not sure yet',
    ],
    nameLabel: 'Your name',
    namePlaceholder: 'Jane Doe',
    emailLabel: 'Your email',
    emailPlaceholder: 'jane@company.com',
    messageLabel: 'What’s the problem?',
    messagePlaceholder:
      'Tell me what isn’t working today, who suffers because of it, and how much time or money it’s costing you...',
    sendBtn: 'Send message',
    sendingBtn: 'Sending...',
    directEmail: 'Direct email',
    successTitle: 'Message received!',
    successDesc:
      'Thank you. I’ll read your problem and reply within 24 hours with a first idea of the solution and a rough timeline.',
    errorTitle: 'Something went wrong',
    errorDesc:
      'I could not send the message automatically. Please write directly to danilo.mastropaolo05@gmail.com',
    closeBtn: 'Done',
  },

  assistant: {
    welcome:
      '➜  ~  Danilo’s assistant is online. Tell me what you want to build: I’ll ask a couple of quick questions and hand everything to Danilo, who replies by email with a first take and timeline.',
    processing: 'Thinking…',
    inputPlaceholder: 'Describe your project or ask a question…',
    sendBtn: 'Send',
    quickPrompts: [
      'I need an MVP shipped in 2 weeks',
      'I want to launch a full brand (logo, video & web)',
      'I have a Figma design ready to build',
      'I need a complete iOS / Android app',
    ],
    talkDirectly: 'Talk directly',
    progressLabel: 'areas covered',
    completeNote:
      '✓ Summary ready. Drop your email below and Danilo will get back to you with a first take on the solution and timeline.',
    requestQuoteBtn: 'Send the summary to Danilo',
    briefIntro: 'Where should Danilo send the first take?',
    briefNamePlaceholder: 'Name (optional)',
    briefEmailPlaceholder: 'Your email',
    briefSendBtn: 'Send to Danilo',
    briefSendingBtn: 'Sending…',
    briefSent:
      '✓ Done. Danilo received the summary of our chat and will reply by email shortly.',
    briefError: 'I could not send the summary. Try again or use the contact form.',
    offlineNote:
      'ℹ  The AI assistant only replies online (locally it needs `wrangler pages dev`). Danilo’s direct contacts are still here.',
    errorGeneric: 'Something went wrong, please try again shortly.',
  },
};

export const translations: Record<Language, TranslationSchema> = { en, it };
