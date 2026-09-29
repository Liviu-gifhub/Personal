/*
  Welcoming messages per fascia oraria (da Indicazioni.md).
  Ogni fascia: [inizioMinuti, fineMinuti), etichetta e messaggi in rotazione.
*/
const t = (h, m = 0) => h * 60 + m;

export const MESSAGE_SLOTS = [
  {
    id: 'wake',
    label: 'Risveglio',
    start: t(6),
    end: t(7),
    messages: ['Buongiorno Liviu. Iniziamo bene.', 'Buongiorno Liviu. Oggi si costruisce.', 'Un nuovo giorno, Liviu. Facciamolo contare.']
  },
  {
    id: 'train',
    label: 'Treno',
    start: t(7),
    end: t(8),
    messages: ['Buongiorno Liviu. La giornata è già iniziata.', 'Liviu, un passo alla volta.', 'Il tempo passa comunque. Facciamolo fruttare.']
  },
  {
    id: 'school',
    label: 'Scuola',
    start: t(8),
    end: t(13),
    messages: [
      'Concentrati sul presente, Liviu.',
      'Liviu, fai bene quello che hai davanti.',
      'Una giornata produttiva comincia dalle piccole cose.',
      'Continua così, Liviu. Il lavoro si accumula.'
    ]
  },
  {
    id: 'return',
    label: 'Ritorno',
    start: t(13),
    end: t(14),
    messages: ['Mattinata fatta, Liviu. Ora si riparte.', 'Una parte della giornata è già alle spalle.', 'Bene così, Liviu. Manteniamo il ritmo.']
  },
  {
    id: 'lunch',
    label: 'Pranzo',
    start: t(14),
    end: t(15),
    messages: ['Prima recuperiamo, poi si riparte.', 'Mangia bene, Liviu. Ti servirà energia.', 'Nutri il corpo. Poi torniamo al lavoro.']
  },
  {
    id: 'recover',
    label: 'Recupero',
    start: t(15),
    end: t(15, 30),
    messages: ['Anche il recupero fa parte del percorso.', 'Rallenta un attimo, Liviu.', 'Recuperare non significa fermarsi.']
  },
  {
    id: 'study',
    label: 'Studio',
    start: t(15, 30),
    end: t(17, 30),
    messages: [
      'È il momento di fare il lavoro, Liviu.',
      "Un'altra sessione. Un altro passo avanti.",
      'Concentrati. Il resto può aspettare.',
      'Liviu, costruisci oggi quello che ti servirà domani.'
    ]
  },
  {
    id: 'break',
    label: 'Pausa',
    start: t(17, 30),
    end: t(18),
    messages: ['Hai fatto il tuo. Ora recupera.', 'Una pausa adesso, più energia dopo.', 'Respira, Liviu. Tra poco si riparte.']
  },
  {
    id: 'business',
    label: 'Business',
    start: t(18),
    end: t(19),
    messages: [
      'Ora si costruisce qualcosa di tuo, Liviu.',
      "Un'ora investita in te stesso.",
      'I progetti grandi iniziano da ore come questa.',
      'Liviu, continua a costruire.'
    ]
  },
  {
    id: 'pre-workout',
    label: 'Pre-workout',
    start: t(19),
    end: t(19, 30),
    messages: ['Carburante dentro. È quasi ora.', 'Mangia bene. Tra poco si spinge.', 'Energia per il lavoro che ti aspetta, Liviu.', 'Preparati. Il workout è vicino.']
  },
  {
    id: 'gym',
    label: 'Palestra',
    start: t(19, 30),
    end: t(21, 30),
    messages: [
      'È il momento, Liviu. Si lavora.',
      'Focus. Una serie alla volta.',
      'Fai quello per cui sei venuto.',
      'Nessuna fretta. Solo lavoro di qualità.',
      'Liviu, oggi si aggiunge un altro mattoncino.',
      'Disciplina prima della motivazione.'
    ]
  },
  {
    id: 'dinner',
    label: 'Cena / Recupero',
    start: t(21, 30),
    end: t(22),
    messages: [
      'Workout fatto, Liviu. Ora si recupera.',
      'Hai dato il massimo. Ora dai al corpo ciò che serve.',
      'Allenamento completato. Ottimo lavoro.',
      'Il lavoro finisce. Il recupero inizia.'
    ]
  },
  {
    id: 'relax',
    label: 'Relax',
    start: t(22),
    end: t(22, 30),
    messages: ['Giornata quasi fatta, Liviu.', 'Ora rallentiamo.', 'Hai fatto abbastanza per oggi.', 'Lascia andare la giornata. Domani si continua.']
  },
  {
    id: 'night',
    label: 'Notte',
    start: t(22, 30),
    end: t(30), // fino alle 06:00 del giorno dopo
    messages: [
      'Buonanotte, Liviu. Domani si riparte.',
      'Tutto quello che potevi fare oggi è fatto.',
      'Riposa bene. Il lavoro continua domani.',
      'Spegni tutto, Liviu. Ora recupera.',
      'Buonanotte. Un altro giorno costruito.'
    ]
  }
];

