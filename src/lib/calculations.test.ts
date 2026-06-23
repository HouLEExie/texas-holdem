import { describe, expect, it } from 'vitest';
import type { Game } from '../types';
import {
  chipsToMoney,
  generateSettlementText,
  getGameChipDifference,
  getGameFinalAmountTotal,
  getGameFinalChipsTotal,
  getGameMoneyDifference,
  getGameTotalBuyInAmount,
  getGameTotalBuyInChips,
  getPlayerProfitLossAmount,
  getPlayerProfitLossChips,
  getPlayerStats,
  getRanking,
  getSettlementTransfers,
  moneyToChips,
} from './calculations';

const baseGame: Game = {
  id: 'game-1',
  name: '测试牌局',
  date: '2026-06-23T12:00:00.000Z',
  note: '',
  chipRate: {
    currency: 'CNY',
    currencySymbol: '¥',
    chipsPerMoneyUnit: 10,
    chipValueInMoney: 0.1,
  },
  players: [
    {
      id: 'a',
      name: 'A',
      initialBuyInChips: 1000,
      rebuys: [],
      finalChips: 1800,
    },
    {
      id: 'b',
      name: 'B',
      initialBuyInChips: 1000,
      rebuys: [{ id: 'b-r1', chips: 500, createdAt: '2026-06-23T12:10:00.000Z' }],
      finalChips: 900,
    },
    {
      id: 'c',
      name: 'C',
      initialBuyInChips: 1000,
      rebuys: [],
      finalChips: 800,
    },
  ],
  createdAt: '2026-06-23T12:00:00.000Z',
  updatedAt: '2026-06-23T12:00:00.000Z',
  status: 'settled',
};

describe('核心结算函数', () => {
  it('计算玩家盈亏、总买入、总结束筹码和转账建议', () => {
    const [a, b, c] = baseGame.players;

    expect(getPlayerProfitLossChips(a)).toBe(800);
    expect(getPlayerProfitLossAmount(a, baseGame.chipRate)).toBe(80);
    expect(getPlayerProfitLossChips(b)).toBe(-600);
    expect(getPlayerProfitLossAmount(b, baseGame.chipRate)).toBe(-60);
    expect(getPlayerProfitLossChips(c)).toBe(-200);
    expect(getPlayerProfitLossAmount(c, baseGame.chipRate)).toBe(-20);

    expect(getGameTotalBuyInChips(baseGame)).toBe(3500);
    expect(getGameTotalBuyInAmount(baseGame)).toBe(350);
    expect(getGameFinalChipsTotal(baseGame)).toBe(3500);
    expect(getGameFinalAmountTotal(baseGame)).toBe(350);
    expect(getGameChipDifference(baseGame)).toBe(0);
    expect(getGameMoneyDifference(baseGame)).toBe(0);

    expect(getRanking(baseGame).map((entry) => entry.player.name)).toEqual(['A', 'C', 'B']);
    expect(getSettlementTransfers(baseGame)).toEqual([
      {
        fromPlayerId: 'b',
        fromPlayerName: 'B',
        toPlayerId: 'a',
        toPlayerName: 'A',
        chips: 600,
        amount: 60,
      },
      {
        fromPlayerId: 'c',
        fromPlayerName: 'C',
        toPlayerId: 'a',
        toPlayerName: 'A',
        chips: 200,
        amount: 20,
      },
    ]);
  });

  it('返回筹码差额并可用于 UI 警告', () => {
    const brokenGame: Game = {
      ...baseGame,
      players: baseGame.players.map((player) => (player.id === 'c' ? { ...player, finalChips: 700 } : player)),
    };

    expect(getGameChipDifference(brokenGame)).toBe(-100);
    expect(getGameMoneyDifference(brokenGame)).toBe(-10);
    expect(generateSettlementText(brokenGame)).toContain('筹码总量不一致');
  });

  it('支持小数金额换算', () => {
    const halfYuanRate = {
      currency: 'CNY' as const,
      currencySymbol: '¥',
      chipsPerMoneyUnit: 2,
      chipValueInMoney: 0.5,
    };

    expect(chipsToMoney(120, halfYuanRate)).toBe(60);
    expect(moneyToChips(60, halfYuanRate)).toBe(120);
  });

  it('聚合长期玩家统计', () => {
    const stats = getPlayerStats([baseGame]);
    expect(stats[0].playerName).toBe('A');
    expect(stats[0].totalProfitLossAmount).toBe(80);
    expect(stats.find((entry) => entry.playerName === 'B')?.losingGames).toBe(1);
  });
});
