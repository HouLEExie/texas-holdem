import { BarChart3, Plus, Trophy } from 'lucide-react';
import type { Game } from '../types';
import type { ViewName } from '../views';
import {
  formatCurrency,
  formatUnsignedCurrency,
  getGameTotalBuyInAmount,
  getPlayerStats,
} from '../lib/calculations';
import { formatDateTime } from '../lib/date';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Metric } from '../components/Metric';
import { Section } from '../components/Section';

interface DashboardProps {
  games: Game[];
  onNavigate: (view: ViewName) => void;
}

export function Dashboard({ games, onNavigate }: DashboardProps) {
  const stats = getPlayerStats(games);
  const totalPlayers = new Set(games.flatMap((game) => game.players.map((player) => player.name.trim()).filter(Boolean))).size;
  const totalBuyInAmount = games.reduce((sum, game) => sum + getGameTotalBuyInAmount(game), 0);
  const topPlayers = stats.slice(0, 3);
  const currencyRate = games[0]?.chipRate ?? {
    currency: 'CNY' as const,
    currencySymbol: '¥',
    chipsPerMoneyUnit: 10,
    chipValueInMoney: 0.1,
  };

  return (
    <div className="space-y-5">
      <section className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tableGold">Poker Ledger</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-stone-50">德州牌局结算器</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-stone-400">筹码、买入、盈亏、排名和转账建议，一局结束就能发群。</p>
          </div>
          <div className="hidden h-16 w-16 shrink-0 place-items-center rounded-full border border-tableGold/40 bg-tableGold/10 text-tableGold sm:grid">
            <Trophy className="h-8 w-8" aria-hidden="true" />
          </div>
        </div>
        <Button className="mt-5 w-full" icon={<Plus className="h-5 w-5" />} onClick={() => onNavigate('new')}>
          新建牌局
        </Button>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="总牌局数" value={games.length} tone="gold" />
        <Metric label="总玩家数" value={totalPlayers} />
        <Metric label="历史总买入" value={formatUnsignedCurrency(totalBuyInAmount, currencyRate)} />
        <Metric label="排行榜入口" value="长期统计" tone="profit" />
      </div>

      <Section
        title="最近牌局"
        action={
          games.length ? (
            <Button variant="ghost" className="min-h-9 px-3 py-1 text-xs" onClick={() => onNavigate('history')}>
              查看全部
            </Button>
          ) : null
        }
      >
        {games.length ? (
          <div className="space-y-2">
            {games.slice(0, 5).map((game) => (
              <button
                key={game.id}
                type="button"
                className="w-full rounded-lg border border-white/10 bg-black/15 p-3 text-left transition hover:border-tableGold/40"
                onClick={() => onNavigate('history')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-stone-100">{game.name}</p>
                    <p className="mt-1 text-xs text-stone-500">{formatDateTime(game.date)}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-tableGold">
                    {formatUnsignedCurrency(getGameTotalBuyInAmount(game), game.chipRate)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="还没有历史牌局" description="创建第一场牌局后，历史记录、长期统计和复制结算都会自动可用。" />
        )}
      </Section>

      <Section
        title="历史总盈亏榜"
        action={
          <Button variant="ghost" className="min-h-9 px-3 py-1 text-xs" icon={<BarChart3 className="h-4 w-4" />} onClick={() => onNavigate('stats')}>
            统计
          </Button>
        }
      >
        {topPlayers.length ? (
          <div className="space-y-2">
            {topPlayers.map((player, index) => (
              <div key={player.playerName} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/15 p-3">
                <div>
                  <p className="font-bold text-stone-100">
                    {index + 1}. {player.playerName}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">{player.gamesPlayed} 场</p>
                </div>
                <p className={`font-black ${player.totalProfitLossAmount >= 0 ? 'text-chip-300' : 'text-red-300'}`}>
                  {formatCurrency(player.totalProfitLossAmount, currencyRate)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="暂无玩家统计" description="保存结算后的牌局会自动进入长期盈亏排行榜。" />
        )}
      </Section>
    </div>
  );
}
