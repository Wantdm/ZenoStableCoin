import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Card, Pill, LiveDot, Button, CountUpNumber } from '../components/UI'
import { treasury, recentActivity } from '../data'
import { IconTrendUp, IconArrowRight, IconPlus, IconRefresh, IconSpinner } from '../components/Icons'
import { useApp } from '../context/AppContext'

export function Treasury() {
  const { goToPayroll, toast } = useApp()
  const [balance, setBalance] = useState(treasury.balance)
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const [yieldMtd, setYieldMtd] = useState(treasury.yieldMtd)
  const [showNewBadge, setShowNewBadge] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Random-walk the balance every 3–5s, ±$50 from the base
  useEffect(() => {
    let timer: number
    const schedule = () => {
      const delay = 3000 + Math.random() * 2000
      timer = window.setTimeout(() => {
        setBalance((b) => {
          const drift = (Math.random() - 0.5) * 100 // +/- $50
          const target = treasury.balance + (Math.random() - 0.5) * 100
          const next = Math.round((b + (target - b) * 0.6 + drift * 0.2) * 100) / 100
          setFlash(next >= b ? 'up' : 'down')
          return next
        })
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!flash) return
    const t = window.setTimeout(() => setFlash(null), 700)
    return () => clearTimeout(t)
  }, [flash])

  // Yield MTD ticks up once per minute — for demo, use 12s so it's visible
  useEffect(() => {
    const id = window.setInterval(() => {
      setYieldMtd((v) => Math.round((v + 0.5 + Math.random() * 1.5) * 100) / 100)
    }, 12000)
    return () => clearInterval(id)
  }, [])

  // "NEW" badge fades after 5s
  useEffect(() => {
    const t = window.setTimeout(() => setShowNewBadge(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    window.setTimeout(() => {
      setRefreshing(false)
      toast('Data up to date', 'green')
    }, 600)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-8 py-4 pr-40">
        <h1 className="text-[18px] font-semibold">Treasury</h1>
        <div className="flex items-center gap-3">
          <Pill tone="green" className="h-7 px-2.5"><LiveDot /> Live · USDC/USDT</Pill>
          <Button variant="secondary" onClick={() => toast('Withdraw flow coming soon')}>Withdraw</Button>
          <Button variant="secondary" onClick={() => toast('Deposit address copied (demo)', 'green')}><IconPlus width={14} height={14} /> Deposit</Button>
          <Button variant="primary" onClick={goToPayroll}>Run payroll</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-7">
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-6">
            <div className="text-[11.5px] uppercase tracking-[0.1em] text-text-muted">Treasury balance</div>
            <div className="mt-2 flex items-baseline gap-3">
              <motion.span
                key={flash}
                animate={{ color: flash === 'up' ? '#3bd77a' : flash === 'down' ? '#fca5a5' : '#e7e9ec' }}
                transition={{ duration: 0.7 }}
                className="font-mono text-[40px] font-semibold tabular-nums tracking-tight"
              >
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.span>
              <span className="text-[13px] text-text-secondary">USD</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[12.5px] text-brand-400">
              <IconTrendUp width={14} height={14} />
              <motion.span key={yieldMtd} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }}>
                +${yieldMtd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MTD · earning {treasury.apy}% APY
              </motion.span>
            </div>

            <div className="mt-7">
              <div className="mb-2.5 flex items-center justify-between text-[12px] text-text-muted">
                <span>Allocation</span>
                <span>100%</span>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-bg-elevated">
                {treasury.allocation.map((a, i) => (
                  <motion.div
                    key={a.label}
                    initial={{ width: 0 }}
                    animate={{ width: `${a.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                    style={{ backgroundColor: a.color }}
                  />
                ))}
              </div>
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {treasury.allocation.map((a, i) => (
                  <motion.li
                    key={a.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 + i * 0.08 }}
                    className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
                    <div className="flex-1">
                      <div className="text-[12.5px] text-text-secondary">{a.label}</div>
                      <div className="font-mono text-[14px] font-semibold tabular-nums">{a.pct}%</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-[11.5px] uppercase tracking-[0.1em] text-text-muted">Yield · this month</div>
            <div className="mt-2 font-mono text-[28px] font-semibold tabular-nums text-brand-400">
              +<CountUpNumber target={treasury.yieldMtd} decimals={0} durationMs={1200} />
            </div>
            <div className="mt-1 text-[12.5px] text-text-secondary">{treasury.apy}% APY · auto-compounded</div>

            <div className="mt-6">
              <YieldSparkline />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-[12.5px]">
              <div className="rounded-lg bg-bg-elevated px-3 py-2.5">
                <div className="text-text-muted">Projected · YTD</div>
                <div className="mt-1 font-mono font-semibold">
                  $<CountUpNumber target={5128} durationMs={1400} when="inView" />
                </div>
              </div>
              <div className="rounded-lg bg-bg-elevated px-3 py-2.5">
                <div className="text-text-muted">Avg APY</div>
                <div className="mt-1 font-mono font-semibold">4.42%</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="col-span-2 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[14.5px] font-semibold">Recent activity</h3>
                <span className="text-[12px] text-text-muted">Last 30 days</span>
                <button
                  onClick={handleRefresh}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  title="Refresh"
                >
                  {refreshing ? <IconSpinner width={12} height={12} className="animate-spin text-brand-400" /> : <IconRefresh width={12} height={12} />}
                </button>
              </div>
              <Button variant="ghost" size="sm">View all <IconArrowRight width={12} height={12} /></Button>
            </div>
            <ul>
              {recentActivity.map((a, i) => (
                <li key={a.id} className="flex items-center justify-between border-b border-border-subtle px-6 py-3.5 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.amount >= 0 ? 'bg-brand-500/12 text-brand-500' : 'bg-white/[0.05] text-text-secondary'}`}>
                      {a.amount >= 0 ? '+' : '−'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[13.5px] font-medium">
                        {a.type}
                        <AnimatePresence>
                          {i === 0 && showNewBadge && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.25 }}
                              className="rounded bg-brand-500/20 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-brand-400"
                            >
                              New
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="text-[12px] text-text-muted">{a.detail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className={`font-mono text-[13.5px] tabular-nums ${a.amount >= 0 ? 'text-brand-400' : 'text-text-primary'}`}>
                      {a.amount >= 0 ? '+' : '−'}${Math.abs(a.amount).toLocaleString()}
                    </span>
                    <span className="w-12 text-right text-[12px] text-text-muted">{a.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-[14.5px] font-semibold">Why treasury yield?</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
              Idle USD earns nothing. Zeno auto-routes operating cash into tokenized T-bills, redeemable on-demand for payroll runs.
            </p>
            <ul className="mt-4 space-y-2.5 text-[12.5px]">
              <Bullet>Bankruptcy-remote, fully-backed</Bullet>
              <Bullet>Auto-rebalance to keep ≥ 1× monthly payroll liquid</Bullet>
              <Bullet>Daily yield, no lock-up</Bullet>
            </ul>
            <Button variant="secondary" className="mt-5 w-full" onClick={() => toast('Rules saved (demo)', 'green')}>Configure rules</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-text-secondary">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
      <span>{children}</span>
    </li>
  )
}

function YieldSparkline() {
  const points = [12, 18, 14, 22, 28, 24, 32, 38, 34, 44, 50, 58]
  const w = 280, h = 70, pad = 4
  const max = Math.max(...points), min = Math.min(...points)
  const ref = useRef<SVGPathElement>(null)
  const [len, setLen] = useState(0)

  useEffect(() => {
    if (ref.current) setLen(ref.current.getTotalLength())
  }, [])

  const path = points
    .map((p, i) => {
      const x = pad + (i * (w - pad * 2)) / (points.length - 1)
      const y = h - pad - ((p - min) / (max - min)) * (h - pad * 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${path} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`}
        fill="url(#g)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.path
        ref={ref}
        d={path}
        stroke="#22c55e"
        strokeWidth="1.6"
        fill="none"
        strokeDasharray={len}
        initial={{ strokeDashoffset: len }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}
