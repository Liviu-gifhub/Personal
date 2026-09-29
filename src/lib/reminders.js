import { useEffect, useMemo, useRef } from 'react';
import { MEALS, MEAL_PREP, SUPPLEMENTS, isMedicineDay } from '../data/nutrition.js';
import { PROFILE } from '../data/profile.js';
import { getSessionForDay } from '../data/program.js';
import { dateKey, dayKeyOf, minutesOfDay, weekKey } from './time.js';

const t = (h, m = 0) => h * 60 + m;

/*
  Costruisce i promemoria della giornata. Alcuni sono condizionali allo stato
  (es. acqua sotto target, peso non registrato questa settimana).
*/
export function buildReminders({ dayKey, state, today }) {
  const isWeekend = dayKey === 'sat' || dayKey === 'sun';
  const medDay = isMedicineDay(dayKey);
  const session = getSessionForDay(dayKey);
  const checks = state.checks[today] || {};
  const water = state.water[today] || 0;
  const thisWeek = weekKey(new Date());
  const weighedThisWeek = state.weights.some(w => weekKey(new Date(w.date)) === thisWeek && w.date !== state.createdAt);

  const list = [];

  list.push({
    id: 'supplements',
    minutes: t(6, 30),
    kind: 'supplements',
    title: 'Integratori del mattino',
    body: `${SUPPLEMENTS.morning.map(s => s.name).join(', ')}.${medDay ? ' Oggi anche le medicine.' : ' Oggi niente medicine.'}`,
    doneWhen: () => checks.supplements
  });

  if (medDay) {
    list.push({
      id: 'medicine',
      minutes: t(6, 35),
      kind: 'medicine',
      title: 'Medicine',
      body: 'Oggi è un giorno sì. Prendile con la colazione.',
      doneWhen: () => checks.medicine
    });
  }

  if (dayKey === 'mon' && !weighedThisWeek) {
    list.push({
      id: 'weigh-in',
      minutes: t(6, 40),
      kind: 'weight',
      title: 'Peso settimanale',
      body: 'Pesati a digiuno e segna il valore in Progressi.',
      doneWhen: () => weighedThisWeek
    });
  }

  for (const meal of MEALS) {
    if (isWeekend && meal.id === 'pregym') {
      list.push({ id: `meal-${meal.id}`, minutes: meal.minutes, kind: 'meal', title: `Cena (~${meal.kcal} kcal)`, body: meal.items.join(' · '), doneWhen: () => checks[`meal-${meal.id}`] });
      continue;
    }
    list.push({
      id: `meal-${meal.id}`,
      minutes: meal.minutes,
      kind: 'meal',
      title: `${meal.title} (~${meal.kcal} kcal)`,
      body: meal.items.join(' · '),
      doneWhen: () => checks[`meal-${meal.id}`]
    });
  }

  if (!isWeekend) {
    list.push({ id: 'snack-bag', minutes: t(6, 50), kind: 'meal', title: 'Spuntino in borsa', body: 'Pane integrale, tacchino e un frutto per la scuola.', doneWhen: () => checks['meal-snack'] });
  }

  const waterSlots = [t(9), t(11, 30), t(14), t(16, 30), t(18, 30), t(20, 45)];
  waterSlots.forEach((min, i) => {
    const expected = Math.round((PROFILE.waterTargetMl * (i + 1)) / (waterSlots.length + 1));
    list.push({
      id: `water-${i}`,
      minutes: min,
      kind: 'water',
      title: 'Acqua',
      body: `Sei a ${(water / 1000).toFixed(2)} L su ${PROFILE.waterTargetMl / 1000} L. Un bicchiere adesso.`,
      doneWhen: () => water >= expected,
      quiet: true
    });
  });

  if (!isWeekend) {
    list.push({ id: 'skincare', minutes: t(15), kind: 'selfcare', title: 'Skincare', body: 'Cinque minuti per te prima dello studio.', doneWhen: () => checks.skincare });
    list.push({ id: 'study', minutes: t(15, 30), kind: 'study', title: 'Studio scuola', body: 'Due ore. Telefono lontano.', doneWhen: () => checks.study });
    list.push({ id: 'business', minutes: t(18), kind: 'business', title: 'Business personale', body: "Un'ora per costruire qualcosa di tuo.", doneWhen: () => checks.business });
    if (session) {
      list.push({
        id: 'gym',
        minutes: t(19, 30),
        kind: 'gym',
        title: `Palestra: ${session.name}`,
        body: `${session.exercises.length} esercizi. Sessione 60-90 min.`,
        doneWhen: () => checks.gym
      });
    }
  }

  list.push({ id: 'magnesium', minutes: t(21, 30), kind: 'supplements', title: 'Magnesio bisglicinato', body: 'Con lo shake post-gym.', doneWhen: () => checks.magnesium });
  list.push({ id: 'porridge', minutes: t(22), kind: 'prep', title: 'Porridge per domani', body: 'Avena, latte e banana in frigo. Domattina aggiungi la whey.', doneWhen: () => checks.porridge });
  list.push({ id: 'sleep', minutes: t(22, 20), kind: 'sleep', title: 'Tra 10 minuti si dorme', body: 'Spegni tutto. Sveglia alle 06:30.', quiet: true });

  if (dayKey === 'sat') {
    list.push({ id: 'prep-shopping', minutes: t(18), kind: 'prep', title: 'Domani meal prep', body: 'Controlla di avere 1 kg di pollo, riso, pasta e verdure.', doneWhen: () => checks['prep-shopping'] });
  }
  if (dayKey === 'sun') {
    const prepDone = MEAL_PREP.steps.every(s => checks[`prep-${s.id}`]);
    list.push({ id: 'mealprep-morning', minutes: t(10), kind: 'prep', title: 'Oggi meal prep', body: 'Pianifica il pomeriggio: cottura, porzioni, congelatore.', doneWhen: () => prepDone });
    list.push({ id: 'mealprep-start', minutes: t(16), kind: 'prep', title: 'Meal prep: si parte', body: MEAL_PREP.steps[0].text, doneWhen: () => prepDone });
  }

  return list.sort((a, b) => a.minutes - b.minutes);
}

