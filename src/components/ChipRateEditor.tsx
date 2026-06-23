import { Coins } from 'lucide-react';
import type { ChipRate, CurrencyCode } from '../types';
import { currencySymbols, syncChipRateFromChipValue, syncChipRateFromChipsPerMoneyUnit } from '../lib/gameFactory';
import { NumberField } from './NumberField';

interface ChipRateEditorProps {
  chipRate: ChipRate;
  onChange: (chipRate: ChipRate) => void;
}

const currencies: CurrencyCode[] = ['CNY', 'USD', 'HKD'];

export function ChipRateEditor({ chipRate, onChange }: ChipRateEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-300" htmlFor="currency">
          货币类型
        </label>
        <div className="flex min-h-12 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3">
          <Coins className="h-4 w-4 text-tableGold" aria-hidden="true" />
          <select
            id="currency"
            className="w-full bg-transparent py-3 text-base font-semibold text-stone-50 outline-none"
            value={chipRate.currency}
            onChange={(event) => {
              const currency = event.target.value as CurrencyCode;
              onChange({
                ...chipRate,
                currency,
                currencySymbol: currencySymbols[currency],
              });
            }}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency} className="bg-felt-900 text-stone-50">
                {currency} {currencySymbols[currency]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField
          label="1 元 = 多少筹码"
          value={chipRate.chipsPerMoneyUnit}
          suffix="筹码"
          onChange={(value) => onChange(syncChipRateFromChipsPerMoneyUnit(value, chipRate))}
        />
        <NumberField
          label="1 筹码 = 多少元"
          value={chipRate.chipValueInMoney}
          suffix={chipRate.currencySymbol}
          onChange={(value) => onChange(syncChipRateFromChipValue(value, chipRate))}
        />
      </div>
    </div>
  );
}
