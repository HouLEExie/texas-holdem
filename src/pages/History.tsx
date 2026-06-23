import { Check, Clipboard, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Game } from '../types';
import { copyText } from '../lib/clipboard';
import { formatUnsignedCurrency, generateSettlementText, getGameTotalBuyInAmount } from '../lib/calculations';
import { formatDateTime } from '../lib/date';
import { AuditPanel } from '../components/AuditPanel';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { RankingList } from '../components/RankingList';
import { TransfersList } from '../components/TransfersList';

interface HistoryProps {
  games: Game[];
  onDelete: (gameId: string) => void;
}

export function History({ games, onDelete }: HistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(games[0]?.id ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyGame = async (game: Game) => {
    await copyText(generateSettlementText(game));
    setCopiedId(game.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  if (!games.length) {
    return <EmptyState title="暂无历史牌局" description="在结算页点击保存到历史后，这里会显示所有已结算牌局。" />;
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tableGold">History</p>
        <h1 className="mt-2 text-2xl font-black text-stone-50">历史牌局</h1>
      </header>

      <div className="space-y-3">
        {games.map((game) => {
          const expanded = expandedId === game.id;
          return (
            <article key={game.id} className="rounded-lg border border-white/10 bg-felt-850 p-4 shadow-glow">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black text-stone-50">{game.name}</h2>
                  <p className="mt-1 text-xs text-stone-500">{formatDateTime(game.date)}</p>
                  <p className="mt-2 text-sm font-semibold text-tableGold">
                    总买入 {formatUnsignedCurrency(getGameTotalBuyInAmount(game), game.chipRate)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label="查看详情"
                    className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-stone-300"
                    onClick={() => setExpandedId(expanded ? null : game.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="删除历史牌局"
                    className="grid h-10 w-10 place-items-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-300"
                    onClick={() => {
                      if (window.confirm('确认删除这场历史牌局吗？')) onDelete(game.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <Button
                  variant={copiedId === game.id ? 'secondary' : 'ghost'}
                  icon={copiedId === game.id ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  onClick={() => copyGame(game)}
                >
                  {copiedId === game.id ? '已复制' : '复制结算'}
                </Button>
                <Button variant="ghost" icon={<Eye className="h-4 w-4" />} onClick={() => setExpandedId(expanded ? null : game.id)}>
                  {expanded ? '收起详情' : '查看详情'}
                </Button>
              </div>

              {expanded ? (
                <div className="mt-5 space-y-5">
                  {game.note ? (
                    <div className="rounded-lg border border-white/10 bg-black/15 p-3 text-sm leading-6 text-stone-300">{game.note}</div>
                  ) : null}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-stone-200">最终排名</h3>
                    <RankingList game={game} />
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-stone-200">总量校验</h3>
                    <AuditPanel game={game} />
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-stone-200">转账建议</h3>
                    <TransfersList game={game} />
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
