import { useMemo, useState } from 'react';
import HoldButton from '../components/reactbits/HoldButton.jsx';
import SpecularButton from '../components/reactbits/SpecularButton.jsx';
import ConsistencyCalendar from '../components/ui/ConsistencyCalendar.jsx';
import Icon from '../components/ui/Icon.jsx';
import Sheet from '../components/ui/Sheet.jsx';
import TrendChart from '../components/ui/TrendChart.jsx';
import WeightChart from '../components/ui/WeightChart.jsx';
import { PROFILE } from '../data/profile.js';
import { getSessionForDay } from '../data/program.js';
import { computeStreak, lastNDays } from '../lib/checklist.js';
import { fmtKg, sessionScore, workoutVolume } from '../lib/progression.js';
import { addDays, dateKey, dayKeyOf, formatDateShort, parseDateKey, weekKey } from '../lib/time.js';
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
  const days = lastNDays(state, 28, now);

  const completedWorkouts = Object.entries(state.workouts).filter(([, w]) => w.completedAt);
  const workoutsThisWeek = completedWorkouts.filter(([d]) => weekKey(parseDateKey(d)) === thisWeek).length;

  const completionSeries = useMemo(
    () =>
      days.map(d => ({
        label: formatDateShort(parseDateKey(d.key)),
        value: Math.round(d.ratio * 100)
      })),
    [days]
  );

  const waterSeries = useMemo(
    () =>
      days.map(d => ({
        label: formatDateShort(parseDateKey(d.key)),
        value: Math.round((d.water / 1000) * 100) / 100
      })),
    [days]
  );

  const volumeSeries = useMemo(() => {
    const out = [];
    for (let i = 27; i >= 0; i--) {
      const date = addDays(now, -i);
      const key = dateKey(date);
      const w = state.workouts[key];
      out.push({
        label: formatDateShort(date),
        value: w?.completedAt ? Math.round(workoutVolume(w)) : 0
      });
    }
    return out;
  }, [state.workouts, now]);

  const weeklyWorkouts = useMemo(() => {
    const map = new Map();
    for (let i = 11; i >= 0; i--) {
      const d = addDays(now, -i * 7);
      const wk = weekKey(d);
      map.set(wk, { label: wk.replace(/^\d+-W/, 'S'), value: 0 });
    }
    for (const [d] of completedWorkouts) {
      const wk = weekKey(parseDateKey(d));
      if (map.has(wk)) map.get(wk).value += 1;
    }
    return [...map.values()];
  }, [completedWorkouts, now]);

  const topLifts = useMemo(() => {
    const best = new Map();
    for (const [date, w] of Object.entries(state.workouts)) {
      for (const [exId, ex] of Object.entries(w.exercises || {})) {
        const score = sessionScore(ex.sets || []);
        if (score.e1rm <= 0) continue;
        const name = exId.startsWith('acc:') ? exId.slice(4) : exId;
        const prevBest = best.get(exId);
        if (!prevBest || score.e1rm > prevBest.e1rm) {
          best.set(exId, { ...score, date, name });
        }
      }
    }
    return [...best.values()].sort((a, b) => b.e1rm - a.e1rm).slice(0, 8);
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

  const todaySession = getSessionForDay(dayKeyOf(now));

  return (
    <div className="page progress-screen">
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
        <ConsistencyCalendar state={state} now={now} streak={streak} />
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Andamento</h2>
          <span className="meta">Ultimi 28 giorni</span>
        </div>
        <div className="stack progress-charts">
          <div className="card">
            <div className="spread">
              <span className="row-title">Completamento giornata</span>
              <span className="meta tabular">{completionSeries[completionSeries.length - 1]?.value ?? 0}%</span>
            </div>
            <TrendChart
              points={completionSeries}
              height={150}
              color="var(--success)"
              formatValue={v => `${v}%`}
              emptyText="Completa qualche giornata per vedere l'andamento."
              ariaLabel="Completamento giornaliero"
            />
          </div>
          <div className="card">
            <div className="spread">
              <span className="row-title">Acqua</span>
              <span className="meta tabular">{waterSeries[waterSeries.length - 1]?.value ?? 0} L</span>
            </div>
            <TrendChart
              points={waterSeries}
              height={150}
              color="var(--teal)"
              mode="bar"
              formatValue={v => `${v} L`}
              emptyText="Bevi e registra l'acqua per vedere il grafico."
              ariaLabel="Andamento acqua"
            />
          </div>
          <div className="card">
            <div className="spread">
              <span className="row-title">Volume allenamento</span>
              <span className="meta">kg totali/giorno</span>
            </div>
            <TrendChart
              points={volumeSeries}
              height={150}
              color="var(--error)"
              mode="bar"
              formatValue={v => `${v} kg`}
              emptyText="Completa un allenamento per vedere il volume."
              ariaLabel="Volume allenamento"
            />
          </div>
          <div className="card">
            <div className="spread">
              <span className="row-title">Sessioni a settimana</span>
              <span className="meta">
                {workoutsThisWeek}/6 questa settimana
                {todaySession ? ` · oggi ${todaySession.name}` : ''}
              </span>
            </div>
            <TrendChart
              points={weeklyWorkouts}
              height={140}
              color="var(--accent)"
              mode="bar"
              formatValue={v => `${v}`}
              emptyText="Nessuna sessione ancora."
              ariaLabel="Sessioni settimanali"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Allenamento</h2>
          <span className="meta">
            {workoutsThisWeek}/6 questa settimana · {completedWorkouts.length} totali
          </span>
        </div>
        <div className="list">
          {topLifts.length === 0 ? (
            <div className="empty">
              <strong>Nessun carico ancora</strong>
              <span>Registra le serie in Palestra per vedere i tuoi migliori esercizi.</span>
            </div>
          ) : (
            topLifts.map(lift => (
              <div key={`${lift.name}-${lift.date}`} className="row">
                <div className="row-body">
                  <span className="row-title">{lift.name}</span>
                  <span className="row-subtitle">{formatDateShort(parseDateKey(lift.date))}</span>
                </div>
                <span className="row-trailing tabular">
                  {fmtKg(lift.topKg)} kg · e1RM {Math.round(lift.e1rm)}
                </span>
              </div>
            ))
          )}
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
                      <span className="row-title">{v.pattern}</span>
                      <span className="row-subtitle">
                        {v.from} → {v.to} · {v.reason === 'plateau' ? 'plateau' : 'manuale'}
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
