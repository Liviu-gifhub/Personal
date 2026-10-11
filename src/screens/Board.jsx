import { useMemo, useState } from 'react';
import Icon from '../components/ui/Icon.jsx';
import './Board.css';

const COLUMNS = [
  { id: 'todo', label: 'Da fare' },
  { id: 'doing', label: 'In corso' },
  { id: 'done', label: 'Fatto' }
];

export default function Board({ state, actions, setTab }) {
  const [text, setText] = useState('');
  const todos = state.todos || [];

  const grouped = useMemo(() => {
    const map = { todo: [], doing: [], done: [] };
    for (const item of todos) {
      const col = map[item.column] ? item.column : 'todo';
      map[col].push(item);
    }
    return map;
  }, [todos]);

  const add = e => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    actions.addTodo(value);
    setText('');
  };

  return (
    <div className="page board-screen">
      <header className="page-header">
        <button type="button" className="btn btn--plain board__back" onClick={() => setTab('today')}>
          <Icon name="chevronLeft" size={18} /> Oggi
        </button>
        <span className="eyebrow">Board</span>
        <h1>Cose da fare</h1>
        <p className="muted">Annota task, spostali tra le colonne e spunta quando hai finito.</p>
      </header>

      <form className="board__composer card" onSubmit={add}>
        <input
          className="input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Scrivi qualcosa da fare…"
          aria-label="Nuova cosa da fare"
          maxLength={160}
        />
        <button type="submit" className="btn btn--primary" disabled={!text.trim()}>
          <Icon name="plus" size={16} /> Aggiungi
        </button>
      </form>

      <div className="board__columns">
        {COLUMNS.map(col => (
          <section key={col.id} className="board__column">
            <div className="section-header">
              <h2>{col.label}</h2>
              <span className="meta">{grouped[col.id].length}</span>
            </div>
            <div className="board__list">
              {grouped[col.id].length === 0 ? (
                <div className="board__empty caption">Niente qui</div>
              ) : (
                grouped[col.id].map(item => (
                  <article key={item.id} className={`board__card${item.done ? ' board__card--done' : ''}`}>
                    <button
                      type="button"
                      className={`board__check${item.done ? ' board__check--on' : ''}`}
                      aria-label={item.done ? 'Segna da fare' : 'Segna fatto'}
                      onClick={() => actions.toggleTodoDone(item.id)}
                    >
                      <Icon name="check" size={14} />
                    </button>
                    <p className="board__text">{item.text}</p>
                    <div className="board__actions">
                      {COLUMNS.filter(c => c.id !== (item.column || 'todo')).map(c => (
                        <button key={c.id} type="button" className="btn btn--sm" onClick={() => actions.moveTodo(item.id, c.id)}>
                          {c.label}
                        </button>
                      ))}
                      <button type="button" className="btn btn--icon" aria-label="Elimina" onClick={() => actions.removeTodo(item.id)}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
