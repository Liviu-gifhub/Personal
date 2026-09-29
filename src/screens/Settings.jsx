import { useRef, useState } from 'react';
import HoldButton from '../components/reactbits/HoldButton.jsx';
import Icon from '../components/ui/Icon.jsx';
import { PROFILE } from '../data/profile.js';
import { PROGRAM } from '../data/program.js';
import { notificationsSupported, requestNotificationPermission } from '../lib/reminders.js';
import { STORAGE_KEY } from '../lib/store.jsx';
import { dateKey, parseDateKey, formatDateShort } from '../lib/time.js';
import './Settings.css';

const THEMES = [
  { id: 'auto', label: 'Auto' },
  { id: 'dark', label: 'Scuro' },
  { id: 'light', label: 'Chiaro' }
];

export default function Settings({ state, actions, setTab }) {
  const [permission, setPermission] = useState(() => (notificationsSupported() ? Notification.permission : 'unsupported'));
  const [message, setMessage] = useState(null);
  const fileRef = useRef(null);

  const toggleNotifications = async () => {
    if (state.settings.notifications) {
      actions.setSetting('notifications', false);
      return;
    }
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      actions.setSetting('notifications', true);
      try {
        new Notification('Promemoria attivi', { body: 'Ti avviserò per integratori, pasti, acqua, palestra e meal prep.', icon: '/icon-192.png' });
      } catch {
        /* alcune piattaforme richiedono un service worker */
      }
    } else {
      setMessage(result === 'unsupported' ? 'Questo browser non supporta le notifiche.' : 'Permesso negato: abilitalo dalle impostazioni del browser.');
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liviu-app-${dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Backup esportato.');
  };

  const importData = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || !('checks' in parsed)) throw new Error('formato');
      actions.importState(parsed);
      setMessage('Dati importati.');
    } catch {
      setMessage('File non valido.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="page settings">
      <header className="page-header">
        <button type="button" className="btn btn--plain settings__back" onClick={() => setTab('today')}>
          <Icon name="chevronLeft" size={18} /> Oggi
        </button>
        <span className="eyebrow">Impostazioni</span>
        <h1>Preferenze</h1>
      </header>

      {message ? (
        <div className="card settings__message" role="status">
          <Icon name="info" size={16} />
          <span>{message}</span>
          <button type="button" className="btn btn--sm btn--plain" onClick={() => setMessage(null)}>
            Ok
          </button>
        </div>
      ) : null}

      <section className="section">
        <div className="section-header">
          <h2>Promemoria</h2>
        </div>
        <div className="list">
          <div className="row">
            <span className="check-row__icon" style={{ '--kind-color': 'var(--accent)' }}>
              <Icon name="bell" size={16} />
            </span>
            <div className="row-body">
              <span className="row-title">Notifiche del browser</span>
              <span className="row-subtitle">
                {permission === 'unsupported' ? 'Non supportate su questo dispositivo' : permission === 'denied' ? 'Permesso negato dal browser' : 'Integratori, pasti, acqua, palestra, meal prep'}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state.settings.notifications}
              className={`toggle${state.settings.notifications ? ' toggle--on' : ''}`}
              onClick={toggleNotifications}
              disabled={permission === 'unsupported'}
              aria-label="Attiva notifiche"
            >
              <span className="toggle__knob" />
            </button>
          </div>
        </div>
        <p className="footnote">
          Le notifiche arrivano finché l'app è aperta o installata sulla schermata Home. I promemoria in app funzionano sempre e spariscono quando spunti l'attività.
        </p>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Aspetto</h2>
        </div>
        <div className="card">
          <div className="spread">
            <span className="row-title">Tema</span>
            <div className="segmented">
              {THEMES.map(t => (
                <button key={t.id} type="button" aria-pressed={state.settings.theme === t.id} onClick={() => actions.setSetting('theme', t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Programma</h2>
        </div>
        <div className="list">
          <div className="row">
            <div className="row-body">
              <span className="row-title">{PROGRAM.name}</span>
              <span className="row-subtitle">Inizio: {state.programStart ? formatDateShort(parseDateKey(state.programStart)) : '–'}</span>
            </div>
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => {
                actions.setProgramStart(dateKey());
                setMessage('Conteggio settimane azzerato: il prossimo deload è consigliato tra 6-8 settimane.');
              }}
            >
              Riparti oggi
            </button>
          </div>
          <div className="row">
            <div className="row-body">
              <span className="row-title">Profilo</span>
              <span className="row-subtitle">
                {PROFILE.name} · {PROFILE.age} anni · {PROFILE.heightCm} cm · {PROFILE.startWeightKg} kg di partenza · {PROFILE.waterTargetMl / 1000} L acqua/giorno
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Dati</h2>
          <span className="meta">Salvati solo su questo dispositivo</span>
        </div>
        <div className="grid-2">
          <button type="button" className="btn" onClick={exportData}>
            <Icon name="download" size={18} /> Esporta backup
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={18} /> Importa
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="sr-only" onChange={importData} />
        </div>
        <div className="card settings__danger">
          <div className="row-body">
            <span className="row-title">Azzera tutto</span>
            <span className="row-subtitle">Elimina checklist, acqua, pesi e allenamenti. Non si può annullare.</span>
          </div>
          <HoldButton
            size="md"
            radius={14}
            backgroundColor="var(--surface-elevated)"
            fillColor="#f43f5e"
            textColor="var(--text-primary)"
            holdTime={2500}
            doneLabel="Azzerato"
            icon={<Icon name="trash" size={16} />}
            onHold={() => {
              actions.resetAll();
              setMessage('Dati azzerati.');
            }}
            className="settings__reset"
          >
            Tieni premuto per azzerare
          </HoldButton>
        </div>
        <p className="caption">
          Chiave archivio: <code>{STORAGE_KEY}</code>
        </p>
      </section>
    </div>
  );
}