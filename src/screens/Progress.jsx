import { useMemo, useState } from 'react';
import HoldButton from '../components/reactbits/HoldButton.jsx';
import SpecularButton from '../components/reactbits/SpecularButton.jsx';
import Icon from '../components/ui/Icon.jsx';
import Sheet from '../components/ui/Sheet.jsx';
import WeightChart from '../components/ui/WeightChart.jsx';
import { PROFILE, DAY_SHORT } from '../data/profile.js';
import { PATTERNS } from '../data/program.js';
import { computeStreak, lastNDays } from '../lib/checklist.js';
import { fmtKg, sessionScore } from '../lib/progression.js';
import { dateKey, formatDateShort, parseDateKey, weekKey } from '../lib/time.js';
import './Progress.css';

export default function Progress({ state, actions, now }) {
  const [sheet, setSheet] = useState(null); // null | 'add' | { edit: entry }
  const [kgInput, setKgInput] = useState('');
  const [dateInput, setDateInput] = useState(dateKey(now));

  const weights = useMemo(() => [...state.weights].sort((a, b) => (a.date < b.date ? -1 : 1)), [state.weights]);
  const first = weights[0];
  const last = weights[weights.length - 1];
  const prev = weights.length > 1 ? weights[weights.length - 2] : null;
  const deltaStart = last && first ? last.kg - first.kg : 0;
  const deltaPrev = last && prev ? last.kg - prev.kg : 0;
  const thisWeek = weekKey(now);
  const weighedThisWeek = weights.some(w => weekKey(parseDateKey(w.date)) === thisWeek && w.date !== state.createdAt);

  const streak = computeStreak(state, now);
  const days = lastNDays(state, 14, now);

  const completedWorkouts = Object.entries(state.workouts).filter(([, w]) => w.completedAt);
  const workoutsThisWeek = completedWorkouts.filter(([d]) => weekKey(parseDateKey(d)) === thisWeek).length;

  const bestByPattern = useMemo(() => {
    const out = [];
    for (const [key, p] of Object.entries(PATTERNS)) {
      let best = null;
      for (const [date, w] of Object.entries(state.workouts)) {
        for (const [exId, ex] of Object.entries(w.exercises || {})) {
          if (!exId.startsWith(`${key}:`)) continue;
          const score = sessionScore(ex.sets || []);
          if (score.e1rm > 0 && (!best || score.e1rm > best.e1rm)) {
            best = { ...score, date, variation: p.variations[Number(exId.split(':')[1])] };
          }
        }
      }
      out.push({ key, label: p.label, best });
    }
    return out;
  }, [state.workouts]);

  const openAdd = () => {
    setKgInput(last ? String(last.kg) : String(PROFILE.startWeightKg));
    setDateInput(dateKey(now));
    setSheet('add');
  };

  const save = () => {
    const kg = Number(String(kgInput).replace(',', '.'));
    if (!kg || kg < 30 || kg > 200) return;
    actions.addWeight(dateInput, Math.round(kg * 10) / 10);
    setSheet(null);
  };

  return (
    <div className="page progress">
      <header className="page-header">
        <span className="eyebrow">Progressi</span>
        <h1>Peso e costanza</h1>
        <p className="muted">
          {PROFILE.name}, {PROFILE.age} anni · {PROFILE.heightCm} cm · partenza {PROFILE.startWeightKg} kg
        </p>
      </header>

      <section className="section">
        <div className="card card--accent weight-card">
          <div className="spread">
            <div className="stack" style={{ gap: 0 }}>
              <span className="stat-value">
                {last ? fmtKg(last.kg) : '–'}
                <span className="stat-unit"> kg</span>
              </span>
              <span className="stat-label">{last ? `Ultima pesata · ${formatDateShort(parseDateKey(last.date))}` : 'Nessuna pesata'}</span>
            </div>
            <div className="weight-card__deltas">
              <Delta label="dall'inizio" value={deltaStart} />
              {prev ? <Delta label="vs precedente" value={deltaPrev} /> : null}
            </div>
          </div>
          <WeightChart weights={weights} height={180} />
          <div className="spread">
            <span className={`chip ${weighedThisWeek ? 'chip--success' : 'chip--warning'}`}>
              <Icon name={weighedThisWeek ? 'check' : 'clock'} size={12} />
              {weighedThisWeek ? 'Pesata di questa settimana fatta' : 'Pesata settimanale da fare'}
            </span>
            <span className="caption">Bulk: +0.25–0.5 kg/sett.</span>
          </div>
          <SpecularButton size="md" radius={16} tint="#0a84ff" tintOpacity={0.9} textColor="#ffffff" baseColor="#4a4a4f" autoAnimate speed={0.5} onClick={openAdd} className="weight-card__cta">
            <Icon name="plus" size={18} />
            Registra peso
          </SpecularButton>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Costanza</h2>
          <span className="meta">
            {streak} {streak === 1 ? 'giorno' : 'giorni'} di fila
          </span>
        </div>
        <div className="card">
          <div className="dots" aria-label="Ultimi 14 giorni">
            {days.map(d => (
              <span key={d.key} className="dot-day" title={`${d.key}: ${Math.round(d.ratio * 100)}%`}>
                <span className={`dot dot--${d.ratio >= 0.7 ? 'full' : d.ratio >= 0.3 ? 'half' : 'empty'}`} style={{ '--fill': d.ratio }} />
                <span className="caption">{DAY_SHORT[d.dayKey][0]}</span>
              </span>
            ))}
          </div>
          <p className="footnote">Un giorno conta quando completi almeno il 70% della checklist (acqua inclusa).</p>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Allenamento</h2>
          <span className="meta">
            {workoutsThisWeek}/5 questa settimana · {completedWorkouts.length} totali
          </span>
        </div>
        <div className="list">
          {bestByPattern.map(({ key, label, best }) => (
            <div key={key} className="row">
              <div className="row-body">
                <span className="row-title">{label}</span>
                <span className="row-subtitle">{best ? `${best.variation} · ${formatDateShort(parseDateKey(best.date))}` : 'Nessun dato ancora'}</span>
              </div>
              <span className="row-trailing tabular">{best ? `${fmtKg(best.topKg)} kg · e1RM ${Math.round(best.e1rm)}` : '–'}</span>
            </div>
          ))}
        </div>
        {state.variationLog.length > 0 ? (
          <div className="stack">
            <span className="caption today__group">Cambi variante</span>
            <div className="list">
              {[...state.variationLog]
                .reverse()
                .slice(0, 5)
                .map((v, i) => (
                  <div key={`${v.date}-${i}`} className="row">
                    <div className="row-body">
                      <span className="row-title">{PATTERNS[v.pattern].label}</span>
                      <span className="row-subtitle">
                        {PATTERNS[v.pattern].variations[v.from]} → {PATTERNS[v.pattern].variations[v.to]} · {v.reason === 'plateau' ? 'plateau' : 'manuale'}
                      </span>
                    </div>
                    <span className="row-trailing">{formatDateShort(parseDateKey(v.date))}</span>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Storico pesate</h2>
          <span className="meta">{weights.length}</span>
        </div>
        <div className="list">
          {[...weights].reverse().map(w => (
            <button key={w.date} type="button" className="row row--interactive" onClick={() => setSheet({ edit: w })}>
              <div className="row-body">
                <span className="row-title tabular">{fmtKg(w.kg)} kg</span>
                <span className="row-subtitle">{parseDateKey(w.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <Icon name="chevronRight" size={16} className="muted" />
            </button>
          ))}
        </div>
      </section>

      <Sheet
        open={sheet === 'add'}
        title="Registra peso"
        onClose={() => setSheet(null)}
        footer={
          <button type="button" className="btn btn--primary" onClick={save}>
            Salva
          </button>
        }
      >
        <div className="field">
          <label htmlFor="weight-kg">Peso (kg)</label>
          <input id="weight-kg" className="input input--big" type="number" inputMode="decimal" step="0.1" min="30" max="200" value={kgInput} onChange={e => setKgInput(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label htmlFor="weight-date">Data</label>
          <input id="weight-date" className="input" type="date" value={dateInput} max={dateKey(now)} onChange={e => setDateInput(e.target.value)} />
        </div>
        <p className="footnote">Pesati sempre nelle stesse condizioni: mattina, a digiuno, dopo il bagno.</p>
      </Sheet>

      <Sheet open={Boolean(sheet?.edit)} title="Pesata" onClose={() => setSheet(null)}>
        {sheet?.edit ? (
          <>
            <div className="stack" style={{ alignItems: 'center' }}>
              <span className="stat-value">
                {fmtKg(sheet.edit.kg)}
                <span className="stat-unit"> kg</span>
              </span>
              <span className="footnote">{parseDateKey(sheet.edit.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <HoldButton
              size="md"
              radius={14}
              backgroundColor="var(--surface)"
              fillColor="#f43f5e"
              textColor="var(--text-primary)"
              holdTime={1500}
              doneLabel="Eliminata"
              icon={<Icon name="trash" size={16} />}
              onHold={() => {
                actions.removeWeight(sheet.edit.date);
                setTimeout(() => setSheet(null), 600);
              }}
              className="progress__delete"
            >
              Tieni premuto per eliminare
            </HoldButton>
          </>
        ) : null}
      </Sheet>
    </div>
  );
}

function Delta({ label, value }) {
  const sign = value > 0 ? '+' : '';
  const tone = value > 0 ? 'chip--success' : value < 0 ? 'chip--warning' : '';
  return (
    <span className="delta">
      <span className={`chip ${tone} tabular`}>
        {sign}
        {fmtKg(Math.round(value * 10) / 10)} kg
      </span>
      <span className="caption">{label}</span>
    </span>
  );
}
