import GlassSurface from '../reactbits/GlassSurface.jsx';
import Icon from './Icon.jsx';
import './TabBar.css';

export const TABS = [
  { id: 'today', label: 'Oggi', icon: 'home' },
  { id: 'routine', label: 'Routine', icon: 'clock' },
  { id: 'nutrition', label: 'Nutrizione', icon: 'meal' },
  { id: 'workout', label: 'Palestra', icon: 'dumbbell' },
  { id: 'progress', label: 'Progressi', icon: 'trending' }
];

export default function TabBar({ current, onChange }) {
  return (
    <nav className="tabbar" aria-label="Aree principali">
      <GlassSurface width="100%" height={64} borderRadius={26} backgroundOpacity={0.55} saturation={1.4} className="tabbar__glass">
        <div className="tabbar__items" role="tablist">
          {TABS.map(tab => {
            const active = tab.id === current;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={tab.label}
                className={`tabbar__item${active ? ' tabbar__item--active' : ''}`}
                onClick={() => onChange(tab.id)}
              >
                <span className="tabbar__icon">
                  <Icon name={tab.icon} size={22} />
                </span>
                <span className="tabbar__label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </GlassSurface>
    </nav>
  );
}
