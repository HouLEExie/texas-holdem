import { Plus, RotateCcw, Save, Send } from 'lucide-react';
import type { Game, Player } from '../types';
import type { ViewName } from '../views';
import { createPlayer, withUpdatedTimestamp } from '../lib/gameFactory';
import { AuditPanel } from '../components/AuditPanel';
import { Button } from '../components/Button';
import { ChipRateEditor } from '../components/ChipRateEditor';
import { EmptyState } from '../components/EmptyState';
import { PlayerCard } from '../components/PlayerCard';
import { RankingList } from '../components/RankingList';
import { Section } from '../components/Section';

interface GameEditorProps {
  game: Game | null;
  onUpdate: (game: Game | null) => void;
  onNavigate: (view: ViewName) => void;
}

export function GameEditor({ game, onUpdate, onNavigate }: GameEditorProps) {
  if (!game) {
    return (
      <EmptyState
        title="当前没有进行中的牌局"
        description="先创建一场新牌局，再回来录入买入、加买和结束筹码。"
        action={<Button onClick={() => onNavigate('new')}>新建牌局</Button>}
      />
    );
  }

  const updateGame = (nextGame: Game) => {
    onUpdate(withUpdatedTimestamp(nextGame));
  };

  const updatePlayer = (player: Player) => {
    updateGame({
      ...game,
      players: game.players.map((entry) => (entry.id === player.id ? player : entry)),
    });
  };

  const deletePlayer = (playerId: string) => {
    if (game.players.length <= 2) {
      window.alert('至少保留 2 位玩家。');
      return;
    }

    if (window.confirm('确认删除这位玩家吗？')) {
      updateGame({
        ...game,
        players: game.players.filter((player) => player.id !== playerId),
      });
    }
  };

  const resetGame = () => {
    if (window.confirm('确认重置本局吗？所有当前录入会被清空。')) {
      onUpdate(null);
      onNavigate('dashboard');
    }
  };

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tableGold">Current Session</p>
          <h1 className="mt-2 text-2xl font-black text-stone-50">{game.name}</h1>
          {game.note ? <p className="mt-2 text-sm leading-6 text-stone-400">{game.note}</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" icon={<Save className="h-4 w-4" />} onClick={() => onUpdate(withUpdatedTimestamp(game))}>
            保存牌局
          </Button>
          <Button icon={<Send className="h-4 w-4" />} onClick={() => onNavigate('settlement')}>
            进入结算
          </Button>
        </div>
      </header>

      <Section title="筹码金额换算">
        <ChipRateEditor chipRate={game.chipRate} onChange={(chipRate) => updateGame({ ...game, chipRate })} />
      </Section>

      <Section
        title="玩家录入"
        action={
          <Button
            variant="secondary"
            className="min-h-9 px-3 py-1 text-xs"
            icon={<Plus className="h-4 w-4" />}
            onClick={() =>
              updateGame({
                ...game,
                players: [...game.players, createPlayer(game.players.length + 1)],
              })
            }
          >
            添加玩家
          </Button>
        }
      >
        <div className="space-y-4">
          {game.players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              chipRate={game.chipRate}
              index={index}
              onChange={updatePlayer}
              onDelete={() => deletePlayer(player.id)}
            />
          ))}
        </div>
      </Section>

      <Section title="实时排名">
        <RankingList game={game} compact />
      </Section>

      <Section title="筹码总量校验">
        <AuditPanel game={game} />
      </Section>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="danger" icon={<RotateCcw className="h-4 w-4" />} onClick={resetGame}>
          重置本局
        </Button>
        <Button icon={<Send className="h-4 w-4" />} onClick={() => onNavigate('settlement')}>
          结算
        </Button>
      </div>
    </div>
  );
}
