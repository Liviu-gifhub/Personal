/* Scheda di allenamento (da Vita.md) */
export const PROGRAM = {
  name: 'Bulk invernale - 5 giorni',
  daysPerWeek: 5,
  restDays: ['sat', 'sun'],
  sessionMinutes: '60-90',
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

export const PATTERNS = {
  squat: { label: 'Squat', variations: ['Back squat', 'Hack squat', 'Leg press'], lower: true },
  hinge: { label: 'Hinge', variations: ['Stacco rumeno', 'Stacco trap bar', 'Hip thrust'], lower: true },
  horizontal_push: { label: 'Spinta orizzontale', variations: ['Panca piana', 'Panca inclinata manubri', 'Chest press'], lower: false },
  vertical_push: { label: 'Spinta verticale', variations: ['Military press', 'Shoulder press manubri seduto', 'Shoulder press macchina'], lower: false },
  horizontal_pull: { label: 'Tirata orizzontale', variations: ['Rematore bilanciere', 'Rematore petto appoggiato', 'Rematore ai cavi'], lower: false },
  vertical_pull: { label: 'Tirata verticale', variations: ['Trazioni/Chin-up', 'Lat machine', 'Lat machine presa neutra'], lower: false }
};

export const WEEK = [
  {
    day: 'mon',
    name: 'Upper',
    exercises: [
      { slot: 'main', pattern: 'horizontal_push', sets: 4, reps: '6-8' },
      { slot: 'main', pattern: 'horizontal_pull', sets: 4, reps: '6-8' },
      { slot: 'main', pattern: 'vertical_pull', sets: 3, reps: '8-10' },
      { slot: 'secondary', pattern: 'vertical_push', variation_offset: 1, sets: 3, reps: '10' },
      { slot: 'accessory', name: 'Curl bicipiti', sets: 2, reps: '10-12' },
      { slot: 'accessory', name: 'Pushdown tricipiti', sets: 2, reps: '10-12' }
    ]
  },
  {
    day: 'tue',
    name: 'Lower',
    exercises: [
      { slot: 'main', pattern: 'squat', sets: 4, reps: '6-8' },
      { slot: 'main', pattern: 'hinge', sets: 3, reps: '6-8' },
      { slot: 'accessory', name: 'Leg curl', sets: 3, reps: '10-12' },
      { slot: 'accessory', name: 'Calf raise', sets: 3, reps: '12-15' },
      { slot: 'accessory', name: 'Core', sets: 3, reps: '10-15' }
    ]
  },
  {
    day: 'wed',
    name: 'Push',
    exercises: [
      { slot: 'main', pattern: 'vertical_push', sets: 4, reps: '6-8' },
      { slot: 'secondary', pattern: 'horizontal_push', variation_offset: 1, sets: 3, reps: '8-10' },
      { slot: 'accessory', name: 'Alzate laterali', sets: 4, reps: '12-15' },
      { slot: 'accessory', name: 'Tricipiti', sets: 3, reps: '10-12' }
    ]
  },
  {
    day: 'thu',
    name: 'Pull',
    exercises: [
      { slot: 'secondary', pattern: 'vertical_pull', variation_offset: 1, sets: 3, reps: '8-10' },
      { slot: 'secondary', pattern: 'horizontal_pull', variation_offset: 1, sets: 3, reps: '8-10' },
      { slot: 'accessory', name: 'Rear delt fly', sets: 3, reps: '12-15' },
      { slot: 'accessory', name: 'Curl bicipiti', sets: 3, reps: '10-12' }
    ]
  },
  {
    day: 'fri',
    name: 'Legs',
    exercises: [
      { slot: 'secondary', pattern: 'squat', variation_offset: 1, sets: 3, reps: '8-10' },
      { slot: 'secondary', pattern: 'hinge', variation_offset: 1, sets: 3, reps: '8-10' },
      { slot: 'accessory', name: 'Leg extension', sets: 3, reps: '10-12' },
      { slot: 'accessory', name: 'Leg curl', sets: 2, reps: '12' },
      { slot: 'accessory', name: 'Calf raise', sets: 3, reps: '12-15' }
    ]
  }
];

export const SLOT_LABELS = { main: 'Principale', secondary: 'Secondario', accessory: 'Accessorio' };

export function getSessionForDay(dayKey) {
  return WEEK.find(d => d.day === dayKey) || null;
}

export function parseReps(reps) {
  const [min, max] = String(reps)
    .split('-')
    .map(n => parseInt(n, 10));
  return { min, max: Number.isFinite(max) ? max : min };
}

/*
  Risolve il nome dell'esercizio in base alle variazioni attive.
  activeMap: { [pattern]: indice attivo }
*/
export function resolveExercise(exercise, activeMap = {}) {
  if (!exercise.pattern) {
    return { ...exercise, id: `acc:${exercise.name}`, displayName: exercise.name, isPattern: false };
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
