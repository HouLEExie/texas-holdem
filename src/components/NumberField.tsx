import { useEffect, useState } from 'react';

interface NumberFieldProps {
  id?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
}

function sanitizeNumberInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [first, ...rest] = cleaned.split('.');
  return rest.length ? `${first}.${rest.join('')}` : first;
}

export function NumberField({ id, label, value, onChange, suffix, min = 0 }: NumberFieldProps) {
  const [draft, setDraft] = useState(() => (Number.isFinite(value) ? String(value) : '0'));

  useEffect(() => {
    setDraft(Number.isFinite(value) ? String(value) : '0');
  }, [value]);

  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1 block text-xs font-medium text-stone-300">{label}</span>
      <div className="flex min-h-12 items-center rounded-lg border border-white/10 bg-black/20 px-3 focus-within:border-tableGold/70">
        <input
          id={id}
          inputMode="decimal"
          pattern="[0-9]*[.]?[0-9]*"
          className="w-full bg-transparent py-3 text-base font-semibold text-stone-50 outline-none placeholder:text-stone-600"
          value={draft}
          min={min}
          onChange={(event) => {
            const nextDraft = sanitizeNumberInput(event.target.value);
            setDraft(nextDraft);
            const parsed = Number(nextDraft);
            onChange(Number.isFinite(parsed) ? parsed : 0);
          }}
          onBlur={() => {
            if (draft === '') setDraft('0');
          }}
        />
        {suffix ? <span className="ml-2 whitespace-nowrap text-xs text-stone-400">{suffix}</span> : null}
      </div>
    </label>
  );
}