export const SPECIAL_MESSAGES = [
  'Liviu, non serve essere perfetti. Serve essere costanti.',
  'Quello che fai ogni giorno diventa chi sei.',
  'Piccoli progressi. Ogni giorno.',
  'La disciplina rende normale ciò che prima sembrava difficile.',
  'Liviu, continua. Stai costruendo qualcosa.',
  'Non serve fare tutto oggi. Serve fare ciò che conta.',
  'Un giorno alla volta. Ma senza saltarne troppi.',
  'Il futuro Liviu ringrazierà quello di oggi.',
  'Fai bene le cose semplici. Ogni giorno.',
  "La costanza batte l'intensità occasionale.",
  'Nessuna fretta. Nessuna pausa inutile.',
  'Liviu, resta sul percorso.',
  'Oggi conta quanto ieri.',
  'La routine non ti limita. Ti dà spazio per crescere.',
  'Continua a presentarti. Il resto viene dopo.'
];

/* Messaggi per il weekend (rest day): tono coerente con gli originali. */
export const WEEKEND_MESSAGES = {
  morning: ['Buongiorno Liviu. Oggi si recupera, ma con ordine.', 'Rest day, Liviu. Il corpo cresce quando riposa.'],
  sunday: ['Domenica, Liviu: meal prep e la settimana è già vinta a metà.', 'Prepara oggi. Ringrazierai da lunedì a venerdì.']
};

export function getSlotForMinutes(minutes) {
  const m = minutes < t(6) ? minutes + t(24) : minutes;
  return MESSAGE_SLOTS.find(s => m >= s.start && m < s.end) || MESSAGE_SLOTS[MESSAGE_SLOTS.length - 1];
}

/*
  Sceglie il messaggio in modo deterministico per (giorno, fascia, apertura) così cambia ad ogni apertura
  ma resta stabile durante la sessione. ~1 volta su 4 mostra un messaggio "speciale".
*/
export function pickWelcome({ minutes, dayKey, seed }) {
  const slot = getSlotForMinutes(minutes);
  const isWeekend = dayKey === 'sat' || dayKey === 'sun';
  const useSpecial = seed % 4 === 0;

  if (isWeekend && dayKey === 'sun' && slot.id !== 'night' && seed % 3 === 0) {
    return { text: WEEKEND_MESSAGES.sunday[seed % WEEKEND_MESSAGES.sunday.length], slot, special: false };
  }
  if (isWeekend && (slot.id === 'train' || slot.id === 'school') && seed % 2 === 0) {
    return { text: WEEKEND_MESSAGES.morning[seed % WEEKEND_MESSAGES.morning.length], slot, special: false };
  }
  if (useSpecial) {
    return { text: SPECIAL_MESSAGES[Math.floor(seed / 4) % SPECIAL_MESSAGES.length], slot, special: true };
  }
  return { text: slot.messages[seed % slot.messages.length], slot, special: false };
}
