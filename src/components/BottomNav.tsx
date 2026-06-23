import { BarChart3, ClipboardList, History, Home } from 'lucide-react';
import type { ViewName } from '../views';

interface BottomNavProps {
  view: ViewName;
  onNavigate: (view: ViewName) => void;
  hasCurrentGame: boolean;
}

const navItems: Array<{ view: ViewName; label: string; icon: typeof Home }> = [
  { view: 'dashboard', label: '首页', icon: Home },
  { view: 'current', label: '当前牌局', icon: ClipboardList },
  { view: 'history', label: '历史', icon: History },
  { view: 'stats', label: '统计', icon: BarChart3 },
];

export function BottomNav({ view, onNavigate, hasCurrentGame }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-felt-950/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur">
      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.view || (item.view === 'current' && view === 'settlement');
          const disabled = item.view === 'current' && !hasCurrentGame;
          return (
            <button
              key={item.view}
              type="button"
              disabled={disabled}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold transition ${
                active
                  ? 'bg-tableGold/15 text-tableGold'
                  : disabled
                    ? 'text-stone-700'
                    : 'text-stone-400 hover:bg-white/5 hover:text-stone-100'
              }`}
              onClick={() => onNavigate(item.view)}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
