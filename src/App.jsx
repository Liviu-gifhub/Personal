import { useEffect, useRef, useState } from 'react';
import { StoreProvider, useStore } from './lib/store.jsx';
import { useNow } from './lib/time.js';
import { useReminderEngine } from './lib/reminders.js';
import TabBar from './components/ui/TabBar.jsx';
import Today from './screens/Today.jsx';
import Routine from './screens/Routine.jsx';
import Nutrition from './screens/Nutrition.jsx';
import Workout from './screens/Workout.jsx';
import Progress from './screens/Progress.jsx';
import Settings from './screens/Settings.jsx';

function Shell() {
  const { state, actions } = useStore();
  const now = useNow();
  const engine = useReminderEngine({ state, actions, now });
  const [tab, setTab] = useState('today');
  const [openSeed, setOpenSeed] = useState(() => Math.floor(Math.random() * 1000));

  const counted = useRef(false);
  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    actions.bumpOpenCount();
  }, [actions]);

  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) setOpenSeed(Math.floor(Math.random() * 1000));
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  useEffect(() => {
    const theme = state.settings.theme;
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [state.settings.theme]);

  const screenProps = { state, actions, now, engine, setTab, openSeed };

  return (
    <div className="app">
      <main>
        {tab === 'today' && <Today {...screenProps} />}
        {tab === 'routine' && <Routine {...screenProps} />}
        {tab === 'nutrition' && <Nutrition {...screenProps} />}
        {tab === 'workout' && <Workout {...screenProps} />}
        {tab === 'progress' && <Progress {...screenProps} />}
        {tab === 'settings' && <Settings {...screenProps} />}
      </main>
      <TabBar current={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
