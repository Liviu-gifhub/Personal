/* Scheda di allenamento aggiornata */
export const PROGRAM = {
  name: 'Bulk invernale - Push/Pull/Legs + Upper/Lower',
  daysPerWeek: 6,
  restDays: ['sat'],
  sessionMinutes: '60-90',
  homeMinutes: 20,
  progression: {
    upperKgPerWeek: '1-2.5',
    lowerKgPerWeek: '2.5-5',
    ifNoMicroplates: 'prima +1 rep, poi +carico',
    plateauWeeks: 2,
    onPlateau: 'passa alla variante successiva (active +1, ciclico), parti più leggero con 2 reps in reserve',
    deloadEveryWeeks: '6-8',
    deloadRule: 'volume e carico -40% per 1 settimana'
  }
};

/* Pattern storici ancora usati per progressione e varianti opzionali */
export const PATTERNS = {
  squat: { label: 'Squat', variations: ['Squat', 'Hack squat', 'Leg press'], lower: true },
  hinge: { label: 'Hinge', variations: ['Stacchi rumeni', 'Stacco trap bar', 'Hip thrust'], lower: true },
  horizontal_push: { label: 'Spinta orizzontale', variations: ['Panca inclinata manubri', 'Chest press', 'Panca piana'], lower: false },
  vertical_push: { label: 'Spinta verticale', variations: ['Shoulder press', 'Military press', 'Shoulder press macchina'], lower: false },
  horizontal_pull: { label: 'Tirata orizzontale', variations: ['Rematore al petto supportato', 'Rematore bilanciere', 'Rematore ai cavi'], lower: false },
  vertical_pull: { label: 'Tirata verticale', variations: ['Lat machine', 'Trazioni', 'Lat machine presa neutra'], lower: false }
};

