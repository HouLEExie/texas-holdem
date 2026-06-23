import { useEffect, useMemo, useState } from 'react';
import type { Game } from './types';
import type { ViewName } from './views';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { GameEditor } from './pages/GameEditor';
import { History } from './pages/History';
import { NewGame } from './pages/NewGame';
import { Settlement } from './pages/Settlement';
import { Stats } from './pages/Stats';
import { loadCurrentGame, loadHistoryGames, saveCurrentGame, saveHistoryGames, upsertHistoryGame } from './lib/storage';

export default function App() {
  const [view, setView] = useState<ViewName>('dashboard');
  const [historyGames, setHistoryGames] = useState<Game[]>(() => loadHistoryGames());
  const [currentGame, setCurrentGame] = useState<Game | null>(() => loadCurrentGame());

  useEffect(() => {
    saveHistoryGames(historyGames);
  }, [historyGames]);

  useEffect(() => {
    saveCurrentGame(currentGame);
  }, [currentGame]);

  const sortedGames = useMemo(
    () => [...historyGames].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [historyGames],
  );

  const navigate = (nextView: ViewName) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createCurrentGame = (game: Game) => {
    setCurrentGame(game);
    navigate('current');
  };

  const saveToHistory = (game: Game) => {
    setHistoryGames((games) => upsertHistoryGame(games, game));
    setCurrentGame({ ...game, status: 'settled' });
    window.alert('已保存到历史牌局。');
  };

  const deleteHistoryGame = (gameId: string) => {
    setHistoryGames((games) => games.filter((game) => game.id !== gameId));
  };

  const page = (() => {
    switch (view) {
      case 'new':
        return <NewGame onCreate={createCurrentGame} onCancel={() => navigate('dashboard')} />;
      case 'current':
        return <GameEditor game={currentGame} onUpdate={setCurrentGame} onNavigate={navigate} />;
      case 'settlement':
        return <Settlement game={currentGame} onSaveToHistory={saveToHistory} onNavigate={navigate} />;
      case 'history':
        return <History games={sortedGames} onDelete={deleteHistoryGame} />;
      case 'stats':
        return <Stats games={sortedGames} />;
      case 'dashboard':
      default:
        return <Dashboard games={sortedGames} onNavigate={navigate} />;
    }
  })();

  return (
    <div className="min-h-screen bg-felt-950 text-stone-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,181,109,0.14),transparent_32%),linear-gradient(160deg,rgba(22,163,74,0.10),transparent_44%)]" />
      <main className="relative mx-auto min-h-screen max-w-2xl px-4 pb-28 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-6">
        {page}
      </main>
      <BottomNav view={view} hasCurrentGame={Boolean(currentGame)} onNavigate={navigate} />
    </div>
  );
}
