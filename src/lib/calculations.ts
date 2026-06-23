import type { ChipRate, Game, Player, PlayerStats, RankingEntry, SettlementTransfer } from '../types';

const EPSILON = 0.005;

function asNumber(value: number | undefined | null): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function roundMoney(amount: number): number {
  return Math.round((asNumber(amount) + Number.EPSILON) * 100) / 100;
}

function roundChips(chips: number): number {
  return Math.round((asNumber(chips) + Number.EPSILON) * 10000) / 10000;
}

function cleanName(player: Player): string {
  const name = player.name.trim();
  return name || '未命名玩家';
}

function formatNumber(value: number): string {
  const safeValue = Math.abs(asNumber(value));
  if (Number.isInteger(safeValue)) return safeValue.toLocaleString('zh-CN');
  return safeValue.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

function formatMoneyNumber(value: number): string {
  const safeValue = Math.abs(roundMoney(value));
  return safeValue.toLocaleString('zh-CN', {
    minimumFractionDigits: Number.isInteger(safeValue) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function getTotalRebuyChips(player: Player): number {
  return roundChips(player.rebuys.reduce((sum, rebuy) => sum + asNumber(rebuy.chips), 0));
}

export function getTotalBuyInChips(player: Player): number {
  return roundChips(asNumber(player.initialBuyInChips) + getTotalRebuyChips(player));
}

export function getPlayerProfitLossChips(player: Player): number {
  return roundChips(asNumber(player.finalChips) - getTotalBuyInChips(player));
}

export function chipsToMoney(chips: number, chipRate: ChipRate): number {
  return roundMoney(asNumber(chips) * asNumber(chipRate.chipValueInMoney));
}

export function moneyToChips(amount: number, chipRate: ChipRate): number {
  const chipValue = asNumber(chipRate.chipValueInMoney);
  if (chipValue <= 0) return 0;
  return roundChips(asNumber(amount) / chipValue);
}

export function getPlayerBuyInAmount(player: Player, chipRate: ChipRate): number {
  return chipsToMoney(getTotalBuyInChips(player), chipRate);
}

export function getPlayerFinalAmount(player: Player, chipRate: ChipRate): number {
  return chipsToMoney(player.finalChips, chipRate);
}

export function getPlayerProfitLossAmount(player: Player, chipRate: ChipRate): number {
  return chipsToMoney(getPlayerProfitLossChips(player), chipRate);
}

export function getGameTotalBuyInChips(game: Game): number {
  return roundChips(game.players.reduce((sum, player) => sum + getTotalBuyInChips(player), 0));
}

export function getGameTotalBuyInAmount(game: Game): number {
  return chipsToMoney(getGameTotalBuyInChips(game), game.chipRate);
}

export function getGameFinalChipsTotal(game: Game): number {
  return roundChips(game.players.reduce((sum, player) => sum + asNumber(player.finalChips), 0));
}

export function getGameFinalAmountTotal(game: Game): number {
  return chipsToMoney(getGameFinalChipsTotal(game), game.chipRate);
}

export function getGameChipDifference(game: Game): number {
  return roundChips(getGameFinalChipsTotal(game) - getGameTotalBuyInChips(game));
}

export function getGameMoneyDifference(game: Game): number {
  return chipsToMoney(getGameChipDifference(game), game.chipRate);
}

export function getRanking(game: Game): RankingEntry[] {
  return [...game.players]
    .map((player) => ({
      rank: 0,
      player,
      totalBuyInChips: getTotalBuyInChips(player),
      totalBuyInAmount: getPlayerBuyInAmount(player, game.chipRate),
      finalChips: roundChips(player.finalChips),
      finalAmount: getPlayerFinalAmount(player, game.chipRate),
      profitLossChips: getPlayerProfitLossChips(player),
      profitLossAmount: getPlayerProfitLossAmount(player, game.chipRate),
    }))
    .sort((a, b) => b.profitLossChips - a.profitLossChips || cleanName(a.player).localeCompare(cleanName(b.player), 'zh-CN'))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function getSettlementTransfers(game: Game): SettlementTransfer[] {
  const winners = game.players
    .map((player) => ({
      id: player.id,
      name: cleanName(player),
      chips: getPlayerProfitLossChips(player),
    }))
    .filter((player) => player.chips > 0)
    .sort((a, b) => b.chips - a.chips);

  const losers = game.players
    .map((player) => ({
      id: player.id,
      name: cleanName(player),
      chips: Math.abs(Math.min(getPlayerProfitLossChips(player), 0)),
    }))
    .filter((player) => player.chips > 0)
    .sort((a, b) => b.chips - a.chips);

  const transfers: SettlementTransfer[] = [];
  let winnerIndex = 0;
  let loserIndex = 0;

  while (winnerIndex < winners.length && loserIndex < losers.length) {
    const winner = winners[winnerIndex];
    const loser = losers[loserIndex];
    const chips = roundChips(Math.min(winner.chips, loser.chips));
    const amount = chipsToMoney(chips, game.chipRate);

    if (amount > EPSILON && chips > 0) {
      transfers.push({
        fromPlayerId: loser.id,
        fromPlayerName: loser.name,
        toPlayerId: winner.id,
        toPlayerName: winner.name,
        chips,
        amount,
      });
    }

    winner.chips = roundChips(winner.chips - chips);
    loser.chips = roundChips(loser.chips - chips);

    if (winner.chips <= 0) winnerIndex += 1;
    if (loser.chips <= 0) loserIndex += 1;
  }

  return transfers;
}

export function formatCurrency(amount: number, chipRate: ChipRate): string {
  const safeAmount = roundMoney(amount);
  const sign = safeAmount > 0 ? '+' : safeAmount < 0 ? '-' : '';
  return `${sign}${chipRate.currencySymbol}${formatMoneyNumber(safeAmount)}`;
}

export function formatChips(chips: number): string {
  const safeChips = roundChips(chips);
  const sign = safeChips > 0 ? '+' : safeChips < 0 ? '-' : '';
  return `${sign}${formatNumber(safeChips)} 筹码`;
}

export function formatUnsignedCurrency(amount: number, chipRate: ChipRate): string {
  return `${chipRate.currencySymbol}${formatMoneyNumber(amount)}`;
}

export function formatUnsignedChips(chips: number): string {
  return `${formatNumber(chips)} 筹码`;
}

export function generateSettlementText(game: Game): string {
  const ranking = getRanking(game);
  const transfers = getSettlementTransfers(game);
  const chipDifference = getGameChipDifference(game);
  const moneyDifference = getGameMoneyDifference(game);
  const statusText =
    chipDifference === 0 ? '结算正确，筹码总量一致。' : '筹码总量不一致，请检查买入、加买或结束筹码录入。';

  const rankingText = ranking
    .map(
      (entry) =>
        `${entry.rank}. ${cleanName(entry.player)}：${formatChips(entry.profitLossChips)} / ${formatCurrency(
          entry.profitLossAmount,
          game.chipRate,
        )}`,
    )
    .join('\n');

  const transfersText = transfers.length
    ? transfers
        .map(
          (transfer, index) =>
            `${index + 1}. ${transfer.fromPlayerName} 支付 ${transfer.toPlayerName}：${formatUnsignedChips(
              transfer.chips,
            )} / ${formatUnsignedCurrency(transfer.amount, game.chipRate)}`,
        )
        .join('\n')
    : '无需转账，所有玩家已打平。';

  return `【德州牌局结算】

牌局：${game.name || '未命名牌局'}
时间：${new Date(game.date).toLocaleString('zh-CN')}

筹码比例：
1 元 = ${formatNumber(game.chipRate.chipsPerMoneyUnit)} 筹码
1 筹码 = ${formatUnsignedCurrency(game.chipRate.chipValueInMoney, game.chipRate)}

牌局总览：
总买入：${formatUnsignedChips(getGameTotalBuyInChips(game))} / ${formatUnsignedCurrency(
    getGameTotalBuyInAmount(game),
    game.chipRate,
  )}
结束总筹码：${formatUnsignedChips(getGameFinalChipsTotal(game))} / ${formatUnsignedCurrency(
    getGameFinalAmountTotal(game),
    game.chipRate,
  )}
差额：${formatChips(chipDifference)} / ${formatCurrency(moneyDifference, game.chipRate)}
状态：${statusText}

最终排名：
${rankingText}

转账建议：
${transfersText}`;
}

export function getPlayerStats(games: Game[]): PlayerStats[] {
  const stats = new Map<string, PlayerStats>();

  games.forEach((game) => {
    game.players.forEach((player) => {
      const playerName = cleanName(player);
      const buyInChips = getTotalBuyInChips(player);
      const buyInAmount = getPlayerBuyInAmount(player, game.chipRate);
      const finalChips = roundChips(player.finalChips);
      const finalAmount = getPlayerFinalAmount(player, game.chipRate);
      const profitLossChips = getPlayerProfitLossChips(player);
      const profitLossAmount = getPlayerProfitLossAmount(player, game.chipRate);

      const existing =
        stats.get(playerName) ??
        ({
          playerName,
          gamesPlayed: 0,
          totalBuyInChips: 0,
          totalBuyInAmount: 0,
          totalFinalChips: 0,
          totalFinalAmount: 0,
          totalProfitLossChips: 0,
          totalProfitLossAmount: 0,
          averageProfitLossAmount: 0,
          bestGameAmount: profitLossAmount,
          worstGameAmount: profitLossAmount,
          winningGames: 0,
          losingGames: 0,
          breakEvenGames: 0,
        } satisfies PlayerStats);

      existing.gamesPlayed += 1;
      existing.totalBuyInChips = roundChips(existing.totalBuyInChips + buyInChips);
      existing.totalBuyInAmount = roundMoney(existing.totalBuyInAmount + buyInAmount);
      existing.totalFinalChips = roundChips(existing.totalFinalChips + finalChips);
      existing.totalFinalAmount = roundMoney(existing.totalFinalAmount + finalAmount);
      existing.totalProfitLossChips = roundChips(existing.totalProfitLossChips + profitLossChips);
      existing.totalProfitLossAmount = roundMoney(existing.totalProfitLossAmount + profitLossAmount);
      existing.averageProfitLossAmount = roundMoney(existing.totalProfitLossAmount / existing.gamesPlayed);
      existing.bestGameAmount = Math.max(existing.bestGameAmount, profitLossAmount);
      existing.worstGameAmount = Math.min(existing.worstGameAmount, profitLossAmount);

      if (profitLossAmount > 0) existing.winningGames += 1;
      else if (profitLossAmount < 0) existing.losingGames += 1;
      else existing.breakEvenGames += 1;

      stats.set(playerName, existing);
    });
  });

  return [...stats.values()].sort(
    (a, b) => b.totalProfitLossAmount - a.totalProfitLossAmount || a.playerName.localeCompare(b.playerName, 'zh-CN'),
  );
}
