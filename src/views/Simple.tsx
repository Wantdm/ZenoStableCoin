import { Card, Pill, LiveDot, Avatar, MethodBadge, Button, CountUpNumber } from '../components/UI'
import { recentActivity } from '../data'
import { useApp } from '../context/AppContext'
import { IconPlus, IconDownload } from '../components/Icons'
import { motion } from 'framer-motion'

export function Team() {
  const { team, toast, goToPayroll } = useApp()
  return (
    <Section title="Team" actions={<Button variant="primary" onClick={goToPayroll}>Run payroll</Button>}>
      <div className="grid grid-cols-4 gap-4">
        {team.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <Card className="p-5 transition-colors hover:border-border">
              <div className="flex items-start justify-between">
                <Avatar initials={m.initials} color={m.avatarColor} size={44} />
                <MethodBadge method={m.method} />
              </div>
              <div className="mt-4 text-[14.5px] font-semibold">{m.name || 'Unnamed'}</div>
              <div className="text-[12.5px] text-text-muted">{m.role}</div>
              <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
                <div className="text-[12px] text-text-muted">{m.country}</div>
                <div className="font-mono text-[13px] tabular-nums">${m.amount.toLocaleString()}<span className="text-text-muted">/mo</span></div>
              </div>
            </Card>
          </motion.div>
        ))}
        <button
          onClick={() => toast('Add member in the payroll flow', 'neutral')}
          className="flex min-h-[172px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-subtle bg-transparent text-text-muted transition-colors hover:border-brand-500/40 hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          <IconPlus width={20} height={20} />
          <span className="text-[13px]">Invite member</span>
        </button>
      </div>
    </Section>
  )
}

const extendedTx = [
  ...recentActivity,
  { id: 'f', type: 'Payroll', detail: 'February payroll · 5 contractors', amount: -24200, date: 'Feb 28' },
  { id: 'g', type: 'Deposit', detail: 'Wire from Mercury · USDC', amount: 75000, date: 'Feb 12' },
  { id: 'h', type: 'Swap', detail: 'USDT → T-bill tokens', amount: -20000, date: 'Feb 05' },
  { id: 'i', type: 'Yield', detail: 'T-bill token yield · accrued', amount: 547, date: 'Jan 31' },
  { id: 'j', type: 'Payroll', detail: 'January payroll · 5 contractors', amount: -23800, date: 'Jan 31' },
]

export function Transactions() {
  const { toast } = useApp()
  return (
    <Section
      title="Transactions"
      actions={
        <>
          <Button variant="secondary" onClick={() => toast('Export queued — CSV ready in seconds', 'green')}>
            <IconDownload width={14} height={14} /> Export CSV
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Mini label="Total in" value={<>$<CountUpNumber target={125000} /></>} />
        <Mini label="Total out" value={<>$<CountUpNumber target={98700} /></>} tone="neutral" />
        <Mini label="Yield earned" value={<>$<CountUpNumber target={1757} /></>} tone="green" />
        <Mini label="Transactions" value={<CountUpNumber target={extendedTx.length} />} />
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_1fr_0.6fr] border-b border-border-subtle bg-white/[0.015] px-6 py-3 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-muted">
          <div>Type</div><div>Detail</div><div className="text-right">Amount</div><div className="text-right">Date</div>
        </div>
        <ul>
          {extendedTx.map((a, i) => (
            <motion.li
              key={a.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="grid grid-cols-[1fr_2fr_1fr_0.6fr] items-center border-b border-border-subtle px-6 py-3 last:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] ${a.amount >= 0 ? 'bg-brand-500/12 text-brand-500' : 'bg-white/[0.05] text-text-secondary'}`}>
                  {a.amount >= 0 ? '+' : '−'}
                </span>
                <span className="text-[13px]">{a.type}</span>
              </div>
              <div className="text-[13px] text-text-secondary">{a.detail}</div>
              <div className={`text-right font-mono text-[13px] tabular-nums ${a.amount >= 0 ? 'text-brand-400' : 'text-text-primary'}`}>
                {a.amount >= 0 ? '+' : '−'}${Math.abs(a.amount).toLocaleString()}
              </div>
              <div className="text-right text-[12.5px] text-text-muted">{a.date}</div>
            </motion.li>
          ))}
        </ul>
      </Card>
    </Section>
  )
}

export function Reports() {
  return (
    <Section title="Reports">
      <ComingSoon title="Reports" desc="1099s, country tax forms, month-end P&L exports — all auto-generated from your payroll runs." />
    </Section>
  )
}

export function Settings() {
  return (
    <Section title="Settings">
      <ComingSoon title="Settings" desc="Workspace, API keys, team permissions, treasury rules, and webhook configuration." />
    </Section>
  )
}

function Section({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-8 py-4 pr-40">
        <h1 className="text-[18px] font-semibold">{title}</h1>
        <div className="flex items-center gap-3">
          <Pill tone="green" className="h-7 px-2.5"><LiveDot /> Live · USDC/USDT</Pill>
          {actions}
        </div>
      </div>
      <div className="flex-1 overflow-auto px-8 py-7">{children}</div>
    </div>
  )
}

function Mini({ label, value, tone = 'neutral' }: { label: string; value: React.ReactNode; tone?: 'neutral' | 'green' }) {
  return (
    <Card className="p-5">
      <div className="text-[11.5px] uppercase tracking-[0.1em] text-text-muted">{label}</div>
      <div className={`mt-2 font-mono text-[22px] font-semibold tabular-nums ${tone === 'green' ? 'text-brand-400' : 'text-text-primary'}`}>{value}</div>
    </Card>
  )
}

function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="mx-auto max-w-xl p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>
      <h2 className="mt-5 text-[20px] font-semibold">{title} · coming soon</h2>
      <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-text-secondary">{desc}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11.5px]">
        {['Design spec'].map((s) => <Pill key={s} tone="green">{s} · ready</Pill>)}
        {['Engineering'].map((s) => <Pill key={s} tone="amber">{s} · in progress</Pill>)}
      </div>
    </Card>
  )
}
