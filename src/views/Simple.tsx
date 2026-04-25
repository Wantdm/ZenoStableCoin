import { useMemo } from 'react'
import { Card, Pill, LiveDot, Avatar, MethodBadge, Button, CountUpNumber } from '../components/UI'
import { useApp, formatActivityDate, Activity } from '../context/AppContext'
import { IconPlus, IconDownload } from '../components/Icons'
import { AnimatePresence, motion } from 'framer-motion'
import { TopBar } from '../components/TopBar'

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

const archiveTx: Activity[] = [
  { id: 'f', type: 'Payroll', detail: 'February payroll · 5 contractors', amount: -24200, date: 'Feb 28' },
  { id: 'g', type: 'Deposit', detail: 'Wire from Mercury · USDC', amount: 75000, date: 'Feb 12' },
  { id: 'h', type: 'Swap', detail: 'USDT → T-bill tokens', amount: -20000, date: 'Feb 05' },
  { id: 'i', type: 'Yield', detail: 'T-bill token yield · accrued', amount: 547, date: 'Jan 31' },
  { id: 'j', type: 'Payroll', detail: 'January payroll · 5 contractors', amount: -23800, date: 'Jan 31' },
]

export function Transactions() {
  const { toast, activity } = useApp()
  const allTx = useMemo(() => [...activity, ...archiveTx], [activity])
  const totals = useMemo(() => {
    const inSum = allTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
    const outSum = allTx.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
    const yieldSum = allTx.filter((t) => t.type === 'Yield').reduce((s, t) => s + t.amount, 0)
    return { inSum, outSum, yieldSum }
  }, [allTx])

  const exportCsv = () => {
    const escape = (v: string) => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
    const header = ['Type', 'Detail', 'Amount (USD)', 'Date']
    const rows = allTx.map((t) => [t.type, t.detail, t.amount.toFixed(2), formatActivityDate(t)])
    const csv = [header, ...rows].map((row) => row.map((cell) => escape(String(cell))).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zeno-transactions-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast(`Exported ${allTx.length} transactions`, 'green')
  }

  return (
    <Section
      title="Transactions"
      actions={
        <>
          <Button variant="secondary" onClick={exportCsv}>
            <IconDownload width={14} height={14} /> Export CSV
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Mini label="Total in" value={<>$<CountUpNumber target={totals.inSum} /></>} />
        <Mini label="Total out" value={<>$<CountUpNumber target={totals.outSum} /></>} tone="neutral" />
        <Mini label="Yield earned" value={<>$<CountUpNumber target={totals.yieldSum} /></>} tone="green" />
        <Mini label="Transactions" value={<CountUpNumber target={allTx.length} />} />
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_1fr_0.6fr] border-b border-border-subtle bg-white/[0.015] px-6 py-3 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-muted">
          <div>Type</div><div>Detail</div><div className="text-right">Amount</div><div className="text-right">Date</div>
        </div>
        <ul>
          <AnimatePresence initial={false}>
            {allTx.map((a, i) => (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, delay: Math.min(i * 0.015, 0.2) }}
                className="grid grid-cols-[1fr_2fr_1fr_0.6fr] items-center border-b border-border-subtle px-6 py-3 last:border-b-0 overflow-hidden"
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
                <div className="text-right text-[12.5px] text-text-muted">{formatActivityDate(a)}</div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Card>
    </Section>
  )
}

export function Reports() {
  const { team, activity, toast } = useApp()

  const downloadCsv = (filename: string, rows: (string | number)[][]) => {
    const escape = (v: string) => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
    const csv = rows.map((r) => r.map((c) => escape(String(c))).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast(`${filename} downloaded`, 'green')
  }

  const reports = [
    ...team.map((m) => ({
      id: `1099-${m.id}`,
      name: `1099-NEC · ${m.name || 'Unnamed'}`,
      kind: '1099-NEC',
      period: 'Tax year 2026 · YTD',
      ready: true as const,
      onDownload: () => downloadCsv(
        `1099-${(m.name || 'unnamed').replace(/\s+/g, '-').toLowerCase()}-2026.csv`,
        [
          ['Form', 'Recipient', 'Country', 'Method', 'YTD Payments (USD)', 'Tax year'],
          ['1099-NEC', m.name || 'Unnamed', m.country, m.method, (m.amount * 4).toFixed(2), 2026],
        ],
      ),
    })),
    {
      id: 'pl-q1',
      name: 'Q1 2026 · P&L summary',
      kind: 'P&L',
      period: 'Jan 1 – Mar 31, 2026',
      ready: true as const,
      onDownload: () => {
        const inSum = activity.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
        const outSum = activity.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
        const yieldSum = activity.filter((t) => t.type === 'Yield').reduce((s, t) => s + t.amount, 0)
        downloadCsv('zeno-pl-q1-2026.csv', [
          ['Metric', 'Value (USD)'],
          ['Total inflows', inSum.toFixed(2)],
          ['Total outflows', outSum.toFixed(2)],
          ['Treasury yield', yieldSum.toFixed(2)],
          ['Net', (inSum - outSum).toFixed(2)],
        ])
      },
    },
    {
      id: 'treasury-stmt',
      name: 'Treasury statement · April',
      kind: 'Statement',
      period: 'Apr 1 – Apr 30, 2026',
      ready: true as const,
      onDownload: () => downloadCsv('zeno-treasury-apr-2026.csv', [
        ['Date', 'Type', 'Detail', 'Amount (USD)'],
        ...activity.map((t) => [t.date, t.type, t.detail, t.amount.toFixed(2)]),
      ]),
    },
    {
      id: 'country-tax-br',
      name: 'Brazil · contractor tax filing',
      kind: 'Country form',
      period: 'Q1 2026',
      ready: false as const,
      onDownload: () => toast('Brazil filing — generating in background, ETA 30s'),
    },
    {
      id: 'country-tax-in',
      name: 'India · contractor tax filing',
      kind: 'Country form',
      period: 'Q1 2026',
      ready: false as const,
      onDownload: () => toast('India filing — generating in background, ETA 30s'),
    },
  ]

  return (
    <Section title="Reports">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_120px] border-b border-border-subtle bg-white/[0.015] px-6 py-3 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-muted">
          <div>Report</div>
          <div>Type</div>
          <div>Period</div>
          <div className="text-right">Status</div>
        </div>
        <ul>
          {reports.map((r) => (
            <li key={r.id} className="grid grid-cols-[2fr_1fr_1fr_120px] items-center border-b border-border-subtle px-6 py-3 last:border-b-0">
              <div className="text-[13.5px] font-medium text-text-primary">{r.name}</div>
              <div className="text-[12.5px] text-text-secondary">{r.kind}</div>
              <div className="text-[12.5px] text-text-muted">{r.period}</div>
              <div className="flex items-center justify-end">
                {r.ready ? (
                  <Button variant="secondary" size="sm" onClick={r.onDownload}>
                    <IconDownload width={12} height={12} /> CSV
                  </Button>
                ) : (
                  <button
                    onClick={r.onDownload}
                    className="rounded-md border border-border-subtle bg-transparent px-2.5 py-1 text-[11.5px] text-text-muted hover:border-amber-500/40 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    Generating…
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <p className="mt-5 text-center text-[12px] text-text-muted">
        Reports are auto-generated from payroll activity. Country forms (BR, IN) ship next.
      </p>
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
      <TopBar title={title}>
        <Pill tone="green" className="h-7 px-2.5"><LiveDot /> Live · USDC/USDT</Pill>
        {actions}
      </TopBar>
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
