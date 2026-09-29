/*
  Routine giornaliera (da Vita.md). Ogni blocco ha inizio/fine in minuti dalla mezzanotte.
  `kind` collega il blocco a un'area dell'app; `checkable` indica se compare nella checklist del giorno.
*/
const t = (h, m = 0) => h * 60 + m;

export const WEEKDAY_ROUTINE = [
  { id: 'wake', start: t(6, 30), end: t(7, 0), title: 'Sveglia + integratori', kind: 'supplements', icon: 'sun', checkable: true, detail: 'Colazione: porridge preparato la sera prima' },
  { id: 'train-am', start: t(7, 0), end: t(8, 0), title: 'Treno', kind: 'commute', icon: 'train', detail: 'Tempo utile: lettura, ripasso o audio' },
  { id: 'school', start: t(8, 0), end: t(13, 30), title: 'Scuola', kind: 'school', icon: 'book', detail: 'Spuntino a metà mattina (~400 kcal)' },
  { id: 'train-pm', start: t(13, 30), end: t(14, 0), title: 'Treno', kind: 'commute', icon: 'train' },
  { id: 'home', start: t(14, 0), end: t(14, 30), title: 'Casa', kind: 'rest', icon: 'home' },
  { id: 'lunch', start: t(14, 30), end: t(15, 0), title: 'Pranzo', kind: 'meal', icon: 'meal', checkable: true, detail: 'Pasta integrale, pollo, verdure (~850 kcal)' },
  { id: 'skincare', start: t(15, 0), end: t(15, 30), title: 'Riposo / skincare', kind: 'selfcare', icon: 'sparkle', checkable: true },
  { id: 'study', start: t(15, 30), end: t(17, 30), title: 'Studio scuola', kind: 'study', icon: 'pen', checkable: true, detail: '2 ore di lavoro concentrato' },
  { id: 'rest', start: t(17, 30), end: t(18, 0), title: 'Riposo', kind: 'rest', icon: 'pause' },
  { id: 'business', start: t(18, 0), end: t(19, 0), title: 'Business personale', kind: 'business', icon: 'rocket', checkable: true, detail: "Un'ora investita in qualcosa di tuo" },
  { id: 'pre-workout', start: t(19, 0), end: t(19, 30), title: 'Pasto pre-workout', kind: 'meal', icon: 'meal', checkable: true, detail: 'Riso + pollo/tonno, verdure, frutto (~550 kcal)' },
  { id: 'gym', start: t(19, 30), end: t(21, 30), title: 'Palestra', kind: 'gym', icon: 'dumbbell', checkable: true },
  { id: 'post-workout', start: t(21, 30), end: t(22, 0), title: 'Shake proteico + magnesio', kind: 'meal', icon: 'shake', checkable: true, detail: 'Whey, avena, banana, latte + magnesio bisglicinato' },
  { id: 'relax', start: t(22, 0), end: t(22, 30), title: 'Riposo', kind: 'rest', icon: 'moon', detail: 'Prepara il porridge per domani' },
  { id: 'sleep', start: t(22, 30), end: t(24, 0), title: 'Dormire', kind: 'sleep', icon: 'bed' }
];

/*
  Weekend: nessuna scuola e nessuna palestra (rest day sab/dom). Orari dei pasti e integratori mantenuti,
  la domenica include il meal prep settimanale.
*/
export const WEEKEND_ROUTINE = [
  { id: 'wake', start: t(6, 30), end: t(7, 30), title: 'Sveglia + integratori', kind: 'supplements', icon: 'sun', checkable: true, detail: 'Colazione: porridge' },
  { id: 'morning', start: t(7, 30), end: t(10, 30), title: 'Mattina libera / studio', kind: 'study', icon: 'pen', checkable: true, detail: 'Ripasso leggero o lettura' },
  { id: 'snack', start: t(10, 30), end: t(11, 0), title: 'Spuntino', kind: 'meal', icon: 'meal', checkable: true, detail: 'Pane integrale + tacchino + frutto (~400 kcal)' },
  { id: 'business', start: t(11, 0), end: t(13, 0), title: 'Business personale', kind: 'business', icon: 'rocket', checkable: true, detail: 'Blocco lungo per i progetti' },
  { id: 'lunch', start: t(14, 0), end: t(14, 30), title: 'Pranzo', kind: 'meal', icon: 'meal', checkable: true, detail: 'Pasta integrale, pollo, verdure (~850 kcal)' },
  { id: 'skincare', start: t(15, 0), end: t(15, 30), title: 'Riposo / skincare', kind: 'selfcare', icon: 'sparkle', checkable: true },
  { id: 'mealprep', start: t(16, 0), end: t(18, 0), title: 'Meal prep settimanale', kind: 'mealprep', icon: 'chef', checkable: true, onlyDays: ['sun'], detail: '1 kg di pollo, riso, pasta, verdure al forno. Dividi in contenitori.' },
  { id: 'free', start: t(16, 0), end: t(19, 0), title: 'Tempo libero / recupero', kind: 'rest', icon: 'pause', onlyDays: ['sat'] },
  { id: 'dinner', start: t(19, 0), end: t(19, 30), title: 'Cena', kind: 'meal', icon: 'meal', checkable: true, detail: 'Riso + pollo/tonno, verdure, frutto (~550 kcal)' },
  { id: 'evening', start: t(19, 30), end: t(21, 30), title: 'Serata libera', kind: 'rest', icon: 'moon', detail: 'Rest day: il recupero fa parte del percorso' },
  { id: 'post-workout', start: t(21, 30), end: t(22, 0), title: 'Shake proteico + magnesio', kind: 'meal', icon: 'shake', checkable: true, detail: 'Whey, avena, banana, latte + magnesio bisglicinato' },
  { id: 'relax', start: t(22, 0), end: t(22, 30), title: 'Riposo', kind: 'rest', icon: 'moon', detail: 'Prepara il porridge per domani' },
  { id: 'sleep', start: t(22, 30), end: t(24, 0), title: 'Dormire', kind: 'bed', icon: 'bed' }
];

export function getRoutineForDay(dayKey) {
  const isWeekend = dayKey === 'sat' || dayKey === 'sun';
  const base = isWeekend ? WEEKEND_ROUTINE : WEEKDAY_ROUTINE;
  return base.filter(block => !block.onlyDays || block.onlyDays.includes(dayKey));
}

export function formatMinutes(min) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function findCurrentBlock(routine, minutesNow) {
  return routine.find(b => minutesNow >= b.start && minutesNow < b.end) || null;
}

export function findNextBlock(routine, minutesNow) {
  return routine.find(b => b.start > minutesNow) || null;
}
