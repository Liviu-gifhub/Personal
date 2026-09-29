import { PROGRAM, parseReps } from '../data/program.js';
import { daysBetween, parseDateKey, weekKey } from './time.js';

/* Incremento consigliato per settimana (kg) in base al pattern (upper vs lower). */
export function incrementFor(exercise) {
  if (!exercise.isPattern) return 1;
  return exercise.lower ? 2.5 : 1;
}

/* Storico di un esercizio: [{ date, sets:[{kg,reps}], deload }] dal più recente. */
export function exerciseHistory(workouts, exerciseId, { excludeDate } = {}) {
  return Object.entries(workouts)
    .filter(([date, w]) => date !== excludeDate && w.exercises?.[exerciseId]?.sets?.some(s => s?.kg != null || s?.reps != null))
    .map(([date, w]) => ({ date, sets: w.exercises[exerciseId].sets.filter(Boolean), deload: Boolean(w.deload) }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* Punteggio di una sessione: carico massimo e stima 1RM (Epley) sul set migliore. */
export function sessionScore(sets) {
  let best = 0;
  let topKg = 0;
  let totalReps = 0;
  let repsAtTop = 0;
  for (const s of sets) {
    const kg = Number(s.kg) || 0;
    const reps = Number(s.reps) || 0;
    if (!kg || !reps) continue;
    const e1rm = kg * (1 + reps / 30);
    if (e1rm > best) best = e1rm;
    if (kg > topKg) {
      topKg = kg;
      repsAtTop = 0;
    }
    if (kg === topKg) repsAtTop += reps;
    totalReps += reps;
  }
  return { e1rm: Math.round(best * 10) / 10, topKg, totalReps, repsAtTop };
}

/*
  Una sessione è un progresso rispetto alla precedente se il carico massimo è salito
  oppure, a parità di carico, se sono aumentate le ripetizioni fatte a quel carico.
  Così salire di peso e ripartire dal minimo del range non viene letto come stallo.
*/
export function improved(current, previous) {
  if (current.topKg > previous.topKg) return true;
  if (current.topKg === previous.topKg && current.repsAtTop > previous.repsAtTop) return true;
  return false;
}

/*
  Suggerimento per la prossima sessione, secondo le regole della scheda:
  - tutte le serie al massimo del range di rep -> aumenta il carico (upper 1-2.5 kg, lower 2.5-5 kg)
  - altrimenti -> stesso carico, prova +1 rep (regola "prima +1 rep, poi +carico")
*/
export function suggestNext(exercise, history) {
  const last = history.find(h => !h.deload) || history[0];
  if (!last) {
    return { type: 'start', text: 'Prima sessione: scegli un carico che lasci 2 rep in riserva.' };
  }
  const { min, max } = parseReps(exercise.reps);
  const valid = last.sets.filter(s => Number(s.kg) > 0 && Number(s.reps) > 0);
  if (valid.length === 0) return { type: 'start', text: 'Nessun dato valido nell’ultima sessione.' };

  const topKg = Math.max(...valid.map(s => Number(s.kg)));
  const allAtTop = valid.length >= exercise.sets && valid.every(s => Number(s.reps) >= max);
  const allAtLeastMin = valid.every(s => Number(s.reps) >= min);

  if (allAtTop) {
    const inc = incrementFor(exercise);
    return {
      type: 'load',
      kg: topKg + inc,
      reps: min,
      text: `Tutte le serie a ${max} rep: sali a ${fmtKg(topKg + inc)} kg e riparti da ${min} rep.`
    };
  }
  if (allAtLeastMin) {
    return {
      type: 'rep',
      kg: topKg,
      reps: Math.min(max, Math.max(...valid.map(s => Number(s.reps))) + 1),
      text: `Stesso carico (${fmtKg(topKg)} kg): prova ad aggiungere 1 rep per serie.`
    };
  }
  return {
    type: 'hold',
    kg: topKg,
    reps: min,
    text: `Consolida ${fmtKg(topKg)} kg finché tutte le serie arrivano a ${min} rep.`
  };
}

/*
  Plateau: nelle ultime N sessioni (N = plateau_weeks + 1, cioè 3) nessuna ha migliorato
  la precedente (vedi `improved`). Le sessioni di deload non contano.
*/
export function detectPlateau(history, plateauWeeks = PROGRAM.progression.plateauWeeks) {
  const clean = history.filter(h => !h.deload);
  const needed = plateauWeeks + 1;
  if (clean.length < needed) return { plateau: false, stalledSessions: 0 };
  const scores = clean.slice(0, needed).map(h => sessionScore(h.sets));
  let stalled = 0;
  for (let i = 0; i < scores.length - 1; i++) {
    if (!improved(scores[i], scores[i + 1])) stalled++;
    else break;
  }
  return { plateau: stalled >= plateauWeeks, stalledSessions: stalled };
}

/* Settimane dall'inizio del programma o dall'ultimo deload. */
export function deloadStatus({ programStart, deloads, now = new Date() }) {
  const currentWeek = weekKey(now);
  const inDeload = deloads.some(d => d.weekKey === currentWeek);
  const lastDeload = [...deloads].sort((a, b) => (a.weekKey < b.weekKey ? 1 : -1))[0];
  let sinceDate = programStart ? parseDateKey(programStart) : now;
  if (lastDeload) {
    const [y, w] = lastDeload.weekKey.split('-W').map(Number);
    const jan4 = new Date(y, 0, 4);
    const weekStart = new Date(jan4);
    weekStart.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (w - 1) * 7 + 7);
    sinceDate = weekStart;
  }
  const weeks = Math.max(0, Math.floor(daysBetween(sinceDate, now) / 7));
  return {
    inDeload,
    weeksSince: weeks,
    due: !inDeload && weeks >= 6,
    overdue: !inDeload && weeks >= 8,
    currentWeek
  };
}

/* Applica la regola di deload: -40% volume e carico. */
export function applyDeload(exercise, suggestion) {
  const sets = Math.max(1, Math.round(exercise.sets * 0.6));
  const kg = suggestion?.kg ? roundKg(suggestion.kg * 0.6) : null;
  return { sets, kg };
}

export function roundKg(kg) {
  return Math.round(kg / 0.5) * 0.5;
}

export function fmtKg(kg) {
  if (kg == null || Number.isNaN(kg)) return '–';
  return Number.isInteger(kg) ? String(kg) : kg.toFixed(1).replace('.0', '');
}

/* Volume totale (kg x rep) di una sessione. */
export function workoutVolume(workout) {
  let total = 0;
  for (const ex of Object.values(workout.exercises || {})) {
    for (const s of ex.sets || []) {
      total += (Number(s?.kg) || 0) * (Number(s?.reps) || 0);
    }
  }
  return total;
}
