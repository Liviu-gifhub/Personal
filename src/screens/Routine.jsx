import { useMemo, useState } from 'react';
import Icon, { KIND_COLOR, KIND_ICON } from '../components/ui/Icon.jsx';
import SpringCheck from '../components/reactbits/SpringCheck.jsx';
import { DAY_LABELS } from '../data/profile.js';
import { MEAL_PREP, isMedicineDay } from '../data/nutrition.js';
import { formatMinutes, getRoutineForDay } from '../data/routine.js';
import { getSessionForDay } from '../data/program.js';
import './Routine.css';

const BLOCK_CHECK = {
  wake: 'supplements',
  lunch: 'meal-lunch',
  skincare: 'skincare',
  study: 'study',
  business: 'business',
  'pre-workout': 'meal-pregym',
  gym: 'gym',
  'post-workout': 'meal-postgym',
  snack: 'meal-snack',
  dinner: 'meal-pregym',
  morning: 'study',
  relax: 'porridge'
};

const VIEWS = [
  { id: 'today', label: 'Oggi' },
  { id: 'weekday', label: 'Lun–Ven' },
  { id: 'sat', label: 'Sabato' },
  { id: 'sun', label: 'Domenica' }
];

export default function Routine({ state, actions, engine }) {
  const { today, dayKey, minutesNow } = engine;
  const [view, setView] = useState('today');
  const viewDay = view === 'today' ? dayKey : view === 'weekday' ? (['sat', 'sun'].includes(dayKey) ? 'mon' : dayKey) : view;
  const isToday = viewDay === dayKey;
  const routine = useMemo(() => getRoutineForDay(viewDay), [viewDay]);
  const checks = state.checks[today] || {};
  const session = getSessionForDay(viewDay);
  const medDay = isMedicineDay(viewDay);

  const prepDone = MEAL_PREP.steps.filter(s => checks[`prep-${s.id}`]).length;

  return (
    <div className="page routine">
      <header className="page-header">
        <span className="eyebrow">Routine</span>
        <h1>{isToday ? 'La tua giornata' : DAY_LABELS[viewDay]}</h1>
        <p className="muted">
          {session ? `Allenamento: ${session.name} alle 19:30.` : 'Rest day: niente palestra.'} {medDay ? 'Medicine: sì.' : 'Medicine: no.'}
        </p>
      </header>

      <div className="segmented routine__views" role="group" aria-label="Vista routine">
        {VIEWS.map(v => (
          <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
      </div>

      <ol className="timeline">
        {routine.map(block => {
          const isCurrent = isToday && minutesNow >= block.start && minutesNow < block.end;
          const isPast = isToday && minutesNow >= block.end;
          const checkId = BLOCK_CHECK[block.id];
          const checked = checkId ? Boolean(checks[checkId]) : false;
          const color = KIND_COLOR[block.kind] || 'var(--accent)';
          const isPrep = block.kind === 'mealprep';

          return (
            <li key={block.id} className={`timeline__item${isCurrent ? ' timeline__item--current' : ''}${isPast ? ' timeline__item--past' : ''}`} style={{ '--kind-color': color }}>
              <div className="timeline__time tabular">
                <span>{formatMinutes(block.start)}</span>
                <span className="timeline__end">{formatMinutes(block.end)}</span>
              </div>
              <div className="timeline__rail" aria-hidden="true">
                <span className="timeline__dot">
                  <Icon name={block.icon || KIND_ICON[block.kind] || 'clock'} size={14} />
                </span>
              </div>
              <div className={`timeline__card${isCurrent ? ' card--elevated' : ''}`}>
                <div className="timeline__head">
                  <div className="row-body">
                    <span className="timeline__title">{block.title}</span>
                    {block.detail ? <span className="row-subtitle">{block.detail}</span> : null}
                  </div>
                  {isCurrent ? <span className="chip chip--accent">Adesso</span> : null}
                </div>
                {isToday && checkId && block.checkable ? (
                  <div className="timeline__check">
                    <SpringCheck
                      label={checked ? 'Completato' : 'Segna come fatto'}
                      checked={checked}
                      onChange={v => actions.toggleCheck(today, checkId, v)}
                      color="var(--text-secondary)"
                      fillColor={color}
                      checkColor="#ffffff"
                      boxSize={22}
                      boxRadius={7}
                      fontSize={14}
                      strike="none"
                      doneOpacity={0.7}
                    />
                  </div>
                ) : null}
                {isToday && isPrep ? (
                  <div className="timeline__prep">
                    <div className="progress">
                      <span style={{ width: `${(prepDone / MEAL_PREP.steps.length) * 100}%` }} />
                    </div>
                    <span className="caption">
                      {prepDone}/{MEAL_PREP.steps.length} passaggi · spunta i dettagli in Nutrizione
                    </span>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
