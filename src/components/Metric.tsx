import type { ReactNode } from 'react';

interface MetricProps {
  label: string;
  value: ReactNode;
  tone?: 'neutral' | 'profit' | 'loss' | 'gold';
}

const toneClass = {
  neutral: 'text-stone-50',
  profit: 'text-chip-300',
  loss: 'text-red-300',
  gold: 'text-tableGold',
};

export function Metric({ label, value, tone = 'neutral' }: MetricProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/15 px-3 py-3">
      <p className="text-xs text-stone-400">{label}</p>
      <p className={`mt-1 break-words text-lg font-extrabold ${toneClass[tone]}`}>{value}</p>
    </div>
  );
}
