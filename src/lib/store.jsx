import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { dateKey } from './time.js';
import { PROFILE } from '../data/profile.js';

export const STORAGE_KEY = 'liviu-app:v1';

export const INITIAL_STATE = {
  version: 1,
  createdAt: null,
  /* checks[dateKey][itemId] = true */
  checks: {},
  /* water[dateKey] = ml */
  water: {},
  /* weights: [{ date: 'YYYY-MM-DD', kg: 72 }] */
  weights: [],
  /* workouts[dateKey] = { day, name, exercises: { [exerciseId]: { sets: [{ kg, reps }] } }, completedAt, deload } */
  workouts: {},
  /* activeVariations[pattern] = indice */
  activeVariations: {},
  /* storico cambi variante: [{ date, pattern, from, to, reason }] */
  variationLog: [],
  /* deloads: [{ weekKey }] */
  deloads: [],
  programStart: null,
  /* firedReminders[dateKey] = [reminderId] */
  firedReminders: {},
  dismissedReminders: {},
  settings: {
    notifications: false,
    theme: 'auto',
    openCount: 0
  }
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STATE, ...parsed, settings: { ...INITIAL_STATE.settings, ...(parsed.settings || {}) } };
  } catch {
    return null;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    const loaded = load();
    const today = dateKey();
    if (!loaded) {
      return {
        ...INITIAL_STATE,
        createdAt: today,
        programStart: today,
        weights: [{ date: today, kg: PROFILE.startWeightKg }]
      };
    }
    return { ...loaded, programStart: loaded.programStart || loaded.createdAt || today };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage pieno o non disponibile */
    }
  }, [state]);

  const update = useCallback(fn => setState(prev => fn(prev)), []);

  const actions = useMemo(
    () => ({
      toggleCheck(day, itemId, value) {
        update(prev => {
          const dayChecks = { ...(prev.checks[day] || {}) };
          const next = value ?? !dayChecks[itemId];
          if (next) dayChecks[itemId] = true;
          else delete dayChecks[itemId];
          return { ...prev, checks: { ...prev.checks, [day]: dayChecks } };
        });
      },
      setWater(day, ml) {
        update(prev => ({ ...prev, water: { ...prev.water, [day]: Math.max(0, ml) } }));
      },
      addWater(day, deltaMl) {
        update(prev => {
          const current = prev.water[day] || 0;
          return { ...prev, water: { ...prev.water, [day]: Math.max(0, current + deltaMl) } };
        });
      },
      addWeight(date, kg) {
        update(prev => {
          const others = prev.weights.filter(w => w.date !== date);
          const weights = [...others, { date, kg }].sort((a, b) => (a.date < b.date ? -1 : 1));
          return { ...prev, weights };
        });
      },
      removeWeight(date) {
        update(prev => ({ ...prev, weights: prev.weights.filter(w => w.date !== date) }));
      },
      logSet(day, session, exerciseId, setIndex, entry) {
        update(prev => {
          const workout = prev.workouts[day] || { day: session.day, name: session.name, exercises: {} };
          const ex = workout.exercises[exerciseId] || { sets: [] };
          const sets = [...ex.sets];
          sets[setIndex] = { ...(sets[setIndex] || {}), ...entry };
          return {
            ...prev,
            workouts: {
              ...prev.workouts,
              [day]: { ...workout, exercises: { ...workout.exercises, [exerciseId]: { ...ex, sets } } }
            }
          };
        });
      },
      setWorkoutMeta(day, session, meta) {
        update(prev => {
          const workout = prev.workouts[day] || { day: session.day, name: session.name, exercises: {} };
          return { ...prev, workouts: { ...prev.workouts, [day]: { ...workout, ...meta } } };
        });
      },
      completeWorkout(day, session) {
        update(prev => {
          const workout = prev.workouts[day] || { day: session.day, name: session.name, exercises: {} };
          const checks = { ...(prev.checks[day] || {}), gym: true };
          return {
            ...prev,
            workouts: { ...prev.workouts, [day]: { ...workout, completedAt: new Date().toISOString() } },
            checks: { ...prev.checks, [day]: checks }
          };
        });
      },
      deleteWorkout(day) {
        update(prev => {
          const workouts = { ...prev.workouts };
          delete workouts[day];
          return { ...prev, workouts };
        });
      },
      switchVariation(pattern, reason = 'manual') {
        update(prev => {
          const from = prev.activeVariations[pattern] ?? 0;
          const to = (from + 1) % 3;
          return {
            ...prev,
            activeVariations: { ...prev.activeVariations, [pattern]: to },
            variationLog: [...prev.variationLog, { date: dateKey(), pattern, from, to, reason }]
          };
        });
      },
      setVariation(pattern, index) {
        update(prev => ({ ...prev, activeVariations: { ...prev.activeVariations, [pattern]: index } }));
      },
      startDeload(week) {
        update(prev => (prev.deloads.some(d => d.weekKey === week) ? prev : { ...prev, deloads: [...prev.deloads, { weekKey: week }] }));
      },
      cancelDeload(week) {
        update(prev => ({ ...prev, deloads: prev.deloads.filter(d => d.weekKey !== week) }));
      },
      markReminderFired(day, id) {
        update(prev => {
          const list = prev.firedReminders[day] || [];
          if (list.includes(id)) return prev;
          return { ...prev, firedReminders: { ...prev.firedReminders, [day]: [...list, id] } };
        });
      },
      dismissReminder(day, id) {
        update(prev => {
          const list = prev.dismissedReminders[day] || [];
          if (list.includes(id)) return prev;
          return { ...prev, dismissedReminders: { ...prev.dismissedReminders, [day]: [...list, id] } };
        });
      },
      setProgramStart(date) {
        update(prev => ({ ...prev, programStart: date, deloads: [] }));
      },
      setSetting(key, value) {
        update(prev => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
      },
      bumpOpenCount() {
        update(prev => ({ ...prev, settings: { ...prev.settings, openCount: (prev.settings.openCount || 0) + 1 } }));
      },
      importState(next) {
        if (!next || typeof next !== 'object') return;
        update(() => ({ ...INITIAL_STATE, ...next, settings: { ...INITIAL_STATE.settings, ...(next.settings || {}) } }));
      },
      resetAll() {
        const today = dateKey();
        update(() => ({
          ...INITIAL_STATE,
          createdAt: today,
          programStart: today,
          weights: [{ date: today, kg: PROFILE.startWeightKg }]
        }));
      }
    }),
    [update]
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore deve essere usato dentro StoreProvider');
  return ctx;
}
