import type { ChipRate, CurrencyCode, Game, Player, Rebuy } from '../types';

export const currencySymbols: Record<CurrencyCode, string> = {
  CNY: '¥',
  USD: '$',
  HKD: 'HK$',
};

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDefaultChipRate(): ChipRate {
  return {
    currency: 'CNY',
    currencySymbol: '¥',
    chipsPerMoneyUnit: 10,
    chipValueInMoney: 0.1,
  };
}

export function createPlayer(index: number): Player {
  return {
    id: createId('player'),
    name: `玩家 ${index}`,
    initialBuyInChips: 1000,
    rebuys: [],
    finalChips: 1000,
  };
}

export function createRebuy(chips = 500): Rebuy {
  return {
    id: createId('rebuy'),
    chips,
    createdAt: new Date().toISOString(),
  };
}

export function createGame(partial?: Partial<Game>): Game {
  const now = new Date().toISOString();
  return {
    id: createId('game'),
    name: partial?.name ?? `朋友局 ${new Date().toLocaleDateString('zh-CN')}`,
    note: partial?.note ?? '',
    date: partial?.date ?? now,
    chipRate: partial?.chipRate ?? createDefaultChipRate(),
    players: partial?.players ?? [createPlayer(1), createPlayer(2), createPlayer(3), createPlayer(4)],
    createdAt: partial?.createdAt ?? now,
    updatedAt: now,
    status: partial?.status ?? 'draft',
  };
}

export function syncChipRateFromChipsPerMoneyUnit(chipsPerMoneyUnit: number, chipRate: ChipRate): ChipRate {
  const safeChipsPerMoneyUnit = Number.isFinite(chipsPerMoneyUnit) && chipsPerMoneyUnit > 0 ? chipsPerMoneyUnit : 1;
  return {
    ...chipRate,
    chipsPerMoneyUnit: safeChipsPerMoneyUnit,
    chipValueInMoney: Math.round((1 / safeChipsPerMoneyUnit + Number.EPSILON) * 1000000) / 1000000,
  };
}

export function syncChipRateFromChipValue(chipValueInMoney: number, chipRate: ChipRate): ChipRate {
  const safeChipValue = Number.isFinite(chipValueInMoney) && chipValueInMoney > 0 ? chipValueInMoney : 1;
  return {
    ...chipRate,
    chipValueInMoney: safeChipValue,
    chipsPerMoneyUnit: Math.round((1 / safeChipValue + Number.EPSILON) * 1000000) / 1000000,
  };
}

export function withUpdatedTimestamp(game: Game): Game {
  return {
    ...game,
    updatedAt: new Date().toISOString(),
  };
}
