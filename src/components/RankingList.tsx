import { Award } from 'lucide-react';
import type { ChipRate, Game, RankingEntry } from '../types';
import { formatCurrency, formatChips, formatUnsignedCurrency, getRanking } from '../lib/calculations';

interface RankingListProps {
  game: Game;
  compact?: boolean;
}

function medalClass(rank: number): string {
  if (rank === 1) return 'border-tableGold/60 bg-tableGold/10 text-tableGold';
  if (rank === 2) return 'border-tableSilver/60 bg-tableSilver/10 text-tableSilver';
  if (rank === 3) return 'border-tableBronze/60 bg-tableBronze/10 text-tableBronze';
  return 'border-white/10 bg-white/5 text-stone-300';
}

function valueClass(value: number): string {
  if (value > 0) return 'text-chip-300';
  if (value < 0) return 'text-red-300';
  return 'text-stone-400';
}

function RankingRow({ entry, compact, chipRate }: { entry: RankingEntry; compact?: boolean; chipRate: ChipRate }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/15 p-3">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border font-black ${medalClass(entry.rank)}`}>
        {entry.rank <= 3 ? <Award className="h-5 w-5" aria-hidden="true" /> : entry.rank}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate font-bold text-stone-100">{entry.player.name || '未命名玩家'}</p>
          <p className={`shrink-0 text-right font-extrabold ${valueClass(entry.profitLossChips)}`}>
            {formatCurrency(entry.profitLossAmount, chipRate)}
          </p>
        </div>
        <p className={`mt-1 text-sm font-semibold ${valueClass(entry.profitLossChips)}`}>{formatChips(entry.profitLossChips)}</p>
        {!compact ? (
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-stone-400">
            <span>买入 {entry.totalBuyInChips.toLocaleString('zh-CN')} 筹码</span>
            <span>结束 {entry.finalChips.toLocaleString('zh-CN')} 筹码</span>
            <span>买入金额 {formatUnsignedCurrency(entry.totalBuyInAmount, chipRate)}</span>
            <span>结束金额 {formatUnsignedCurrency(entry.finalAmount, chipRate)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function RankingList({ game, compact = false }: RankingListProps) {
  const ranking = getRanking(game);

  return (
    <div className="space-y-2">
      {ranking.map((entry) => (
        <RankingRow key={entry.player.id} entry={entry} compact={compact} chipRate={game.chipRate} />
      ))}
    </div>
  );
}
