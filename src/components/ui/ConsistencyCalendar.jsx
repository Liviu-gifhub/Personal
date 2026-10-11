import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import Sheet from './Sheet.jsx';
import { DAY_LABELS, DAY_SHORT } from '../../data/profile.js';
import { dayProgress } from '../../lib/checklist.js';
import { addDays, dateKey, parseDateKey, startOfDay } from '../../lib/time.js';
import './ConsistencyCalendar.css';

const WEEKDAYS = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];

function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = addDays(first, -startOffset);
  const cells = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
  return cells;
}

export default function ConsistencyCalendar({ state, now, streak }) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState(null);

  const todayKey = dateKey(now);
  const created = state.createdAt ? parseDateKey(state.createdAt) : null;

  const cells = useMemo(() => monthMatrix(cursor.getFullYear(), cursor.getMonth()), [cursor]);

  const selectedProgress = selected ? dayProgress(state, parseDateKey(selected)) : null;

  const openCalendar = () => {
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(null);
    setOpen(true);
  };

  return (
    <>
      <button type="button" className="card consistency-preview" onClick={openCalendar}>
        <div className="spread">
          <div className="row-body">
            <span className="row-title">Calendario costanza</span>
            <span className="row-subtitle">Apri per vedere tutte le tue giornate</span>
          </div>
          <span className="chip chip--accent">
            <Icon name="calendar" size={12} />
            {streak} {streak === 1 ? 'giorno' : 'giorni'}
          </span>
        </div>
        <div className="dots" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => {
            const d = dayProgress(state, addDays(now, i - 13));
            return <span key={d.key} className={`dot dot--${d.ratio >= 0.7 ? 'full' : d.ratio >= 0.3 ? 'half' : 'empty'}`} style={{ '--fill': d.ratio }} />;
          })}
        </div>
        <span className="consistency-preview__cta">
          Apri calendario <Icon name="chevronRight" size={14} />
        </span>
      </button>

      <Sheet open={open} title="Costanza" onClose={() => setOpen(false)}>
        <div className="cal">
          <div className="cal__nav">
            <button
              type="button"
              className="btn btn--icon"
              aria-label="Mese precedente"
              onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
            >
              <Icon name="chevronLeft" size={18} />
            </button>
            <span className="cal__month">
              {cursor.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              className="btn btn--icon"
              aria-label="Mese successivo"
              onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
            >
              <Icon name="chevronRight" size={18} />
            </button>
          </div>

          <div className="cal__weekdays">
            {WEEKDAYS.map(d => (
              <span key={d} className="cal__weekday">
                {d}
              </span>
            ))}
          </div>

          <div className="cal__grid">
            {cells.map(date => {
              const key = dateKey(date);
              const inMonth = date.getMonth() === cursor.getMonth();
              const future = startOfDay(date) > startOfDay(now);
              const beforeStart = created && startOfDay(date) < startOfDay(created);
              const p = !future && !beforeStart ? dayProgress(state, date) : null;
              const tone = !p ? 'muted' : p.ratio >= 0.7 ? 'full' : p.ratio >= 0.3 ? 'half' : 'empty';
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!p}
                  className={`cal__day cal__day--${tone}${key === todayKey ? ' cal__day--today' : ''}${selected === key ? ' cal__day--selected' : ''}${inMonth ? '' : ' cal__day--out'}`}
                  onClick={() => setSelected(key)}
                  aria-label={key}
                >
                  <span className="cal__num">{date.getDate()}</span>
                  {p ? <span className="cal__fill" style={{ '--fill': p.ratio }} /> : null}
                </button>
              );
            })}
          </div>

          <p className="footnote">Un giorno conta quando completi almeno il 70% della checklist (acqua inclusa).</p>

          {selectedProgress ? (
            <div className="cal__detail card">
              <div className="spread">
                <div className="row-body">
                  <span className="row-title">
                    {DAY_LABELS[selectedProgress.dayKey]} · {parseDateKey(selectedProgress.key).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
                  </span>
                  <span className="row-subtitle">
                    {selectedProgress.completed}/{selectedProgress.total} · {Math.round(selectedProgress.ratio * 100)}%
                    {selectedProgress.waterDone ? ' · acqua ok' : ` · acqua ${(selectedProgress.water / 1000).toFixed(1)} L`}
                  </span>
                </div>
                <span className={`chip ${selectedProgress.ratio >= 0.7 ? 'chip--success' : 'chip--warning'}`}>
                  {DAY_SHORT[selectedProgress.dayKey]}
                </span>
              </div>
              <div className="cal__checks">
                {selectedProgress.items.map(item => {
                  const done = Boolean(state.checks[selectedProgress.key]?.[item.id]);
                  return (
                    <span key={item.id} className={`cal__check${done ? ' cal__check--done' : ''}`}>
                      <Icon name={done ? 'check' : 'close'} size={12} />
                      {item.title}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="caption">Tocca un giorno per vedere il dettaglio.</p>
          )}
        </div>
      </Sheet>
    </>
  );
}
