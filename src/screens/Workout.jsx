import { useMemo, useState } from 'react';
import HoldButton from '../components/reactbits/HoldButton.jsx';
import SpecularButton from '../components/reactbits/SpecularButton.jsx';
import Icon from '../components/ui/Icon.jsx';
import { DAY_LABELS, DAY_SHORT } from '../data/profile.js';
import { PATTERNS, PROGRAM, SLOT_LABELS, WEEK, getSessionForDay, resolveExercise } from '../data/program.js';
import { applyDeload, deloadStatus, detectPlateau, exerciseHistory, fmtKg, sessionScore, suggestNext, workoutVolume } from '../lib/progression.js';
import { addDays, dateKey, formatDateShort, parseDateKey, startOfWeek } from '../lib/time.js';
import './Workout.css';

const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri'];

export default function Workout({ state, actions, now, engine }) {
  const { today, dayKey } = engine;
  const isRestToday = !WEEK_DAYS.includes(dayKey);
  const [selectedDay, setSelectedDay] = useState(isRestToday ? 'mon' : dayKey);

  const weekStart = startOfWeek(now);
  const dateFor = d => dateKey(addDays(weekStart, WEEK_DAYS.indexOf(d)));
  const logDate = dateFor(selectedDay);
  const editable = logDate === today;
  const session = getSessionForDay(selectedDay);
  const workout = state.workouts[logDate];
  const completed = Boolean(workout?.completedAt);

  const deload = deloadStatus({ programStart: state.programStart, deloads: state.deloads, now });

  const exercises = useMemo(() => {
    if (!session) return [];
    return session.exercises.map(ex => {
      const resolved = resolveExercise(ex, state.activeVariations);
      const history = exerciseHistory(state.workouts, resolved.id, { excludeDate: logDate });
      const suggestion = suggestNext(resolved, history);
      const plateau = resolved.isPattern ? detectPlateau(history) : { plateau: false, stalledSessions: 0 };
      const deloadPlan = deload.inDeload ? applyDeload(resolved, suggestion) : null;
      return { resolved, history, suggestion, plateau, deloadPlan };
    });
  }, [session, state.activeVariations, state.workouts, logDate, deload.inDeload]);

  const loggedSets = useMemo(() => {
    if (!workout) return 0;
    return Object.values(workout.exercises || {}).reduce((n, ex) => n + (ex.sets || []).filter(s => s && Number(s.kg) > 0 && Number(s.reps) > 0).length, 0);
  }, [workout]);

  const history = useMemo(
    () =>
      Object.entries(state.workouts)
        .filter(([, w]) => w.completedAt)
        .sort((a, b) => (a[0] < b[0] ? 1 : -1))
        .slice(0, 6),
    [state.workouts]
  );

  const complete = () => {
    actions.completeWorkout(today, session);
    if (deload.inDeload) actions.setWorkoutMeta(today, session, { deload: true });
  };

  return (
    <div className="page workout">
      <header className="page-header">
        <span className="eyebrow">{PROGRAM.name}</span>
        <h1>{isRestToday ? 'Rest day' : `${session?.name ?? ''} · ${DAY_LABELS[dayKey]}`}</h1>
        <p className="muted">
          {isRestToday ? 'Sabato e domenica si recupera. Qui sotto la settimana.' : `Sessione ${PROGRAM.sessionMinutes} min · ore 19:30.`}
        </p>
      </header>

      {deload.inDeload ? (
        <div className="card deload deload--active">
          <div className="spread">
            <div className="row-body">
              <span className="row-title">Settimana di deload</span>
              <span className="row-subtitle">Volume e carico −40%. I suggerimenti qui sotto sono già ridotti.</span>
            </div>
            <button type="button" className="btn btn--sm" onClick={() => actions.cancelDeload(deload.currentWeek)}>
              Termina
            </button>
          </div>
        </div>
      ) : deload.due ? (
        <div className="card deload deload--due">
          <div className="spread">
            <div className="row-body">
              <span className="row-title">
                <Icon name="warning" size={16} /> Deload consigliato
              </span>
              <span className="row-subtitle">
                {deload.weeksSince} settimane di lavoro. Regola: ogni {PROGRAM.progression.deloadEveryWeeks} settimane, {PROGRAM.progression.deloadRule}.
              </span>
            </div>
            <button type="button" className="btn btn--sm btn--tinted" onClick={() => actions.startDeload(deload.currentWeek)}>
              Avvia
            </button>
          </div>
        </div>
      ) : null}

      <div className="week-picker" role="tablist" aria-label="Giorni di allenamento">
        {WEEK.map(d => {
          const date = dateFor(d.day);
          const w = state.workouts[date];
          const isSel = d.day === selectedDay;
          return (
            <button
              key={d.day}
              type="button"
              role="tab"
              aria-selected={isSel}
              className={`week-picker__day${isSel ? ' week-picker__day--selected' : ''}${w?.completedAt ? ' week-picker__day--done' : ''}${d.day === dayKey ? ' week-picker__day--today' : ''}`}
              onClick={() => setSelectedDay(d.day)}
            >
              <span className="week-picker__short">{DAY_SHORT[d.day]}</span>
              <span className="week-picker__name">{d.name}</span>
              {w?.completedAt ? <Icon name="check" size={12} /> : null}
            </button>
          );
        })}
      </div>

      {session ? (
        <section className="section">
          <div className="section-header">
            <h2>
              {session.name} · {formatDateShort(parseDateKey(logDate))}
            </h2>
            <span className="meta">{completed ? 'Completato' : editable ? 'Oggi' : logDate < today ? 'Passato' : 'In programma'}</span>
          </div>

          {exercises.map(({ resolved, history: exHistory, suggestion, plateau, deloadPlan }) => (
            <ExerciseCard
              key={resolved.id}
              exercise={resolved}
              history={exHistory}
              suggestion={suggestion}
              plateau={plateau}
              deloadPlan={deloadPlan}
              sets={workout?.exercises?.[resolved.id]?.sets || []}
              editable={editable && !completed}
              onLog={(idx, entry) => actions.logSet(today, session, resolved.id, idx, entry)}
              onSwitchVariation={reason => actions.switchVariation(resolved.pattern, reason)}
              onSetVariation={i => actions.setVariation(resolved.pattern, i)}
            />
          ))}

          {editable ? (
            <div className="workout__actions">
              {completed ? (
                <>
                  <div className="card card--elevated workout__done">
                    <Icon name="checkCircle" size={22} />
                    <div className="row-body">
                      <span className="row-title">Allenamento completato</span>
                      <span className="row-subtitle">
                        {new Date(workout.completedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} · volume {Math.round(workoutVolume(workout))} kg
                      </span>
                    </div>
                  </div>
                  <HoldButton
                    size="md"
                    radius={14}
                    backgroundColor="var(--surface-elevated)"
                    fillColor="#f43f5e"
                    textColor="var(--text-primary)"
                    holdTime={1800}
                    doneLabel="Eliminato"
                    icon={<Icon name="trash" size={16} />}
                    onHold={() => {
                      actions.deleteWorkout(today);
                      actions.toggleCheck(today, 'gym', false);
                    }}
                  >
                    Tieni premuto per eliminare il log
                  </HoldButton>
                </>
              ) : (
                <SpecularButton
                  size="md"
                  radius={16}
                  baseColor="#4a4a4f"
                  lineColor="#ffffff"
                  textColor="#ffffff"
                  tint="#0a84ff"
                  tintOpacity={0.9}
                  autoAnimate
                  speed={0.5}
                  disabled={loggedSets === 0}
                  onClick={complete}
                  className="workout__complete"
                >
                  <Icon name="check" size={18} />
                  Completa allenamento
                  {loggedSets > 0 ? <span className="workout__complete-meta">{loggedSets} serie</span> : null}
                </SpecularButton>
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="section">
        <div className="section-header">
          <h2>Varianti attive</h2>
          <span className="meta">Plateau {PROGRAM.progression.plateauWeeks} sett. → variante +1</span>
        </div>
        <div className="list">
          {Object.entries(PATTERNS).map(([key, p]) => {
            const active = state.activeVariations[key] ?? 0;
            return (
              <div key={key} className="row">
                <div className="row-body">
                  <span className="row-title">{p.label}</span>
                  <span className="row-subtitle">
                    {p.variations[active]} · secondaria: {p.variations[(active + 1) % 3]}
                  </span>
                </div>
                <div className="segmented segmented--dots" aria-label={`Variante ${p.label}`}>
                  {p.variations.map((v, i) => (
                    <button key={v} type="button" aria-pressed={i === active} aria-label={v} title={v} onClick={() => actions.setVariation(key, i)}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Storico</h2>
          <span className="meta">{Object.values(state.workouts).filter(w => w.completedAt).length} sessioni</span>
        </div>
        <div className="list">
          {history.length === 0 ? (
            <div className="empty">
              <strong>Nessuna sessione ancora</strong>
              <span>Registra le serie di oggi e completa l'allenamento.</span>
            </div>
          ) : (
            history.map(([date, w]) => (
              <div key={date} className="row">
                <div className="row-body">
                  <span className="row-title">{w.name}</span>
                  <span className="row-subtitle">
                    {formatDateShort(parseDateKey(date))} · {Object.keys(w.exercises || {}).length} esercizi{w.deload ? ' · deload' : ''}
                  </span>
                </div>
                <span className="row-trailing tabular">{Math.round(workoutVolume(w))} kg</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function ExerciseCard({ exercise, history, suggestion, plateau, deloadPlan, sets, editable, onLog, onSwitchVariation, onSetVariation }) {
  const [open, setOpen] = useState(false);
  const plannedSets = deloadPlan ? deloadPlan.sets : exercise.sets;
  const last = history[0];
  const lastScore = last ? sessionScore(last.sets) : null;
  const targetKg = deloadPlan?.kg ?? suggestion.kg;
  const pattern = exercise.isPattern ? PATTERNS[exercise.pattern] : null;
  const nextVariation = pattern ? pattern.variations[(exercise.variationIndex + 1) % pattern.variations.length] : null;

  return (
    <article className={`exercise card${plateau.plateau ? ' exercise--plateau' : ''}`}>
      <div className="exercise__head">
        <div className="row-body">
          <div className="inline">
            <span className={`chip chip--${exercise.slot === 'main' ? 'accent' : exercise.slot === 'secondary' ? 'warning' : ''}`}>{SLOT_LABELS[exercise.slot]}</span>
            {exercise.isPattern ? <span className="caption">{exercise.patternLabel}</span> : null}
          </div>
          <h3 className="exercise__name">{exercise.displayName}</h3>
          <span className="row-subtitle tabular">
            {plannedSets} × {exercise.reps} rep
            {deloadPlan ? ` (deload, era ${exercise.sets})` : ''}
            {lastScore?.topKg ? ` · ultima: ${fmtKg(lastScore.topKg)} kg` : ''}
          </span>
        </div>
        {exercise.isPattern ? (
          <button type="button" className="btn btn--icon exercise__more" aria-label="Opzioni variante" aria-expanded={open} onClick={() => setOpen(o => !o)}>
            <Icon name="layers" size={18} />
          </button>
        ) : null}
      </div>

      <p className={`exercise__hint exercise__hint--${suggestion.type}`}>
        <Icon name={suggestion.type === 'load' ? 'trending' : suggestion.type === 'rep' ? 'plus' : 'target'} size={14} />
        {deloadPlan && targetKg ? `Deload: ${plannedSets} serie a circa ${fmtKg(targetKg)} kg.` : suggestion.text}
      </p>

      {plateau.plateau ? (
        <div className="exercise__plateau">
          <div className="row-body">
            <span className="row-title">
              <Icon name="warning" size={14} /> Plateau da {plateau.stalledSessions} sessioni
            </span>
            <span className="row-subtitle">{PROGRAM.progression.onPlateau}</span>
          </div>
          <button type="button" className="btn btn--sm btn--tinted" onClick={() => onSwitchVariation('plateau')}>
            Passa a {nextVariation}
          </button>
        </div>
      ) : null}

      {open && pattern ? (
        <div className="exercise__variants">
          {pattern.variations.map((v, i) => (
            <button
              key={v}
              type="button"
              className={`btn btn--sm${i === exercise.variationIndex ? ' btn--tinted' : ''}`}
              onClick={() => onSetVariation((i - (exercise.variation_offset || 0) + pattern.variations.length) % pattern.variations.length)}
            >
              {v}
            </button>
          ))}
        </div>
      ) : null}

      <div className="sets">
        <div className="sets__header">
          <span>Serie</span>
          <span>kg</span>
          <span>rep</span>
          <span />
        </div>
        {Array.from({ length: plannedSets }, (_, i) => {
          const s = sets[i] || {};
          const done = Number(s.kg) > 0 && Number(s.reps) > 0;
          return (
            <div key={i} className={`sets__row${done ? ' sets__row--done' : ''}`}>
              <span className="sets__index tabular">{i + 1}</span>
              <input
                className="input sets__input"
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                placeholder={targetKg ? fmtKg(targetKg) : '–'}
                value={s.kg ?? ''}
                disabled={!editable}
                aria-label={`Serie ${i + 1} carico in kg`}
                onChange={e => onLog(i, { kg: e.target.value === '' ? null : Number(e.target.value) })}
              />
              <input
                className="input sets__input"
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                placeholder={String(suggestion.reps ?? exercise.reps)}
                value={s.reps ?? ''}
                disabled={!editable}
                aria-label={`Serie ${i + 1} ripetizioni`}
                onChange={e => onLog(i, { reps: e.target.value === '' ? null : Number(e.target.value) })}
              />
              <span className={`sets__status${done ? ' sets__status--done' : ''}`} aria-hidden="true">
                <Icon name="check" size={14} />
              </span>
            </div>
          );
        })}
      </div>

      {last ? (
        <details className="exercise__history">
          <summary className="caption">Ultima sessione · {formatDateShort(parseDateKey(last.date))}</summary>
          <div className="exercise__last tabular">
            {last.sets.map((s, i) => (
              <span key={i} className="chip">
                {fmtKg(Number(s.kg))} × {s.reps}
              </span>
            ))}
            {lastScore?.e1rm ? <span className="caption">e1RM ≈ {fmtKg(Math.round(lastScore.e1rm))} kg</span> : null}
          </div>
        </details>
      ) : null}
    </article>
  );
}
