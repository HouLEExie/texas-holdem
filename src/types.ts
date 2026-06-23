export type CurrencyCode = 'CNY' | 'USD' | 'HKD';

export type GameStatus = 'draft' | 'settled';

export interface Rebuy {
  id: string;
  chips: number;
  createdAt: string;
}

export interface Player {
  id: string;
  name: string;
  initialBuyInChips: number;
  rebuys: Rebuy[];
  finalChips: number;
}

export interface ChipRate {
  currency: CurrencyCode;
  currencySymbol: string;
  chipsPerMoneyUnit: number;
  chipValueInMoney: number;
}

export interface Game {
  id: string;
  name: string;
  note?: string;
  date: string;
  chipRate: ChipRate;
  players: Player[];
  createdAt: string;
  updatedAt: string;
  status: GameStatus;
}

export interface RankingEntry {
  rank: number;
  player: Player;
  totalBuyInChips: number;
  totalBuyInAmount: number;
  finalChips: number;
  finalAmount: number;
  profitLossChips: number;
  profitLossAmount: number;
}

export interface SettlementTransfer {
  fromPlayerId: string;
  fromPlayerName: string;
  toPlayerId: string;
  toPlayerName: string;
  chips: number;
  amount: number;
}

export interface PlayerStats {
  playerName: string;
  gamesPlayed: number;
  totalBuyInChips: number;
  totalBuyInAmount: number;
  totalFinalChips: number;
  totalFinalAmount: number;
  totalProfitLossChips: number;
  totalProfitLossAmount: number;
  averageProfitLossAmount: number;
  bestGameAmount: number;
  worstGameAmount: number;
  winningGames: number;
  losingGames: number;
  breakEvenGames: number;
}
