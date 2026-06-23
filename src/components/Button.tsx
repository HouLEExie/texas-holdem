import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: ButtonVariant;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'border-tableGold/60 bg-tableGold text-felt-950 shadow-glow hover:bg-[#E6C77A]',
  secondary: 'border-chip-400/30 bg-chip-500/15 text-chip-300 hover:bg-chip-500/25',
  danger: 'border-tableRed/40 bg-tableRed/15 text-red-200 hover:bg-tableRed/25',
  ghost: 'border-white/10 bg-white/5 text-stone-200 hover:bg-white/10',
};

export function Button({ icon, children, className = '', variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