/* Promemoria "attivi": passati da poco (<= windowMin), non completati, non chiusi. */
export function activeReminders(list, { minutesNow, fired = [], dismissed = [], windowMin = 90 }) {
  return list.filter(r => {
    if (r.minutes > minutesNow || minutesNow - r.minutes > windowMin) return false;
    if (dismissed.includes(r.id)) return false;
    if (r.doneWhen && r.doneWhen()) return false;
    return true;
  });
}

export function upcomingReminders(list, { minutesNow, limit = 3 }) {
  return list.filter(r => r.minutes > minutesNow && !(r.doneWhen && r.doneWhen())).slice(0, limit);
}

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

function showNotification(reminder) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(reminder.title, {
      body: reminder.body,
      tag: reminder.id,
      icon: '/icon-192.png',
      silent: Boolean(reminder.quiet)
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    /* alcune piattaforme richiedono un service worker */
  }
}

/*
  Motore promemoria: ogni 30s controlla se un promemoria è scaduto negli ultimi 15 minuti,
  non è ancora stato notificato oggi e non è già completato. Notifica via Notification API se attive.
*/
export function useReminderEngine({ state, actions, now }) {
  const today = dateKey(now);
  const dayKey = dayKeyOf(now);
  const minutesNow = minutesOfDay(now);

  const reminders = useMemo(() => buildReminders({ dayKey, state, today }), [dayKey, state, today]);

  const lastCheck = useRef(0);
  useEffect(() => {
    const stamp = `${today}:${minutesNow}`;
    if (lastCheck.current === stamp) return;
    lastCheck.current = stamp;

    const fired = state.firedReminders[today] || [];
    for (const r of reminders) {
      if (r.minutes > minutesNow || minutesNow - r.minutes > 15) continue;
      if (fired.includes(r.id)) continue;
      if (r.doneWhen && r.doneWhen()) continue;
      actions.markReminderFired(today, r.id);
      if (state.settings.notifications) showNotification(r);
    }
  }, [reminders, minutesNow, today, state.firedReminders, state.settings.notifications, actions]);

  const active = useMemo(
    () =>
      activeReminders(reminders, {
        minutesNow,
        fired: state.firedReminders[today] || [],
        dismissed: state.dismissedReminders[today] || []
      }),
    [reminders, minutesNow, state.firedReminders, state.dismissedReminders, today]
  );

  const upcoming = useMemo(() => upcomingReminders(reminders, { minutesNow, limit: 3 }), [reminders, minutesNow]);

  return { reminders, active, upcoming, today, dayKey, minutesNow };
}
