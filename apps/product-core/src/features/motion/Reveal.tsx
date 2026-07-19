'use client';

import type { ElementType, ReactNode } from 'react';

import { useReveal } from './useReveal';

type RevealVariant = 'up' | 'left' | 'right' | 'scale';
type RevealDelay = 0 | 1 | 2 | 3 | 4 | 5;

type RevealProps = Readonly<{
  as?: ElementType;
  variant?: RevealVariant;
  delay?: RevealDelay;
  className?: string;
  children: ReactNode;
}>;

export function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className,
  children,
}: RevealProps) {
  const ref = useReveal<HTMLElement>();
  const composed = className ? `kc-reveal ${className}` : 'kc-reveal';
  return (
    <Tag
      ref={ref}
      className={composed}
      data-reveal={variant}
      data-delay={delay || undefined}
    >
      {children}
    </Tag>
  );
}
