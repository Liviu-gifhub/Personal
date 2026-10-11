import { formatMinutes } from '../../data/routine.js';
import Icon, { KIND_COLOR, KIND_ICON } from './Icon.jsx';
import './ReminderBanner.css';

/*
  Promemoria attivi: mostrati in alto nella schermata Oggi, uno alla volta (il più recente),
  con azione "Fatto" (quando è collegato a una spunta) e "Chiudi".
*/
export default function ReminderBanner({ reminders, onDone, onDismiss }) {
  if (!reminders.length) return null;
  const r = reminders[reminders.length - 1];
  const more = reminders.length - 1;
  const color = KIND_COLOR[r.kind] || 'var(--accent)';

  return (
    <div className="reminder" role="status" aria-live="polite" style={{ '--kind-color': color }}>
      <span className="reminder__icon">
        <Icon name={KIND_ICON[r.kind] || 'bell'} size={18} />
      </span>
      <div className="reminder__body">
        <div className="reminder__head">
          <strong>{r.title}</strong>
          <span className="reminder__time">{formatMinutes(r.minutes)}</span>
        </div>
        <p className="reminder__text">{r.body}</p>
        {more > 0 ? <span className="reminder__more">+{more} altri promemoria</span> : null}
      </div>
      <div className="reminder__actions">
        {onDone && r.checkId ? (
          <button type="button" className="btn btn--sm btn--tinted" onClick={() => onDone(r)}>
            Fatto
          </button>
        ) : null}
        <button type="button" className="btn btn--sm btn--icon reminder__close" aria-label="Chiudi promemoria" onClick={() => onDismiss(r)}>
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}
