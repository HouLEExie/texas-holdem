import { Plus, Trash2, UserRound } from 'lucide-react';
import type { ChipRate, Player } from '../types';
import {
  formatCurrency,
  formatChips,
  formatUnsignedCurrency,
  formatUnsignedChips,
  getPlayerBuyInAmount,
  getPlayerFinalAmount,
  getPlayerProfitLossAmount,
  getPlayerProfitLossChips,
  getTotalBuyInChips,
} from '../lib/calculations';
import { createRebuy } from '../lib/gameFactory';
import { Button } from './Button';
import { Metric } from './Metric';
import { NumberField } from './NumberField';

interface PlayerCardProps {
  player: Player;
  chipRate: ChipRate;
  index: number;
  onChange: (player: Player) => void;
  onDelete: () => void;
}

function profitTone(value: number): 'profit' | 'loss' | 'neutral' {
  if (value > 0) return 'profit';
  if (value < 0) return 'loss';
  return 'neutral';
}

export function PlayerCard({ player, chipRate, index, onChange, onDelete }: PlayerCardProps) {
  const profitLossChips = getPlayerProfitLossChips(player);
  const profitLossAmount = getPlayerProfitLossAmount(player, chipRate);
  const totalBuyInChips = getTotalBuyInChips(player);

  return (
    <article className="rounded-lg border border-white/10 bg-felt-850 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-tableGold/40 bg-tableGold/10 text-tableGold">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-stone-400">玩家 {index + 1}</p>
            <input
              className="mt-1 w-full bg-transparent text-lg font-bold text-stone-50 outline-none placeholder:text-stone-500"
              value={player.name}
              placeholder="玩家姓名"
              onChange={(event) => onChange({ ...player, name: event.target.value })}
            />
          </div>
        </div>
        <button
          type="button"
          aria-label="删除玩家"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-300"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField
          label="首次买入"
          value={player.initialBuyInChips}
          suffix="筹码"
          onChange={(value) => onChange({ ...player, initialBuyInChips: value })}
        />
        <NumberField
          label="结束持有"
          value={player.finalChips}
          suffix="筹码"
          onChange={(value) => onChange({ ...player, finalChips: value })}
        />
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-black/15 p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-stone-200">后续加买</h3>
          <Button
            variant="secondary"
            className="min-h-9 px-3 py-1 text-xs"
            icon={<Plus className="h-4 w-4" aria-hidden="true" />}
            onClick={() => onChange({ ...player, rebuys: [...player.rebuys, createRebuy()] })}
          >
            加买
          </Button>
        </div>

        {player.rebuys.length ? (
          <div className="mt-3 space-y-2">
            {player.rebuys.map((rebuy, rebuyIndex) => (
              <div key={rebuy.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <NumberField
                    label={`加买 ${rebuyIndex + 1}`}
                    value={rebuy.chips}
                    suffix="筹码"
                    onChange={(value) =>
                      onChange({
                        ...player,
                        rebuys: player.rebuys.map((entry) => (entry.id === rebuy.id ? { ...entry, chips: value } : entry)),
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  aria-label="删除加买记录"
                  className="mb-0 grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-red-500/25 bg-red-500/10 text-red-300"
                  onClick={() => {
                    if (window.confirm('确认删除这条加买记录吗？')) {
                      onChange({ ...player, rebuys: player.rebuys.filter((entry) => entry.id !== rebuy.id) });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-stone-500">暂无加买记录。</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="总买入" value={formatUnsignedChips(totalBuyInChips)} />
        <Metric label="买入金额" value={formatUnsignedCurrency(getPlayerBuyInAmount(player, chipRate), chipRate)} />
        <Metric label="结束金额" value={formatUnsignedCurrency(getPlayerFinalAmount(player, chipRate), chipRate)} />
        <Metric
          label="盈亏"
          tone={profitTone(profitLossChips)}
          value={
            <>
              {formatChips(profitLossChips)}
              <span className="block text-sm">{formatCurrency(profitLossAmount, chipRate)}</span>
            </>
          }
        />
      </div>
    </article>
  );
}
