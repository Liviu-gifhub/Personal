import SpringCheck from '../reactbits/SpringCheck.jsx';
import Icon, { KIND_COLOR, KIND_ICON } from './Icon.jsx';
import './CheckRow.css';

/*
  Riga di checklist: SpringCheck (React Bits) + icona per tipologia + metadati a destra.
*/
export default function CheckRow({ item, checked, onChange, trailing, compact = false }) {
  const kind = item.kind || 'rest';
  return (
    <div className={`check-row${checked ? ' check-row--done' : ''}${compact ? ' check-row--compact' : ''}`}>
      <span className="check-row__icon" style={{ '--kind-color': KIND_COLOR[kind] || 'var(--accent)' }}>
        <Icon name={KIND_ICON[kind] || 'info'} size={16} />
      </span>
      <div className="check-row__body">
        <SpringCheck
          label={item.title}
          checked={checked}
          onChange={onChange}
          color="var(--text-primary)"
          fillColor="var(--accent)"
          checkColor="#ffffff"
          boxSize={compact ? 24 : 26}
          boxRadius={compact ? 8 : 9}
          fontSize={compact ? 15 : 17}
          doneOpacity={0.45}
          strike="left"
        />
        {item.subtitle ? <span className="check-row__subtitle">{item.subtitle}</span> : null}
      </div>
      {trailing ? <span className="check-row__trailing">{trailing}</span> : null}
    </div>
  );
}
