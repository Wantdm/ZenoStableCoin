import { useMemo, useState } from 'react'
import { team as seedTeam, Member } from '../data'
import { Button, Card, Pill, LiveDot, Avatar, CountryBadge, MethodBadge } from '../components/UI'
import { IconPlus, IconCheck, IconArrowRight, IconBolt } from '../components/Icons'

const steps = ['Set amounts', 'Review & confirm', 'Execute'] as const

export function Payroll() {
  const [step, setStep] = useState(0)
  const [team, setTeam] = useState<Member[]>(seedTeam)
  const [executed, setExecuted] = useState(false)

  const total = useMemo(() => team.reduce((s, m) => s + (Number(m.amount) || 0), 0), [team])

  const updateAmount = (id: string, v: string) => {
    const n = Math.max(0, Math.min(1_000_000, Number(v) || 0))
    setTeam((t) => t.map((m) => (m.id === id ? { ...m, amount: n } : m)))
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border-subtle px-8 py-4">
        <h1 className="text-[18px] font-semibold">Run Payroll</h1>
        <div className="flex items-center gap-3">
          <Pill tone="green" className="h-7 px-2.5"><LiveDot /> Live · USDC/USDT</Pill>
          <Button variant="primary" onClick={() => { setStep(0); setExecuted(false) }}>
            <IconPlus width={14} height={14} /> Run payroll
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="border-b border-border-subtle px-8 pt-7">
        <div className="grid grid-cols-3">
          {steps.map((s, i) => {
            const active = i === step
            const done = i < step
            return (
              <div key={s} className="flex flex-col">
                <div className="flex items-center gap-3 pb-4">
                  <div
                    className={[
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-medium',
                      active ? 'border-brand-500 text-brand-500' : done ? 'border-brand-500 bg-brand-500 text-bg-base' : 'border-border text-text-muted',
                    ].join(' ')}
                  >
                    {done ? <IconCheck width={14} height={14} /> : i + 1}
                  </div>
                  <div className={active ? 'text-text-primary font-medium' : done ? 'text-text-primary' : 'text-text-muted'}>
                    {s}
                  </div>
                </div>
                <div className={`h-[2px] ${active ? 'bg-brand-500' : done ? 'bg-brand-500/60' : 'bg-border-subtle'}`} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-7">
        {step === 0 && <StepAmounts team={team} updateAmount={updateAmount} total={total} onNext={() => setStep(1)} />}
        {step === 1 && <StepReview team={team} total={total} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
        {step === 2 && <StepExecute team={team} total={total} executed={executed} onExecute={() => setExecuted(true)} onReset={() => { setStep(0); setExecuted(false) }} />}
      </div>
    </div>
  )
}

function StepAmounts({ team, updateAmount, total, onNext }: { team: Member[]; updateAmount: (id: string, v: string) => void; total: number; onNext: () => void }) {
  return (
    <>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight">Set payroll amounts</h2>
          <p className="mt-1 text-[13px] text-text-secondary">Enter USD amounts — USDC conversion is automatic</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import CSV</Button>
          <Button variant="secondary"><IconPlus width={14} height={14} /> Add member</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr_1fr] border-b border-border-subtle bg-white/[0.015] px-6 py-3 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-muted">
          <div>Member</div>
          <div>Country</div>
          <div>Method</div>
          <div>Amount (USD)</div>
          <div>USDC equiv.</div>
        </div>
        <ul>
          {team.map((m) => (
            <li key={m.id} className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr_1fr] items-center border-b border-border-subtle px-6 py-3.5 last:border-b-0">
              <div className="flex items-center gap-3">
                <Avatar initials={m.initials} color={m.avatarColor} />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium text-text-primary">{m.name}</div>
                  <div className="text-[12px] text-text-muted">{m.role}</div>
                </div>
              </div>
              <CountryBadge code={m.countryCode} name={m.country} />
              <div><MethodBadge method={m.method} /></div>
              <div>
                <input
                  type="number"
                  value={m.amount}
                  onChange={(e) => updateAmount(m.id, e.target.value)}
                  className="h-9 w-32 rounded-lg border border-border bg-bg-elevated px-3 font-mono text-[13px] text-text-primary outline-none transition-colors focus:border-brand-500"
                />
              </div>
              <div className="font-mono text-[13px] text-brand-400">≈ {m.amount.toLocaleString()} {m.method === 'EUR Bank' ? 'EUR' : m.method}</div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between bg-white/[0.015] px-6 py-4">
          <div className="text-[13px] text-text-secondary">{team.length} recipients</div>
          <div className="flex items-baseline gap-3">
            <span className="text-[12px] uppercase tracking-[0.08em] text-text-muted">Total</span>
            <span className="font-mono text-[20px] font-semibold tabular-nums">${total.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" size="lg" onClick={onNext}>
          Continue to review <IconArrowRight width={16} height={16} />
        </Button>
      </div>
    </>
  )
}

function StepReview({ team, total, onBack, onNext }: { team: Member[]; total: number; onBack: () => void; onNext: () => void }) {
  const fee = Math.round(total * 0.002 * 100) / 100
  return (
    <>
      <h2 className="text-[20px] font-semibold tracking-tight">Review &amp; confirm</h2>
      <p className="mt-1 text-[13px] text-text-secondary">Double-check amounts and routing before execution</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <SummaryTile label="Total payout" value={`$${total.toLocaleString()}`} />
        <SummaryTile label="Network fee (0.2%)" value={`$${fee.toLocaleString()}`} />
        <SummaryTile label="Est. settlement" value="< 3 min" tone="green" />
      </div>

      <Card className="mt-5 overflow-hidden">
        <ul>
          {team.map((m) => (
            <li key={m.id} className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center border-b border-border-subtle px-6 py-3.5 last:border-b-0">
              <div className="flex items-center gap-3">
                <Avatar initials={m.initials} color={m.avatarColor} size={32} />
                <div>
                  <div className="text-[13.5px] font-medium">{m.name}</div>
                  <div className="text-[12px] text-text-muted">{m.country}</div>
                </div>
              </div>
              <div><MethodBadge method={m.method} /></div>
              <div className="font-mono text-[13px] tabular-nums">${m.amount.toLocaleString()}</div>
              <div className="text-right font-mono text-[13px] text-brand-400">≈ {m.amount.toLocaleString()} {m.method === 'EUR Bank' ? 'EUR' : m.method}</div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-6 flex justify-between">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button variant="primary" size="lg" onClick={onNext}>
          Execute payroll <IconArrowRight width={16} height={16} />
        </Button>
      </div>
    </>
  )
}

function StepExecute({ team, total, executed, onExecute, onReset }: { team: Member[]; total: number; executed: boolean; onExecute: () => void; onReset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-8 text-center">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${executed ? 'bg-brand-500/15 text-brand-500' : 'bg-white/[0.05] text-text-secondary'}`}>
          {executed ? <IconCheck width={28} height={28} /> : <IconBolt width={28} height={28} />}
        </div>
        <h2 className="mt-5 text-[22px] font-semibold">
          {executed ? 'Payroll executed' : 'Ready to send'}
        </h2>
        <p className="mt-1.5 text-[13.5px] text-text-secondary">
          {executed
            ? `Sent $${total.toLocaleString()} to ${team.length} recipients in under 3 minutes.`
            : `$${total.toLocaleString()} to ${team.length} recipients across ${new Set(team.map((t) => t.country)).size} countries.`}
        </p>

        {!executed ? (
          <Button variant="primary" size="lg" className="mt-6" onClick={onExecute}>
            Confirm &amp; send <IconArrowRight width={16} height={16} />
          </Button>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="secondary" onClick={onReset}>Run another</Button>
            <Button variant="primary">View transactions</Button>
          </div>
        )}

        {executed && (
          <ul className="mt-8 divide-y divide-border-subtle text-left">
            {team.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={m.initials} color={m.avatarColor} size={28} />
                  <span className="text-[13.5px]">{m.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12.5px] text-text-secondary">0x{m.id.padStart(4, '0')}…{m.initials.toLowerCase()}{m.id}</span>
                  <Pill tone="green"><IconCheck width={10} height={10} /> Settled</Pill>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
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
