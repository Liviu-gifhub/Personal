import { useEffect, useMemo, useRef, useState } from 'react';
import HoldButton from '../reactbits/HoldButton.jsx';
import Icon from './Icon.jsx';
import { getRoutineForDay } from '../../data/routine.js';
import { dayKeyOf } from '../../lib/time.js';
import './FocusTimer.css';

const FOCUS_KINDS = new Set(['study', 'business', 'gym', 'selfcare', 'mealprep', 'school']);
const POMODORO_WORK = 25;
const POMODORO_BREAK = 5;

function pickFocusBlocks(dayKey) {
  return getRoutineForDay(dayKey)
    .filter(b => FOCUS_KINDS.has(b.kind) && b.end > b.start)
    .map(b => ({
      id: b.id,
      title: b.title,
      kind: b.kind,
      minutes: b.end - b.start,
      detail: b.detail
    }));
}

function formatCountdown(totalSec) {
  const m = Math.floor(Math.max(0, totalSec) / 60);
  const s = Math.max(0, totalSec) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function FocusTimer({ now, open, onClose, deepLock = false }) {
  const dayKey = dayKeyOf(now);
  const activities = useMemo(() => pickFocusBlocks(dayKey), [dayKey]);
  const [activityId, setActivityId] = useState(() => activities[0]?.id || '');
  const [mode, setMode] = useState('pomodoro');
  const [phase, setPhase] = useState('idle');
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [deep, setDeep] = useState(deepLock);
  const [pomodoroIndex, setPomodoroIndex] = useState(0);
  const [totalPomodoros, setTotalPomodoros] = useState(1);
  const wakeLockRef = useRef(null);
  const endAtRef = useRef(null);
  const phaseRef = useRef(phase);
  const modeRef = useRef(mode);
  const pomodoroIndexRef = useRef(pomodoroIndex);
  const totalPomodorosRef = useRef(totalPomodoros);

  phaseRef.current = phase;
  modeRef.current = mode;
  pomodoroIndexRef.current = pomodoroIndex;
  totalPomodorosRef.current = totalPomodoros;

  const activity = activities.find(a => a.id === activityId) || activities[0] || null;

  useEffect(() => {
    if (!activities.length) return;
    if (!activities.some(a => a.id === activityId)) setActivityId(activities[0].id);
  }, [activities, activityId]);

  useEffect(() => {
    if (open && deepLock) setDeep(true);
  }, [open, deepLock]);

  useEffect(() => {
    if (!running) return undefined;
    if (!endAtRef.current) endAtRef.current = Date.now() + remaining * 1000;

    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left > 0) return;

      endAtRef.current = null;
      setRunning(false);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([120, 60, 120]);

      const currentPhase = phaseRef.current;
      const currentMode = modeRef.current;
      const idx = pomodoroIndexRef.current;
      const total = totalPomodorosRef.current;

      if (currentPhase === 'work' && currentMode === 'pomodoro' && idx + 1 < total) {
        setPhase('break');
        setRemaining(POMODORO_BREAK * 60);
        endAtRef.current = Date.now() + POMODORO_BREAK * 60 * 1000;
        setRunning(true);
      } else if (currentPhase === 'break') {
        setPhase('work');
        setPomodoroIndex(i => i + 1);
        setRemaining(POMODORO_WORK * 60);
        endAtRef.current = Date.now() + POMODORO_WORK * 60 * 1000;
        setRunning(true);
      } else {
        setPhase('done');
      }
    }, 250);

    return () => clearInterval(id);
    // remaining solo al momento dello start/resume
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => {
    let cancelled = false;
    async function lock() {
      if (!deep || !running || !('wakeLock' in navigator)) return;
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch {
        /* permesso negato o non supportato */
      }
    }
    if (deep && running) lock();
    else if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
    const onVis = () => {
      if (!document.hidden && deep && running && !cancelled) lock();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVis);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [deep, running]);

  useEffect(() => {
    if (!deep || !open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const block = e => {
      if (e.key === 'Escape') e.preventDefault();
    };
    window.addEventListener('keydown', block, true);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', block, true);
    };
  }, [deep, open]);

  if (!open) return null;

  const start = () => {
    if (!activity) return;
    const fullMin = activity.minutes;
    const poms = Math.max(1, Math.ceil(fullMin / POMODORO_WORK));
    const secs = (mode === 'full' ? fullMin : Math.min(POMODORO_WORK, fullMin)) * 60;
    setTotalPomodoros(poms);
    setPomodoroIndex(0);
    setPhase('work');
    setRemaining(secs);
    endAtRef.current = Date.now() + secs * 1000;
    setRunning(true);
  };

  const pause = () => {
    if (endAtRef.current) {
      setRemaining(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)));
    }
    endAtRef.current = null;
    setRunning(false);
  };

  const resume = () => {
    if (remaining <= 0) return;
    endAtRef.current = Date.now() + remaining * 1000;
    setRunning(true);
  };

  const reset = () => {
    endAtRef.current = null;
    setRunning(false);
    setPhase('idle');
    setRemaining(0);
    setPomodoroIndex(0);
  };

  const requestClose = () => {
    if (deep && (running || phase === 'work' || phase === 'break')) return;
    reset();
    setDeep(false);
    onClose();
  };

  const forceExitDeep = () => {
    reset();
    setDeep(false);
    onClose();
  };

  const totalForPhase =
    phase === 'break' ? POMODORO_BREAK : mode === 'full' ? activity?.minutes || POMODORO_WORK : POMODORO_WORK;
  const progress = phase === 'work' || phase === 'break' ? 1 - remaining / (totalForPhase * 60) : 0;

  return (
    <div className={`focus-overlay${deep ? ' focus-overlay--deep' : ''}`} role="dialog" aria-modal="true" aria-label="Focus timer">
      <div className="focus-panel">
        {deep && phase !== 'idle' ? (
          <header className="focus-panel__header focus-panel__header--deep">
            <span className="eyebrow">Deep Focus</span>
            <h2>Telefono bloccato</h2>
            <p className="muted">Solo il timer. Tieni premuto per uscire.</p>
          </header>
        ) : (
          <header className="focus-panel__header">
            <div>
              <span className="eyebrow">{deep ? 'Deep Focus' : 'Focus'}</span>
              <h2>Pomodoro</h2>
            </div>
            {!deep ? (
              <button type="button" className="btn btn--icon" aria-label="Chiudi" onClick={requestClose}>
                <Icon name="close" size={18} />
              </button>
            ) : null}
          </header>
        )}

        {phase === 'idle' ? (
          <>
            <div className="field">
              <label htmlFor="focus-activity">Attività</label>
              <select id="focus-activity" className="input" value={activity?.id || ''} onChange={e => setActivityId(e.target.value)}>
                {activities.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title} · {a.minutes} min
                  </option>
                ))}
              </select>
            </div>
            {activity ? (
              <p className="footnote">
                Durata dalla routine: {activity.minutes} min
                {activity.detail ? ` · ${activity.detail}` : ''}
              </p>
            ) : null}
            <div className="segmented focus-panel__modes">
              <button type="button" aria-pressed={mode === 'pomodoro'} onClick={() => setMode('pomodoro')}>
                Pomodoro 25′
              </button>
              <button type="button" aria-pressed={mode === 'full'} onClick={() => setMode('full')}>
                Sessione intera
              </button>
            </div>
            {!deepLock ? (
              <label className="focus-panel__deep-toggle">
                <input type="checkbox" checked={deep} onChange={e => setDeep(e.target.checked)} />
                <span>
                  <strong>Deep Focus</strong>
                  <span className="caption">Blocca l'interfaccia finché non tieni premuto per uscire</span>
                </span>
              </label>
            ) : (
              <p className="footnote">Deep Focus attivo: dopo l'avvio l'app resta bloccata sul timer.</p>
            )}
            <button type="button" className="btn btn--primary focus-panel__start" onClick={start} disabled={!activity}>
              <Icon name="zap" size={18} />
              Avvia{' '}
              {mode === 'full'
                ? `${activity?.minutes || 0} min`
                : `${Math.max(1, Math.ceil((activity?.minutes || POMODORO_WORK) / POMODORO_WORK))} × 25 min`}
            </button>
            {deep ? (
              <button type="button" className="btn" onClick={forceExitDeep}>
                Annulla
              </button>
            ) : null}
          </>
        ) : (
          <div className="focus-timer">
            <div className="focus-timer__ring" style={{ '--p': Math.min(1, Math.max(0, progress)) }}>
              <span className="focus-timer__time tabular">{formatCountdown(remaining)}</span>
              <span className="focus-timer__phase">
                {phase === 'done' ? 'Fatto' : phase === 'break' ? 'Pausa' : activity?.title || 'Focus'}
              </span>
            </div>
            {mode === 'pomodoro' && phase !== 'done' ? (
              <span className="caption">
                Blocco {Math.min(pomodoroIndex + 1, totalPomodoros)}/{totalPomodoros}
                {phase === 'break' ? ' · pausa 5 min' : ''}
              </span>
            ) : null}
            <div className="focus-timer__controls">
              {phase !== 'done' ? (
                running ? (
                  <button type="button" className="btn" onClick={pause}>
                    <Icon name="pause" size={16} /> Pausa
                  </button>
                ) : (
                  <button type="button" className="btn btn--primary" onClick={resume}>
                    <Icon name="zap" size={16} /> Riprendi
                  </button>
                )
              ) : (
                <button type="button" className="btn btn--primary" onClick={reset}>
                  Nuova sessione
                </button>
              )}
              {!deep ? (
                <button type="button" className="btn" onClick={requestClose}>
                  Chiudi
                </button>
              ) : null}
            </div>
          </div>
        )}

        {deep && phase !== 'idle' ? (
          <HoldButton
            size="md"
            radius={14}
            backgroundColor="var(--surface-elevated)"
            fillColor="#f43f5e"
            textColor="var(--text-primary)"
            holdTime={1800}
            doneLabel="Sbloccato"
            icon={<Icon name="close" size={16} />}
            onHold={forceExitDeep}
            className="focus-panel__exit"
          >
            Tieni premuto per uscire da Deep Focus
          </HoldButton>
        ) : null}
      </div>
    </div>
  );
}
