import { Plus, Trash2, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Game, Player } from '../types';
import { createGame, createPlayer, withUpdatedTimestamp } from '../lib/gameFactory';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '../lib/date';
import { Button } from '../components/Button';
import { ChipRateEditor } from '../components/ChipRateEditor';
import { NumberField } from '../components/NumberField';
import { Section } from '../components/Section';

interface NewGameProps {
  onCreate: (game: Game) => void;
  onCancel: () => void;
}

export function NewGame({ onCreate, onCancel }: NewGameProps) {
  const initialGame = useMemo(() => createGame(), []);
  const [game, setGame] = useState<Game>(initialGame);

  const updatePlayer = (player: Player) => {
    setGame((current) => ({
      ...current,
      players: current.players.map((entry) => (entry.id === player.id ? player : entry)),
    }));
  };

  const removePlayer = (playerId: string) => {
    if (game.players.length <= 2) {
      window.alert('至少保留 2 位玩家。');
      return;
    }
    if (window.confirm('确认删除这位玩家吗？')) {
      setGame((current) => ({ ...current, players: current.players.filter((player) => player.id !== playerId) }));
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tableGold">New Session</p>
        <h1 className="mt-2 text-2xl font-black text-stone-50">新建牌局</h1>
      </header>

      <Section title="牌局信息">
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-stone-300">牌局名称</span>
            <input
              className="min-h-12 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-base font-semibold text-stone-50 outline-none focus:border-tableGold/70"
              value={game.name}
              onChange={(event) => setGame({ ...game, name: event.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-stone-300">日期时间</span>
            <input
              type="datetime-local"
              className="min-h-12 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-base font-semibold text-stone-50 outline-none focus:border-tableGold/70"
              value={toDateTimeLocalValue(game.date)}
              onChange={(event) => setGame({ ...game, date: fromDateTimeLocalValue(event.target.value) })}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-stone-300">备注</span>
            <textarea
              className="min-h-24 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-base text-stone-50 outline-none focus:border-tableGold/70"
              value={game.note}
              placeholder="地点、盲注、特殊说明"
              onChange={(event) => setGame({ ...game, note: event.target.value })}
            />
          </label>
        </div>
      </Section>

      <Section title="筹码金额换算设置">
        <ChipRateEditor chipRate={game.chipRate} onChange={(chipRate) => setGame({ ...game, chipRate })} />
      </Section>

      <Section
        title="玩家"
        action={
          <Button
            variant="secondary"
            className="min-h-9 px-3 py-1 text-xs"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setGame((current) => ({ ...current, players: [...current.players, createPlayer(current.players.length + 1)] }))}
          >
            添加
          </Button>
        }
      >
        <div className="space-y-3">
          {game.players.map((player, index) => (
            <div key={player.id} className="rounded-lg border border-white/10 bg-black/15 p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-stone-100">
                  <UsersRound className="h-4 w-4 text-tableGold" />
                  玩家 {index + 1}
                </div>
                <button
                  type="button"
                  aria-label="删除玩家"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-red-500/25 bg-red-500/10 text-red-300"
                  onClick={() => removePlayer(player.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-stone-300">姓名</span>
                  <input
                    className="min-h-12 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-base font-semibold text-stone-50 outline-none focus:border-tableGold/70"
                    value={player.name}
                    onChange={(event) => updatePlayer({ ...player, name: event.target.value })}
                  />
                </label>
                <NumberField
                  label="默认首次买入"
                  value={player.initialBuyInChips}
                  suffix="筹码"
                  onChange={(value) => updatePlayer({ ...player, initialBuyInChips: value, finalChips: value })}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="ghost" onClick={onCancel}>
          取消
        </Button>
        <Button
          onClick={() =>
            onCreate(
              withUpdatedTimestamp({
                ...game,
                players: game.players.map((player, index) => ({
                  ...player,
                  name: player.name.trim() || `玩家 ${index + 1}`,
                })),
              }),
            )
          }
        >
          开始牌局
        </Button>
      </div>
    </div>
  );
}
