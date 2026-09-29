import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import './Sheet.css';

/*
  Sheet modale per task brevi (HIG: titolo esplicito, Annulla sempre presente, Fatto abbinato).
*/
export default function Sheet({ open, title, onClose, children, footer }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet__grabber" aria-hidden="true" />
        <header className="sheet__header">
          <button type="button" className="btn btn--plain" onClick={onClose}>
            Annulla
          </button>
          <h2 id="sheet-title" className="sheet__title">
            {title}
          </h2>
          <button type="button" className="btn btn--icon sheet__close" aria-label="Chiudi" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="sheet__content">{children}</div>
        {footer ? <footer className="sheet__footer">{footer}</footer> : null}
      </div>
    </div>
  );
}
