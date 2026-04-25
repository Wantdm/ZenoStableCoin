import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useCountUp, useInView } from '../hooks/useCountUp'

export function Pill({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode
  tone?: 'neutral' | 'green' | 'blue' | 'purple' | 'amber'
  className?: string
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-white/[0.06] text-text-secondary',
    green: 'bg-brand-500/15 text-brand-400',
    blue: 'bg-info-500/15 text-info-500',
    purple: 'bg-violet-500/15 text-violet-400',
    amber: 'bg-amber-500/15 text-amber-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function LiveDot() {
  const reduce = useReducedMotion()
  return (
    <span className="relative flex h-2 w-2">
      {!reduce && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-brand-500"
          animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
    </span>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  disabled,
  title,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'sm' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
  title?: string
}) {
  const sizes = {
    sm: 'h-8 px-3 text-[12.5px]',
    md: 'h-9 px-3.5 text-[13px]',
    lg: 'h-11 px-5 text-[14px]',
  }
  const variants = {
    primary: 'bg-brand-500 text-bg-base hover:bg-brand-400 active:bg-brand-600 font-medium focus:ring-brand-500/50',
    secondary: 'bg-white/[0.04] text-text-primary border border-border-subtle hover:bg-white/[0.08] hover:border-border active:bg-white/[0.05] focus:ring-white/30',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04] focus:ring-white/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 focus:ring-rose-500/40',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none active:translate-y-[0.5px] ${sizes[size]} ${variants[variant]} ${className}`}
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

export function CountUpNumber({
  target,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  durationMs = 1400,
  when = 'mount',
}: {
  target: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  durationMs?: number
  when?: 'mount' | 'inView'
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 })
  const start = when === 'mount' ? true : inView
  const value = useCountUp(target, { durationMs, start, decimals })
  const formatted = value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
