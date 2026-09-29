import { useMemo } from 'react';
import { FiActivity, FiCoffee, FiDroplet, FiTrendingUp } from 'react-icons/fi';
import GlassIcons from '../components/reactbits/GlassIcons.jsx';
import CheckRow from '../components/ui/CheckRow.jsx';
import Icon, { KIND_COLOR, KIND_ICON } from '../components/ui/Icon.jsx';
import ReminderBanner from '../components/ui/ReminderBanner.jsx';
import WaterCounter from '../components/ui/WaterCounter.jsx';
import { pickWelcome } from '../data/messages.js';
import { PROFILE } from '../data/profile.js';
import { findCurrentBlock, findNextBlock, formatMinutes, getRoutineForDay } from '../data/routine.js';
import { buildChecklist, computeStreak, dayProgress } from '../lib/checklist.js';
import { formatDateLong } from '../lib/time.js';
import './Today.css';

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

export default function Today({ state, actions, now, engine, setTab, openSeed }) {
  const { today, dayKey, minutesNow } = engine;
  const checks = state.checks[today] || {};
  const water = state.water[today] || 0;

  const welcome = useMemo(
    () => pickWelcome({ minutes: minutesNow, dayKey, seed: openSeed + (state.settings.openCount || 0) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openSeed, dayKey, welcomeSlotId(minutesNow)]
  );

  const routine = useMemo(() => getRoutineForDay(dayKey), [dayKey]);
  const current = findCurrentBlock(routine, minutesNow);
  const next = findNextBlock(routine, minutesNow);
  const checklist = useMemo(() => buildChecklist(dayKey), [dayKey]);
  const checkIds = useMemo(() => new Set(checklist.map(i => i.id)), [checklist]);
  const progress = dayProgress(state, now);
  const streak = computeStreak(state, now);

  const groups = useMemo(() => {
    const map = new Map();
    for (const item of checklist) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group).push(item);
    }
    return [...map.entries()];
  }, [checklist]);

  const activeReminders = engine.active.map(r => ({ ...r, checkId: checkIds.has(r.id) ? r.id : null }));
  const currentCheckId = current ? BLOCK_CHECK[current.id] : null;
  const blockRatio = current ? Math.min(1, Math.max(0, (minutesNow - current.start) / (current.end - current.start))) : 0;

  const quickActions = [
    { icon: <FiDroplet />, color: 'linear-gradient(hsl(199, 90%, 50%), hsl(190, 90%, 45%))', label: '+250 ml', onClick: () => actions.addWater(today, PROFILE.waterStepMl) },
    { icon: <FiActivity />, color: 'red', label: 'Palestra', onClick: () => setTab('workout') },
    { icon: <FiCoffee />, color: 'green', label: 'Pasti', onClick: () => setTab('nutrition') },
    { icon: <FiTrendingUp />, color: 'blue', label: 'Peso', onClick: () => setTab('progress') }
  ];

  return (
    <div className="page today">
      <header className="page-header today__header">
        <div className="spread">
          <span className="eyebrow">
            {formatDateLong(now)} · {welcome.slot.label}
          </span>
          <button type="button" className="btn btn--icon today__settings" aria-label="Impostazioni" onClick={() => setTab('settings')}>
            <Icon name="settings" size={20} />
          </button>
        </div>
        <h1 className={`today__welcome${welcome.special ? ' today__welcome--special' : ''}`}>{welcome.text}</h1>
      </header>

      <ReminderBanner
        reminders={activeReminders}
        onDone={r => {
          actions.toggleCheck(today, r.checkId, true);
          actions.dismissReminder(today, r.id);
        }}
        onDismiss={r => actions.dismissReminder(today, r.id)}
      />

      <section className="section">
        <div className="card card--accent now-card">
          {current ? (
            <>
              <div className="now-card__head">
                <span className="now-card__icon" style={{ '--kind-color': KIND_COLOR[current.kind] || 'var(--accent)' }}>
                  <Icon name={current.icon || KIND_ICON[current.kind] || 'clock'} size={22} />
                </span>
                <div className="row-body">
                  <span className="caption">Adesso · {formatMinutes(current.start)}–{formatMinutes(current.end)}</span>
                  <h2 className="now-card__title">{current.title}</h2>
                  {current.detail ? <span className="footnote">{current.detail}</span> : null}
                </div>
              </div>
              <div className="progress" aria-hidden="true">
                <span style={{ width: `${blockRatio * 100}%` }} />
              </div>
              <div className="spread">
                <span className="footnote">
                  {next ? (
                    <>
                      Poi: <strong className="now-card__next">{next.title}</strong> alle {formatMinutes(next.start)}
                    </>
                  ) : (
                    'Ultimo blocco della giornata.'
                  )}
                </span>
                {currentCheckId && checkIds.has(currentCheckId) ? (
                  <button
                    type="button"
                    className={`btn btn--sm ${checks[currentCheckId] ? '' : 'btn--tinted'}`}
                    onClick={() => actions.toggleCheck(today, currentCheckId)}
                  >
                    <Icon name={checks[currentCheckId] ? 'checkCircle' : 'check'} size={16} />
                    {checks[currentCheckId] ? 'Fatto' : 'Segna fatto'}
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="now-card__head">
              <span className="now-card__icon" style={{ '--kind-color': 'var(--text-secondary)' }}>
                <Icon name="moon" size={22} />
              </span>
              <div className="row-body">
                <span className="caption">Fuori routine</span>
                <h2 className="now-card__title">Notte</h2>
                <span className="footnote">{next ? `Prossimo: ${next.title} alle ${formatMinutes(next.start)}` : 'Sveglia alle 06:30.'}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid-3 today__stats">
        <div className="card stat">
          <span className="stat-value">{Math.round(progress.ratio * 100)}%</span>
          <span className="stat-label">Giornata</span>
        </div>
        <div className="card stat">
          <span className="stat-value">
            {streak}
            <span className="stat-unit"> {streak === 1 ? 'giorno' : 'giorni'}</span>
          </span>
          <span className="stat-label">Costanza</span>
        </div>
        <div className="card stat">
          <span className="stat-value">
            {(water / 1000).toFixed(2)}
            <span className="stat-unit"> L</span>
          </span>
          <span className="stat-label">Acqua</span>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Acqua</h2>
          <span className="meta">Obiettivo {PROFILE.waterTargetMl / 1000} L</span>
        </div>
        <div className="card">
          <WaterCounter ml={water} size="sm" onAdd={delta => actions.addWater(today, delta)} />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Checklist di oggi</h2>
          <span className="meta">
            {progress.done}/{checklist.length}
          </span>
        </div>
        {groups.map(([group, items]) => (
          <div key={group} className="stack">
            <span className="caption today__group">{group}</span>
            <div className="list">
              {items.map(item => (
                <CheckRow
                  key={item.id}
                  item={item}
                  checked={Boolean(checks[item.id])}
                  onChange={v => actions.toggleCheck(today, item.id, v)}
                  trailing={formatMinutes(item.minutes)}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Prossimi promemoria</h2>
          <span className="meta">{state.settings.notifications ? 'Notifiche attive' : 'Solo in app'}</span>
        </div>
        <div className="list">
          {engine.upcoming.length === 0 ? (
            <div className="empty">
              <strong>Niente altro per oggi</strong>
              <span>Tutto quello che potevi fare oggi è fatto.</span>
            </div>
          ) : (
            engine.upcoming.map(r => (
              <div key={r.id} className="row">
                <span className="check-row__icon" style={{ '--kind-color': KIND_COLOR[r.kind] || 'var(--accent)' }}>
                  <Icon name={KIND_ICON[r.kind] || 'bell'} size={16} />
                </span>
                <div className="row-body">
                  <span className="row-title">{r.title}</span>
                  <span className="row-subtitle">{r.body}</span>
                </div>
                <span className="row-trailing tabular">{formatMinutes(r.minutes)}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Scorciatoie</h2>
        </div>
        <GlassIcons items={quickActions} className="quick-actions" />
      </section>
    </div>
  );
}

function welcomeSlotId(minutes) {
  return Math.floor(minutes / 30);
}
