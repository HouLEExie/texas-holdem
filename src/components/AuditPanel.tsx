import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Game } from '../types';
import {
  formatCurrency,
  formatChips,
  formatUnsignedCurrency,
  formatUnsignedChips,
  getGameChipDifference,
  getGameFinalAmountTotal,
  getGameFinalChipsTotal,
  getGameMoneyDifference,
  getGameTotalBuyInAmount,
  getGameTotalBuyInChips,
} from '../lib/calculations';
import { Metric } from './Metric';

interface AuditPanelProps {
  game: Game;
}

export function AuditPanel({ game }: AuditPanelProps) {
  const chipDifference = getGameChipDifference(game);
  const moneyDifference = getGameMoneyDifference(game);
  const isBalanced = chipDifference === 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="总买入筹码" value={formatUnsignedChips(getGameTotalBuyInChips(game))} />
        <Metric label="总买入金额" value={formatUnsignedCurrency(getGameTotalBuyInAmount(game), game.chipRate)} />
        <Metric label="结束总筹码" value={formatUnsignedChips(getGameFinalChipsTotal(game))} />
        <Metric label="结束总金额" value={formatUnsignedCurrency(getGameFinalAmountTotal(game), game.chipRate)} />
        <Metric
          label="筹码差额"
          tone={isBalanced ? 'profit' : 'loss'}
          value={formatChips(chipDifference)}
        />
        <Metric
          label="金额差额"
          tone={isBalanced ? 'profit' : 'loss'}
          value={formatCurrency(moneyDifference, game.chipRate)}
        />
      </div>

      <div
        className={`flex items-start gap-3 rounded-lg border p-3 ${
          isBalanced
            ? 'border-chip-400/30 bg-chip-500/10 text-chip-300'
            : 'border-tableRed/40 bg-tableRed/10 text-red-200'
        }`}
      >
        {isBalanced ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertTriangle className="mt-0.5 h-5 w-5" />}
        <p className="text-sm font-semibold leading-6">
          {isBalanced ? '结算正确，筹码总量一致。' : '筹码总量不一致，请检查是否有人买入、加买或结束筹码录入错误。'}
        </p>
      </div>
    </div>
  );
}