export const WEEK = [
  {
    day: 'mon',
    name: 'Push',
    exercises: [
      { slot: 'main', name: 'Panca inclinata manubri', sets: 4, reps: '6-8', lower: false },
      { slot: 'main', name: 'Chest press / panca piana', sets: 3, reps: '8-10', lower: false },
      { slot: 'accessory', name: 'Croci ai cavi dal basso verso l’alto (petto alto)', sets: 3, reps: '12-15', lower: false },
      { slot: 'accessory', name: 'Alzate laterali', sets: 4, reps: '12-20', lower: false },
      { slot: 'accessory', name: 'Estensioni tricipiti sopra la testa', sets: 3, reps: '10-12', lower: false },
      { slot: 'accessory', name: 'Pushdown', sets: 2, reps: '12-15', lower: false },
      { slot: 'accessory', name: 'Face pull (rear delt)', sets: 2, reps: '15', lower: false }
    ]
  },
  {
    day: 'tue',
    name: 'Pull',
    exercises: [
      { slot: 'main', name: 'Lat machine / trazioni', sets: 3, reps: '8-10', lower: false },
      { slot: 'main', name: 'Rematore al petto supportato', sets: 3, reps: '8-10', lower: false },
      { slot: 'accessory', name: 'Reverse pec deck (rear delt)', sets: 4, reps: '12-15', lower: false },
      { slot: 'accessory', name: 'Face pull', sets: 3, reps: '15', lower: false },
      { slot: 'accessory', name: 'Curl bilanciere', sets: 3, reps: '8-10', lower: false },
      { slot: 'accessory', name: 'Hammer curl', sets: 2, reps: '12', lower: false }
    ]
  },
  {
    day: 'wed',
    name: 'Legs',
    exercises: [
      { slot: 'main', name: 'Squat o hack squat', sets: 4, reps: '6-8', lower: true },
      { slot: 'main', name: 'Stacchi rumeni', sets: 3, reps: '8', lower: true },
      { slot: 'secondary', name: 'Leg press', sets: 3, reps: '10-12', lower: true },
      { slot: 'accessory', name: 'Leg curl', sets: 3, reps: '10-12', lower: true },
      { slot: 'accessory', name: 'Calf', sets: 4, reps: '10-15', lower: true }
    ]
  },
  {
    day: 'thu',
    name: 'Upper',
    exercises: [
      { slot: 'main', name: 'Panca inclinata bilanciere/multipower (petto alto)', sets: 4, reps: '6-8', lower: false },
      { slot: 'main', name: 'Lat machine presa neutra', sets: 3, reps: '10', lower: false },
      { slot: 'secondary', name: 'Shoulder press', sets: 3, reps: '8-10', lower: false },
      { slot: 'accessory', name: 'Rear delt ai cavi', sets: 3, reps: '15', lower: false },
      { slot: 'accessory', name: 'Croci basso→alto', sets: 2, reps: '15', lower: false },
      { slot: 'accessory', name: 'Curl + pushdown in superserie', sets: 2, reps: '12', lower: false }
    ]
  },
  {
    day: 'fri',
    name: 'Lower',
    exercises: [
      { slot: 'main', name: 'Leg press o hack', sets: 3, reps: '8-10', lower: true },
      { slot: 'main', name: 'Hip thrust', sets: 3, reps: '8-10', lower: true },
      { slot: 'accessory', name: 'Leg extension', sets: 3, reps: '12-15', lower: true },
      { slot: 'accessory', name: 'Leg curl', sets: 3, reps: '10-12', lower: true },
      { slot: 'accessory', name: 'Calf', sets: 3, reps: '12-15', lower: true },
      { slot: 'accessory', name: 'Crunch ai cavi', sets: 3, reps: '10-15', lower: false }
    ]
  },
  {
    day: 'sun',
    name: 'Casa',
    home: true,
    sessionMinutes: 20,
    exercises: [
      { slot: 'accessory', name: 'Alzate di gambe da terra o alla sbarra (basso addome)', sets: 3, reps: '10-15', lower: false },
      { slot: 'accessory', name: 'Reverse crunch', sets: 3, reps: '12-15', lower: false },
      { slot: 'accessory', name: 'Dead bug (per lato)', sets: 3, reps: '10', lower: false },
      { slot: 'accessory', name: 'Plank', sets: 2, reps: '40-60"', lower: false, timed: true },
      { slot: 'accessory', name: 'Collo: flessione/estensione asciugamano', sets: 2, reps: '15', lower: false },
      { slot: 'accessory', name: 'Collo: laterali (per lato)', sets: 2, reps: '12', lower: false }
    ]
  }
];

export const SLOT_LABELS = { main: 'Principale', secondary: 'Secondario', accessory: 'Accessorio' };

export const DAY_OFFSET = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };

export function getSessionForDay(dayKey) {
  return WEEK.find(d => d.day === dayKey) || null;
}

export function parseReps(reps) {
  const cleaned = String(reps).replace(/"/g, '').replace(/″/g, '');
  const [min, max] = cleaned.split('-').map(n => parseInt(n, 10));
  return { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : Number.isFinite(min) ? min : 0 };
}

/*
  Risolve il nome dell'esercizio in base alle variazioni attive.
  activeMap: { [pattern]: indice attivo }
*/
export function resolveExercise(exercise, activeMap = {}) {
  if (!exercise.pattern) {
    return {
      ...exercise,
      id: `acc:${exercise.name}`,
      displayName: exercise.name,
      isPattern: false,
      lower: Boolean(exercise.lower)
    };
  }
  const pattern = PATTERNS[exercise.pattern];
  const active = activeMap[exercise.pattern] ?? 0;
  const idx = (active + (exercise.variation_offset || 0)) % pattern.variations.length;
  const displayName = pattern.variations[idx];
  return {
    ...exercise,
    id: `${exercise.pattern}:${idx}`,
    displayName,
    variationIndex: idx,
    isPattern: true,
    lower: pattern.lower,
    patternLabel: pattern.label
  };
}
