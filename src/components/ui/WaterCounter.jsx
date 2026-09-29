import Counter from '../reactbits/Counter.jsx';
import Icon from './Icon.jsx';
import { PROFILE } from '../../data/profile.js';
import './WaterCounter.css';

/*
  Contatore acqua giornaliera (React Bits Counter). Valore in litri con 2 decimali, step 250 ml.
*/
export default function WaterCounter({ ml, onAdd, size = 'lg' }) {
  const liters = Math.min(9.99, Math.max(0, ml / 1000));
  const target = PROFILE.waterTargetMl;
  const ratio = Math.min(1, ml / target);
  const done = ml >= target;
  const fontSize = size === 'lg' ? 56 : 36;

  return (
    <div className={`water water--${size}${done ? ' water--done' : ''}`}>
      <div className="water__top">
        <div className="water__value" aria-live="polite" aria-label={`${(ml / 1000).toFixed(2)} litri su ${target / 1000}`}>
          <Counter
            value={Number(liters.toFixed(2))}
            places={[1, '.', 0.1, 0.01]}
            fontSize={fontSize}
            padding={6}
            gap={size === 'lg' ? 4 : 2}
            horizontalPadding={0}
            fontWeight={700}
            textColor="var(--text-primary)"
            gradientHeight={size === 'lg' ? 12 : 8}
            gradientFrom="var(--surface)"
            gradientTo="transparent"
          />
          <span className="water__unit">L</span>
        </div>
        <div className="water__meta">
          <span className="water__target">su {target / 1000} L</span>
          <span className={`chip ${done ? 'chip--success' : 'chip--accent'}`}>{done ? 'Obiettivo raggiunto' : `${Math.round(ratio * 100)}%`}</span>
        </div>
      </div>
      <div className={`progress${done ? ' progress--success' : ''}`} aria-hidden="true">
        <span style={{ width: `${ratio * 100}%`, background: done ? undefined : 'var(--teal)' }} />
      </div>
      <div className="water__actions">
        <button type="button" className="btn btn--icon" aria-label="Togli 250 ml" onClick={() => onAdd(-PROFILE.waterStepMl)} disabled={ml <= 0}>
          <Icon name="minus" size={18} />
        </button>
        <button type="button" className="btn water__add" onClick={() => onAdd(PROFILE.waterStepMl)}>
          <Icon name="water" size={18} />
          +250 ml
        </button>
        <button type="button" className="btn btn--icon" aria-label="Aggiungi 500 ml" onClick={() => onAdd(PROFILE.waterStepMl * 2)}>
          <span className="water__half">½L</span>
        </button>
      </div>
    </div>
  );
}
