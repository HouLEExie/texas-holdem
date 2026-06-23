import type { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ title, eyebrow, action, children, className = '' }: SectionProps) {
  return (
    <section className={className}>
      {(title || eyebrow || action) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-tableGold">{eyebrow}</p> : null}
            {title ? <h2 className="mt-1 text-lg font-bold text-stone-50">{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
