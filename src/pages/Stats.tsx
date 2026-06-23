import { Medal } from 'lucide-react';
import type { ChipRate, Game, PlayerStats } from '../types';
import { formatChips, formatCurrency, formatUnsignedCurrency, formatUnsignedChips, getPlayerStats } from '../lib/calculations';
import { EmptyState } from '../components/EmptyState';
import { Metric } from '../components/Metric';

interface StatsProps {
  games: Game[];
}

const defaultRate: ChipRate = {
  currency: 'CNY',
  currencySymbol: '¥',
  chipsPerMoneyUnit: 10,
  chipValueInMoney: 0.1,
};

function rankTone(index: number): string {
  if (index === 0) return 'border-tableGold/60 bg-tableGold/10 text-tableGold';
  if (index === 1) return 'border-tableSilver/60 bg-tableSilver/10 text-tableSilver';
  if (index === 2) return 'border-tableBronze/60 bg-tableBronze/10 text-tableBronze';
  return 'border-white/10 bg-white/5 text-stone-300';
}

function StatDetail({ stat, chipRate, index }: { stat: PlayerStats; chipRate: ChipRate; index: number }) {
  const profitTone = stat.totalProfitLossAmount > 0 ? 'profit' : stat.totalProfitLossAmount < 0 ? 'loss' : 'neutral';

  return (
    <article className="rounded-lg border border-white/10 bg-felt-850 p-4 shadow-glow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${rankTone(index)}`}>
            <Medal className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-stone-50">{stat.playerName}</h2>
            <p className="mt-1 text-xs text-stone-500">{stat.gamesPlayed} 场牌局</p>
          </div>
        </div>
        <p className={`shrink-0 text-right text-lg font-black ${profitTone === 'profit' ? 'text-chip-300' : profitTone === 'loss' ? 'text-red-300' : 'text-stone-400'}`}>
          {formatCurrency(stat.totalProfitLossAmount, chipRate)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="总买入筹码" value={formatUnsignedChips(stat.totalBuyInChips)} />
        <Metric label="总买入金额" value={formatUnsignedCurrency(stat.totalBuyInAmount, chipRate)} />
        <Metric label="总结束筹码" value={formatUnsignedChips(stat.totalFinalChips)} />
        <Metric label="总结束金额" value={formatUnsignedCurrency(stat.totalFinalAmount, chipRate)} />
        <Metric label="总盈亏筹码" value={formatChips(stat.totalProfitLossChips)} tone={profitTone} />
        <Metric label="总盈亏金额" value={formatCurrency(stat.totalProfitLossAmount, chipRate)} tone={profitTone} />
        <Metric label="场均盈亏" value={formatCurrency(stat.averageProfitLossAmount, chipRate)} tone={profitTone} />
        <Metric label="最大盈利" value={formatCurrency(stat.bestGameAmount, chipRate)} tone={stat.bestGameAmount > 0 ? 'profit' : 'neutral'} />
        <Metric label="最大亏损" value={formatCurrency(stat.worstGameAmount, chipRate)} tone={stat.worstGameAmount < 0 ? 'loss' : 'neutral'} />
        <Metric label="胜 / 负 / 平" value={`${stat.winningGames} / ${stat.losingGames} / ${stat.breakEvenGames}`} tone="gold" />
      </div>
    </article>
  );
}

export function Stats({ games }: StatsProps) {
  const stats = getPlayerStats(games);
  const chipRate = games[0]?.chipRate ?? defaultRate;

  if (!stats.length) {
    return <EmptyState title="暂无玩家统计" description="保存历史牌局后，会按玩家姓名自动聚合长期盈亏、胜负和平局数据。" />;
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tableGold">Player Stats</p>
        <h1 className="mt-2 text-2xl font-black text-stone-50">玩家长期统计</h1>
      </header>

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <StatDetail key={stat.playerName} stat={stat} chipRate={chipRate} index={index} />
        ))}
      </div>
    </div>
  );
}
