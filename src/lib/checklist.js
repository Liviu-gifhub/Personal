import { MEALS, MEAL_PREP, isMedicineDay } from '../data/nutrition.js';
import { PROFILE } from '../data/profile.js';
import { getSessionForDay } from '../data/program.js';
import { dateKey, dayKeyOf, parseDateKey, addDays } from './time.js';

const t = (h, m = 0) => h * 60 + m;

/*
  Checklist del giorno: gli id coincidono con quelli usati da promemoria e routine
  così un'unica spunta aggiorna tutta l'app.
*/
export function buildChecklist(dayKey) {
  const isWeekend = dayKey === 'sat' || dayKey === 'sun';
  const session = getSessionForDay(dayKey);
  const items = [];

  items.push({ id: 'supplements', minutes: t(6, 30), title: 'Integratori del mattino', group: 'Mattina', kind: 'supplements' });
  if (isMedicineDay(dayKey)) items.push({ id: 'medicine', minutes: t(6, 30), title: 'Medicine', group: 'Mattina', kind: 'medicine' });

  for (const meal of MEALS) {
    const title = isWeekend && meal.id === 'pregym' ? 'Cena' : meal.title;
    items.push({ id: `meal-${meal.id}`, minutes: meal.minutes, title, subtitle: `${meal.time} · ~${meal.kcal} kcal`, group: 'Pasti', kind: 'meal' });
  }

  if (!isWeekend) {
    items.push({ id: 'skincare', minutes: t(15), title: 'Skincare', group: 'Pomeriggio', kind: 'selfcare' });
    items.push({ id: 'study', minutes: t(15, 30), title: 'Studio scuola (2h)', group: 'Pomeriggio', kind: 'study' });
    items.push({ id: 'business', minutes: t(18), title: 'Business personale (1h)', group: 'Pomeriggio', kind: 'business' });
    if (session) items.push({ id: 'gym', minutes: t(19, 30), title: `Palestra · ${session.name}`, group: 'Sera', kind: 'gym' });
  } else {
    items.push({ id: 'skincare', minutes: t(15), title: 'Skincare', group: 'Giornata', kind: 'selfcare' });
    items.push({ id: 'study', minutes: t(7, 30), title: 'Studio / lettura', group: 'Giornata', kind: 'study' });
    items.push({ id: 'business', minutes: t(11), title: 'Business personale', group: 'Giornata', kind: 'business' });
    if (dayKey === 'sun') {
      for (const step of MEAL_PREP.steps) {
        items.push({ id: `prep-${step.id}`, minutes: t(16), title: step.text, group: 'Meal prep', kind: 'prep' });
      }
    }
    if (dayKey === 'sat') items.push({ id: 'prep-shopping', minutes: t(18), title: 'Spesa per il meal prep di domani', group: 'Giornata', kind: 'prep' });
  }

  items.push({ id: 'magnesium', minutes: t(21, 30), title: 'Magnesio bisglicinato', group: 'Sera', kind: 'supplements' });
  items.push({ id: 'porridge', minutes: t(22), title: 'Porridge per domani in frigo', group: 'Sera', kind: 'prep' });

  return items;
}

export function dayProgress(state, date) {
  const key = dateKey(date);
  const dayKey = dayKeyOf(date);
  const items = buildChecklist(dayKey);
  const checks = state.checks[key] || {};
  const done = items.filter(i => checks[i.id]).length;
  const water = state.water[key] || 0;
  const waterDone = water >= PROFILE.waterTargetMl;
  const total = items.length + 1;
  const completed = done + (waterDone ? 1 : 0);
  return { key, dayKey, items, done, total, completed, ratio: total ? completed / total : 0, water, waterDone };
}

/* Streak: giorni consecutivi (fino a ieri, o oggi se già sopra soglia) con almeno il 70% completato. */
export function computeStreak(state, now = new Date(), threshold = 0.7) {
  let streak = 0;
  let cursor = new Date(now);
  const today = dayProgress(state, cursor);
  if (today.ratio >= threshold) streak++;
  cursor = addDays(cursor, -1);
  const created = state.createdAt ? parseDateKey(state.createdAt) : null;
  for (let i = 0; i < 400; i++) {
    if (created && cursor < created) break;
    const p = dayProgress(state, cursor);
    if (p.ratio >= threshold) streak++;
    else break;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function lastNDays(state, n, now = new Date()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(dayProgress(state, addDays(now, -i)));
  }
  return out;
}
