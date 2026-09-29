import { useMemo, useState } from 'react';
import CheckRow from '../components/ui/CheckRow.jsx';
import Icon from '../components/ui/Icon.jsx';
import WaterCounter from '../components/ui/WaterCounter.jsx';
import SpringCheck from '../components/reactbits/SpringCheck.jsx';
import { DAY_SHORT } from '../data/profile.js';
import { MEALS, MEAL_PREP, MEDICINE, SUPPLEMENTS, TARGETS, isMedicineDay } from '../data/nutrition.js';
import { PROFILE } from '../data/profile.js';
import './Nutrition.css';

const MACROS = [
  { id: 'proteinG', label: 'Proteine', unit: 'g', color: 'var(--error)' },
  { id: 'carbsG', label: 'Carboidrati', unit: 'g', color: 'var(--warning)' },
  { id: 'fatG', label: 'Grassi', unit: 'g', color: 'var(--purple)' },
  { id: 'fiberG', label: 'Fibre', unit: 'g', color: 'var(--success)' }
];

export default function Nutrition({ state, actions, engine }) {
  const { today, dayKey } = engine;
  const checks = state.checks[today] || {};
  const water = state.water[today] || 0;
  const isWeekend = dayKey === 'sat' || dayKey === 'sun';
  const medDay = isMedicineDay(dayKey);
  const [expanded, setExpanded] = useState(null);

  const eatenKcal = useMemo(() => MEALS.filter(m => checks[`meal-${m.id}`]).reduce((s, m) => s + m.kcal, 0), [checks]);
  const mealsDone = MEALS.filter(m => checks[`meal-${m.id}`]).length;
  const kcalRatio = Math.min(1, eatenKcal / TARGETS.kcal);

  const prepDone = MEAL_PREP.steps.filter(s => checks[`prep-${s.id}`]).length;
  const isSunday = dayKey === 'sun';

  return (
    <div className="page nutrition">
      <header className="page-header">
        <span className="eyebrow">Nutrizione</span>
        <h1>Bulk invernale</h1>
        <p className="muted">
          ~{TARGETS.kcal} kcal al giorno (mantenimento ~{TARGETS.maintenanceKcal}, surplus ~{TARGETS.surplusKcal}).
        </p>
      </header>

      <section className="section">
        <div className="card card--accent">
          <div className="spread">
            <div className="stack" style={{ gap: 0 }}>
              <span className="stat-value">
                {eatenKcal}
                <span className="stat-unit"> / {TARGETS.kcal} kcal</span>
              </span>
              <span className="stat-label">
                {mealsDone}/{MEALS.length} pasti completati
              </span>
            </div>
            <span className={`chip ${kcalRatio >= 1 ? 'chip--success' : 'chip--accent'}`}>{Math.round(kcalRatio * 100)}%</span>
          </div>
          <div className="progress">
            <span style={{ width: `${kcalRatio * 100}%` }} />
          </div>
          <div className="macros">
            {MACROS.map(m => (
              <div key={m.id} className="macro">
                <span className="macro__value tabular" style={{ color: m.color }}>
                  {TARGETS[m.id]}
                  <span className="macro__unit">{m.unit}</span>
                </span>
                <span className="caption">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Acqua</h2>
          <span className="meta">{PROFILE.waterTargetMl / 1000} L al giorno</span>
        </div>
        <div className="card">
          <WaterCounter ml={water} size="lg" onAdd={delta => actions.addWater(today, delta)} />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Pasti di oggi</h2>
          <span className="meta">Tocca per i dettagli</span>
        </div>
        <div className="stack">
          {MEALS.map(meal => {
            const id = `meal-${meal.id}`;
            const done = Boolean(checks[id]);
            const open = expanded === meal.id;
            const title = isWeekend && meal.id === 'pregym' ? 'Cena' : meal.title;
            return (
              <article key={meal.id} className={`meal card${done ? ' meal--done' : ''}`}>
                <div className="meal__head">
                  <button type="button" className="meal__toggle" aria-expanded={open} onClick={() => setExpanded(open ? null : meal.id)}>
                    <span className="meal__time tabular">{meal.time}</span>
                    <span className="row-body">
                      <span className="meal__title">{title}</span>
                      <span className="row-subtitle">
                        {meal.subtitle} · ~{meal.kcal} kcal
                      </span>
                    </span>
                    <Icon name="chevronRight" size={18} className={`meal__chevron${open ? ' meal__chevron--open' : ''}`} />
                  </button>
                  <SpringCheck
                    ariaLabel={`${title} completato`}
                    label=""
                    checked={done}
                    onChange={v => actions.toggleCheck(today, id, v)}
                    color="var(--text-secondary)"
                    fillColor="var(--success)"
                    checkColor="#ffffff"
                    boxSize={28}
                    boxRadius={14}
                    strike="none"
                    className="meal__check"
                  />
                </div>
                {open ? (
                  <div className="meal__details">
                    <ul className="meal__items">
                      {meal.items.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {meal.prep ? (
                      <p className="footnote">
                        <strong>Preparazione:</strong> {meal.prep}
                      </p>
                    ) : null}
                    {meal.variant ? <p className="footnote">{meal.variant}</p> : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Integratori e medicine</h2>
          <span className="meta">{medDay ? 'Oggi medicine: sì' : 'Oggi medicine: no'}</span>
        </div>
        <div className="list">
          <CheckRow
            item={{ id: 'supplements', title: 'Integratori del mattino', subtitle: SUPPLEMENTS.morning.map(s => s.name).join(' · '), kind: 'supplements' }}
            checked={Boolean(checks.supplements)}
            onChange={v => actions.toggleCheck(today, 'supplements', v)}
            trailing="06:30"
          />
          {medDay ? (
            <CheckRow
              item={{ id: 'medicine', title: 'Medicine', subtitle: 'Giorno sì', kind: 'medicine' }}
              checked={Boolean(checks.medicine)}
              onChange={v => actions.toggleCheck(today, 'medicine', v)}
              trailing={MEDICINE.time}
            />
          ) : (
            <div className="row">
              <span className="check-row__icon" style={{ '--kind-color': 'var(--text-secondary)' }}>
                <Icon name="heart" size={16} />
              </span>
              <div className="row-body">
                <span className="row-title muted">Medicine: giorno di pausa</span>
                <span className="row-subtitle">Mercoledì e giovedì non si prendono.</span>
              </div>
            </div>
          )}
          <CheckRow
            item={{ id: 'magnesium', title: 'Magnesio bisglicinato', subtitle: 'Con lo shake post-gym', kind: 'supplements' }}
            checked={Boolean(checks.magnesium)}
            onChange={v => actions.toggleCheck(today, 'magnesium', v)}
            trailing="21:30"
          />
        </div>
        <div className="med-week" aria-label="Calendario medicine">
          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(d => (
            <span key={d} className={`med-week__day${MEDICINE.days.includes(d) ? ' med-week__day--on' : ''}${d === dayKey ? ' med-week__day--today' : ''}`}>
              <span>{DAY_SHORT[d]}</span>
              <Icon name={MEDICINE.days.includes(d) ? 'check' : 'minus'} size={12} />
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>{MEAL_PREP.title}</h2>
          <span className="meta">{isSunday ? `${prepDone}/${MEAL_PREP.steps.length} fatti` : 'Prossima: domenica'}</span>
        </div>
        <div className={`list${isSunday ? '' : ' prep--readonly'}`}>
          {MEAL_PREP.steps.map((step, i) => (
            <CheckRow
              key={step.id}
              item={{ id: `prep-${step.id}`, title: step.text, kind: 'prep' }}
              checked={isSunday ? Boolean(checks[`prep-${step.id}`]) : false}
              onChange={v => isSunday && actions.toggleCheck(today, `prep-${step.id}`, v)}
              trailing={`${i + 1}`}
              compact
            />
          ))}
        </div>
        <p className="footnote">Il porridge della colazione si prepara ogni sera (o 2-3 porzioni insieme): promemoria alle 22:00.</p>
      </section>
    </div>
  );
}
