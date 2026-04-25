import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button, Card, Pill, LiveDot, Avatar, CountryBadge, MethodBadge } from '../components/UI'
import { IconPlus, IconCheck, IconArrowRight, IconBolt, IconX, IconSpinner, IconChevronDown } from '../components/Icons'
import { useApp } from '../context/AppContext'
import { Member, Method } from '../data'
import { TopBar } from '../components/TopBar'

const steps = ['Set amounts', 'Review & confirm', 'Execute'] as const

const countries: { code: string; name: string }[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
]

export function Payroll() {
  const { payrollStep, setPayrollStep, goToPayroll } = useApp()
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Run Payroll">
        <Pill tone="green" className="h-7 px-2.5"><LiveDot /> Live · USDC/USDT</Pill>
        <Button variant="primary" onClick={goToPayroll}>
          <IconPlus width={14} height={14} /> Run payroll
        </Button>
      </TopBar>

      <div className="border-b border-border-subtle px-8 pt-7">
        <div className="grid grid-cols-3">
          {steps.map((s, i) => {
            const active = i === payrollStep
            const done = i < payrollStep
            return (
              <div key={s} className="flex flex-col">
                <div className="flex items-center gap-3 pb-4">
                  <div
                    className={[
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-medium transition-all duration-300',
                      active ? 'border-brand-500 text-brand-500' : done ? 'border-brand-500 bg-brand-500 text-bg-base' : 'border-border text-text-muted',
                    ].join(' ')}
                  >
                    {done ? <IconCheck width={14} height={14} /> : i + 1}
                  </div>
                  <div className={active ? 'text-text-primary font-medium' : done ? 'text-text-primary' : 'text-text-muted'}>
                    {s}
                  </div>
                </div>
                <motion.div
                  className="h-[2px] origin-left"
                  style={{ backgroundColor: active || done ? '#22c55e' : 'rgba(255,255,255,0.06)' }}
                  initial={false}
                  animate={{ scaleX: active || done ? 1 : 1 }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={payrollStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {payrollStep === 0 && <StepAmounts onNext={() => setPayrollStep(1)} />}
            {payrollStep === 1 && <StepReview onBack={() => setPayrollStep(0)} onNext={() => setPayrollStep(2)} />}
            {payrollStep === 2 && <StepExecute />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ───────────────────────── Step 1 ───────────────────────── */
function StepAmounts({ onNext }: { onNext: () => void }) {
  const { team, setAmount, addMember, removeMember, toast } = useApp()
  const total = useMemo(() => team.reduce((s, m) => s + (Number(m.amount) || 0), 0), [team])
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set())

  const handleAdd = () => {
    const id = addMember({})
    setFreshIds((s) => new Set(s).add(id))
    toast('New member added — fill in details')
  }

  const handleCSV = () => {
    toast('Demo CSV imported — 12 contractors added', 'green')
  }

  return (
    <>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight">Set payroll amounts</h2>
          <p className="mt-1 text-[13px] text-text-secondary">Enter USD amounts — USDC conversion is automatic</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCSV}>Import CSV</Button>
          <Button variant="secondary" onClick={handleAdd}><IconPlus width={14} height={14} /> Add member</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1.1fr_0.8fr_1fr_1fr_40px] border-b border-border-subtle bg-white/[0.015] px-6 py-3 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-muted">
          <div>Member</div>
          <div>Country</div>
          <div>Method</div>
          <div>Amount (USD)</div>
          <div>USDC equiv.</div>
          <div />
        </div>
        <ul>
          <AnimatePresence initial={false}>
            {team.length === 0 && (
              <motion.li
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 py-12 text-center"
              >
                <div className="text-[14px] font-medium text-text-secondary">No recipients yet</div>
                <div className="mt-1 text-[12.5px] text-text-muted">Add a member or import a CSV to start.</div>
              </motion.li>
            )}
            {team.map((m) => (
              <MemberRow
                key={m.id}
                m={m}
                isFresh={freshIds.has(m.id)}
                setAmount={setAmount}
                removeMember={removeMember}
              />
            ))}
          </AnimatePresence>
        </ul>
        <div className="flex items-center justify-between bg-white/[0.015] px-6 py-4">
          <div className="text-[13px] text-text-secondary">{team.length} recipient{team.length === 1 ? '' : 's'}</div>
          <div className="flex items-baseline gap-3">
            <span className="text-[12px] uppercase tracking-[0.08em] text-text-muted">Total payroll</span>
            <motion.span
              key={total}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[20px] font-semibold tabular-nums"
            >
              ${total.toLocaleString()}
            </motion.span>
            <span className="text-[12px] text-text-muted">USD</span>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" size="lg" onClick={onNext} disabled={team.length === 0 || total === 0}>
          Continue to review <IconArrowRight width={16} height={16} />
        </Button>
      </div>
    </>
  )
}

function MemberRow({ m, isFresh, setAmount, removeMember }: { m: Member; isFresh: boolean; setAmount: (id: string, v: number) => void; removeMember: (id: string) => void }) {
  const { updateMember } = useApp()
  const [countryOpen, setCountryOpen] = useState(false)
  const [methodOpen, setMethodOpen] = useState(false)

  const pickCountry = (c: { code: string; name: string }) => {
    updateMember(m.id, { country: c.name, countryCode: c.code })
    setCountryOpen(false)
  }
  const pickMethod = (mm: Method) => {
    updateMember(m.id, { method: mm })
    setMethodOpen(false)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, x: -40, height: 0 }}
      transition={{ duration: 0.22 }}
      className="group grid grid-cols-[1.6fr_1.1fr_0.8fr_1fr_1fr_40px] items-center border-b border-border-subtle px-6 py-3.5 last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <Avatar initials={m.initials} color={m.avatarColor} />
        <div className="min-w-0">
          {isFresh ? (
            <input
              autoFocus
              value={m.name}
              onChange={(e) => updateMember(m.id, { name: e.target.value })}
              placeholder="Full name"
              aria-label="Member name"
              className="h-7 w-full rounded-md border border-border bg-bg-elevated px-2 text-[13px] text-text-primary outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          ) : (
            <div className="text-[13.5px] font-medium text-text-primary">{m.name || 'Unnamed'}</div>
          )}
          <div className="text-[12px] text-text-muted">{m.role}</div>
        </div>
      </div>

      {/* Country */}
      <div className="relative">
        {isFresh ? (
          <>
            <button
              onClick={() => setCountryOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-bg-elevated px-2 py-1.5 text-[12.5px] text-text-primary hover:border-border focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              aria-label="Choose country"
            >
              <span className="rounded-sm bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">{m.countryCode}</span>
              {m.country}
              <IconChevronDown width={12} height={12} className="text-text-muted" />
            </button>
            <AnimatePresence>
              {countryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated shadow-xl"
                >
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => pickCountry(c)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                    >
                      <span className="rounded-sm bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10.5px]">{c.code}</span>
                      {c.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <CountryBadge code={m.countryCode} name={m.country} />
        )}
      </div>

      {/* Method */}
      <div className="relative">
        {isFresh ? (
          <>
            <button
              onClick={() => setMethodOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-elevated px-2 py-1 text-[12px] hover:border-border focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              aria-label="Choose payment method"
            >
              <MethodBadge method={m.method} />
              <IconChevronDown width={12} height={12} className="text-text-muted" />
            </button>
            <AnimatePresence>
              {methodOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated shadow-xl"
                >
                  {(['USDC', 'USDT', 'EUR Bank'] as Method[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => pickMethod(opt)}
                      className="flex w-full px-3 py-2 text-left text-[12.5px] text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <MethodBadge method={m.method} />
        )}
      </div>

      <div>
        <input
          type="number"
          value={m.amount || ''}
          onChange={(e) => setAmount(m.id, Math.max(0, Math.min(1_000_000, Number(e.target.value) || 0)))}
          placeholder="0"
          aria-label={`Amount for ${m.name || 'new member'}`}
          className="h-9 w-32 rounded-lg border border-border bg-bg-elevated px-3 font-mono text-[13px] text-text-primary outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <div className="font-mono text-[13px] text-brand-400">
        ≈ {(m.amount || 0).toLocaleString()} {m.method === 'EUR Bank' ? 'EUR' : m.method}
      </div>
      <div className="text-right">
        <button
          onClick={() => removeMember(m.id)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-muted opacity-0 transition-opacity hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:opacity-100"
          aria-label={`Remove ${m.name || 'member'}`}
          title="Remove"
        >
          <IconX width={14} height={14} />
        </button>
      </div>
    </motion.li>
  )
}

/* ───────────────────────── Step 2 ───────────────────────── */
function StepReview({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { team, authorized, setAuthorized } = useApp()
  const total = useMemo(() => team.reduce((s, m) => s + m.amount, 0), [team])
  const fee = Math.round(total * 0.002 * 100) / 100

  const [checks, setChecks] = useState<number>(0)
  useEffect(() => {
    setChecks(0)
    const timers = [400, 800, 1200].map((ms, i) => window.setTimeout(() => setChecks(i + 1), ms))
    return () => timers.forEach(clearTimeout)
  }, [])

  const complianceItems = [
    'Sanctions screening passed (Chainalysis)',
    'KYC verified for all recipients',
    'Tax documents ready',
  ]

  return (
    <>
      <h2 className="text-[20px] font-semibold tracking-tight">Review &amp; confirm</h2>
      <p className="mt-1 text-[13px] text-text-secondary">Double-check amounts and routing before execution</p>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <SummaryTile label="Total payout" value={`$${total.toLocaleString()}`} />
        <SummaryTile label="Recipients" value={String(team.length)} />
        <SummaryTile label="Network fee (0.2%)" value={`$${fee.toLocaleString()}`} />
        <SummaryTile label="Est. settlement" value="< 3 min" tone="green" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Card className="col-span-2 overflow-hidden">
          <div className="border-b border-border-subtle px-6 py-3.5 text-[13.5px] font-semibold">Recipients</div>
          <ul>
            {team.map((m) => (
              <li key={m.id} className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center border-b border-border-subtle px-6 py-3 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Avatar initials={m.initials} color={m.avatarColor} size={32} />
                  <div>
                    <div className="text-[13.5px] font-medium">{m.name || 'Unnamed'}</div>
                    <div className="text-[12px] text-text-muted">{m.country}</div>
                  </div>
                </div>
                <div><MethodBadge method={m.method} /></div>
                <div className="font-mono text-[13px] tabular-nums">${m.amount.toLocaleString()}</div>
                <div className="text-right font-mono text-[13px] text-brand-400">
                  ≈ {m.amount.toLocaleString()} {m.method === 'EUR Bank' ? 'EUR' : m.method}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="text-[13.5px] font-semibold">Compliance</div>
          <ul className="mt-4 space-y-3">
            {complianceItems.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: i < checks ? 1 : 0.35, scale: i < checks ? 1 : 0.85 }}
                  transition={{ duration: 0.3, ease: 'backOut' }}
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${i < checks ? 'bg-brand-500/15 text-brand-500' : 'bg-white/[0.04] text-text-muted'}`}
                >
                  {i < checks ? <IconCheck width={14} height={14} /> : <IconSpinner width={14} height={14} className="animate-spin" />}
                </motion.span>
                <span className={`text-[12.5px] ${i < checks ? 'text-text-primary' : 'text-text-muted'}`}>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-border-subtle pt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <span
                className={[
                  'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors',
                  authorized ? 'border-brand-500 bg-brand-500 text-bg-base' : 'border-border bg-bg-elevated',
                ].join(' ')}
              >
                {authorized && <IconCheck width={12} height={12} />}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
              />
              <span className="text-[12.5px] leading-snug text-text-secondary">
                I authorize this payroll run and confirm the recipients and amounts are correct.
              </span>
            </label>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button variant="primary" size="lg" onClick={onNext} disabled={!authorized || checks < 3}>
          Execute payroll <IconArrowRight width={16} height={16} />
        </Button>
      </div>
    </>
  )
}

/* ───────────────────────── Step 3 ───────────────────────── */
type RecipientState = 'Pending' | 'Processing' | 'Sent'

const stages = [
  { label: 'Validating payroll data and FX rates...', t: 0 },
  { label: 'Running compliance checks (Chainalysis)...', t: 2 },
  { label: 'Minting Zeno tokens from treasury...', t: 5 },
  { label: 'Distributing to contractors across countries...', t: 8 },
] as const

const TOTAL_DURATION_MS = 6200 // compressed screen time
const REAL_TIME_END = 28 // T+28s shown to user

function StepExecute() {
  const { team, resetDemo, setView } = useApp()
  const { goToPayroll } = useApp()
  const total = useMemo(() => team.reduce((s, m) => s + m.amount, 0), [team])

  const [elapsedMs, setElapsedMs] = useState(0)
  const [status, setStatus] = useState<Record<string, RecipientState>>(() => Object.fromEntries(team.map((m) => [m.id, 'Pending' as RecipientState])))
  const [done, setDone] = useState(false)
  const timeoutsRef = useRef<number[]>([])
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(performance.now())
  const firedConfettiRef = useRef(false)

  // Clear everything on unmount / step change
  const clearAll = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id))
    timeoutsRef.current = []
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  useEffect(() => {
    startRef.current = performance.now()
    firedConfettiRef.current = false

    const tick = (now: number) => {
      const e = now - startRef.current
      setElapsedMs(Math.min(TOTAL_DURATION_MS, e))
      if (e < TOTAL_DURATION_MS) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDone(true)
        if (!firedConfettiRef.current) {
          firedConfettiRef.current = true
          fireConfetti()
        }
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    // Stage 4 begins at ~3.5s screen time (t=8s real). Stagger completions across remaining 2.7s.
    const distStart = (stages[3].t / REAL_TIME_END) * TOTAL_DURATION_MS
    const distEnd = TOTAL_DURATION_MS
    const ids = team.map((m) => m.id)

    // Processing starts shortly after distribute phase begins
    ids.forEach((id, i) => {
      const procAt = distStart + (i * (distEnd - distStart)) / (ids.length + 1) - 200
      const sentAt = distStart + ((i + 1) * (distEnd - distStart)) / (ids.length + 1)
      timeoutsRef.current.push(
        window.setTimeout(() => setStatus((s) => ({ ...s, [id]: 'Processing' })), Math.max(0, procAt))
      )
      timeoutsRef.current.push(
        window.setTimeout(() => setStatus((s) => ({ ...s, [id]: 'Sent' })), Math.max(0, sentAt))
      )
    })

    return clearAll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const screenFrac = Math.min(1, elapsedMs / TOTAL_DURATION_MS)
  const tSeconds = done
    ? REAL_TIME_END
    : Math.min(REAL_TIME_END - 1, Math.floor(screenFrac * REAL_TIME_END))
  const currentStage = stages.slice().reverse().find((s) => tSeconds >= s.t) ?? stages[0]

  const onReset = () => {
    clearAll()
    resetDemo()
    goToPayroll()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11.5px] uppercase tracking-[0.12em] text-text-muted">{done ? 'Complete' : 'Processing payroll'}</div>
            <div className="mt-1 font-mono text-[36px] font-semibold tabular-nums tracking-tight">
              ${total.toLocaleString()}
            </div>
            <div className="mt-1 text-[13px] text-text-secondary">
              {done ? `Sent to ${team.length} contractors in 28 seconds.` : `Distributing to ${team.length} contractors across ${new Set(team.map((t) => t.country)).size} countries.`}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-text-muted">Elapsed</div>
            <div className="mt-1 font-mono text-[28px] font-semibold tabular-nums text-brand-400">
              T+{tSeconds}s
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
            <motion.div
              className="absolute inset-y-0 left-0 bg-brand-500"
              animate={{ width: `${screenFrac * 100}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
          <div className="mt-3 flex items-center gap-2 text-[13px] text-text-secondary">
            {!done ? (
              <>
                <IconSpinner width={14} height={14} className="animate-spin text-brand-400" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentStage.label}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStage.label}
                  </motion.span>
                </AnimatePresence>
              </>
            ) : (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/15 text-brand-500">
                  <IconCheck width={12} height={12} />
                </span>
                <span className="text-text-primary">Payroll complete — ${total.toLocaleString()} sent in 28 seconds</span>
              </>
            )}
          </div>
        </div>

        <ul className="mt-7 divide-y divide-border-subtle">
          {team.map((m) => {
            const s = status[m.id]
            return (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={m.initials} color={m.avatarColor} size={32} />
                  <div>
                    <div className="text-[13.5px] font-medium">{m.name || 'Unnamed'}</div>
                    <div className="text-[11.5px] text-text-muted">{m.country} · {m.method}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[12.5px] text-text-secondary">${m.amount.toLocaleString()}</span>
                  <span className="font-mono text-[11px] text-text-muted">0x{m.id.padStart(4, '0')}…{m.initials.toLowerCase()}</span>
                  <RecipientBadge state={s} />
                </div>
              </li>
            )
          })}
        </ul>

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-7 flex items-center justify-end gap-3 border-t border-border-subtle pt-5"
          >
            <Button variant="secondary" onClick={() => setView('transactions')}>View transactions</Button>
            <Button variant="primary" onClick={onReset}>
              <IconBolt width={14} height={14} /> Run another payroll
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  )
}

function RecipientBadge({ state }: { state: RecipientState }) {
  if (state === 'Pending') {
    return <span className="inline-flex min-w-[86px] items-center justify-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-text-muted">Pending</span>
  }
  if (state === 'Processing') {
    return (
      <span className="inline-flex min-w-[86px] items-center justify-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
        <IconSpinner width={10} height={10} className="animate-spin" /> Processing
      </span>
    )
  }
  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.22, ease: 'backOut' }}
      className="inline-flex min-w-[86px] items-center justify-center gap-1.5 rounded-md bg-brand-500/15 px-2 py-0.5 text-[11px] font-medium text-brand-400"
    >
      <IconCheck width={10} height={10} /> Sent
    </motion.span>
  )
}

function SummaryTile({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'green' }) {
  return (
    <Card className="p-5">
      <div className="text-[11.5px] uppercase tracking-[0.1em] text-text-muted">{label}</div>
      <div className={`mt-2 font-mono text-[22px] font-semibold tabular-nums ${tone === 'green' ? 'text-brand-400' : 'text-text-primary'}`}>{value}</div>
    </Card>
  )
}

function fireConfetti() {
  const defaults = { origin: { y: 0.35 }, colors: ['#22c55e', '#3bd77a', '#6ee7a3', '#a7f3d0'] }
  confetti({ ...defaults, particleCount: 60, spread: 65, startVelocity: 45 })
  setTimeout(() => confetti({ ...defaults, particleCount: 40, spread: 100, startVelocity: 35, angle: 60 }), 180)
  setTimeout(() => confetti({ ...defaults, particleCount: 40, spread: 100, startVelocity: 35, angle: 120 }), 300)
}
