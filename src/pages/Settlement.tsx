import { Check, Clipboard, Save } from 'lucide-react';
import { useState } from 'react';
import type { Game } from '../types';
import type { ViewName } from '../views';
import { copyText } from '../lib/clipboard';
import {
  formatUnsignedCurrency,
  generateSettlementText,
} from '../lib/calculations';
import { withUpdatedTimestamp } from '../lib/gameFactory';
import { AuditPanel } from '../components/AuditPanel';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { RankingList } from '../components/RankingList';
import { Section } from '../components/Section';
import { TransfersList } from '../components/TransfersList';

interface SettlementProps {
  game: Game | null;
  onSaveToHistory: (game: Game) => void;
  onNavigate: (view: ViewName) => void;
}

export function Settlement({ game, onSaveToHistory, onNavigate }: SettlementProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  if (!game) {
    return (
      <EmptyState
        title="还没有可结算的牌局"
        description="创建或打开当前牌局后，结算页会自动生成排名、校验和转账建议。"
        action={<Button onClick={() => onNavigate('new')}>新建牌局</Button>}
      />
    );
  }

  const handleCopy = async () => {
    await copyText(generateSettlementText(game));
    setCopyState('copied');
    window.setTimeout(() => setCopyState('idle'), 1800);
  };

  const handleSave = () => {
    onSaveToHistory(withUpdatedTimestamp({ ...game, status: 'settled' }));
  };

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tableGold">Settlement</p>
        <h1 className="mt-2 text-2xl font-black text-stone-50">牌局结算</h1>
        <p className="mt-2 text-sm text-stone-400">{game.name}</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={copyState === 'copied' ? 'secondary' : 'ghost'}
          icon={copyState === 'copied' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          onClick={handleCopy}
        >
          {copyState === 'copied' ? '已复制' : '复制结果'}
        </Button>
        <Button icon={<Save className="h-4 w-4" />} onClick={handleSave}>
          保存到历史
        </Button>
      </div>

      <Section title="筹码比例">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-white/10 bg-black/15 p-3">
            <p className="text-stone-400">1 元</p>
            <p className="mt-1 text-lg font-black text-tableGold">{game.chipRate.chipsPerMoneyUnit.toLocaleString('zh-CN')} 筹码</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/15 p-3">
            <p className="text-stone-400">1 筹码</p>
            <p className="mt-1 text-lg font-black text-tableGold">
              {formatUnsignedCurrency(game.chipRate.chipValueInMoney, game.chipRate)}
            </p>
          </div>
        </div>
      </Section>

      <Section title="最终排名">
        <RankingList game={game} />
      </Section>

      <Section title="总买入校验">
        <AuditPanel game={game} />
      </Section>

      <Section title="自动转账建议">
        <TransfersList game={game} />
      </Section>
    </div>
  );
}
