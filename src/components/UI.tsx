import { ReactNode } from 'react'

export function Pill({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode
  tone?: 'neutral' | 'green' | 'blue' | 'purple'
  className?: string
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-white/[0.06] text-text-secondary',
    green: 'bg-brand-500/15 text-brand-400',
    blue: 'bg-info-500/15 text-info-500',
    purple: 'bg-violet-500/15 text-violet-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function LiveDot() {
  return <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" /></span>
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  disabled,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'sm' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}) {
  const sizes = {
    sm: 'h-8 px-3 text-[12.5px]',
    md: 'h-9 px-3.5 text-[13px]',
    lg: 'h-11 px-5 text-[14px]',
  }
  const variants = {
    primary: 'bg-brand-500 text-bg-base hover:bg-brand-400 font-medium',
    secondary: 'bg-white/[0.04] text-text-primary border border-border-subtle hover:bg-white/[0.07]',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border-subtle bg-bg-surface ${className}`}>{children}</div>
}

export function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full text-[12.5px] font-semibold text-white ${color}`}
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  )
}

export function CountryBadge({ code, name }: { code: string; name: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="rounded-sm border border-border-subtle bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
        {code}
      </span>
      <span className="text-[13px] text-text-primary">{name}</span>
    </div>
  )
}

export function MethodBadge({ method }: { method: 'USDC' | 'USDT' | 'EUR Bank' }) {
  if (method === 'EUR Bank') return <Pill tone="blue">EUR Bank</Pill>
  return <Pill tone="green">{method}</Pill>
}
