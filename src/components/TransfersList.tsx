import { ArrowRightLeft } from 'lucide-react';
import type { Game } from '../types';
import { formatUnsignedCurrency, formatUnsignedChips, getSettlementTransfers } from '../lib/calculations';
import { EmptyState } from './EmptyState';

interface TransfersListProps {
  game: Game;
}

export function TransfersList({ game }: TransfersListProps) {
  const transfers = getSettlementTransfers(game);

  if (!transfers.length) {
    return <EmptyState title="无需转账" description="当前没有可匹配的输赢转账，或所有玩家盈亏为 0。" />;
  }

  return (
    <div className="space-y-2">
      {transfers.map((transfer, index) => (
        <div key={`${transfer.fromPlayerId}-${transfer.toPlayerId}-${index}`} className="rounded-lg border border-white/10 bg-black/15 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-tableGold/30 bg-tableGold/10 text-tableGold">
              <ArrowRightLeft className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-stone-300">
                <span className="font-bold text-red-200">{transfer.fromPlayerName}</span>
                <span className="mx-2 text-stone-500">支付</span>
                <span className="font-bold text-chip-300">{transfer.toPlayerName}</span>
              </p>
              <p className="mt-1 text-lg font-black text-stone-50">
                {formatUnsignedChips(transfer.chips)} / {formatUnsignedCurrency(transfer.amount, game.chipRate)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
