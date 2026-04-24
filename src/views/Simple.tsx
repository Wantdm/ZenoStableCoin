import { Card, Pill, LiveDot, Avatar, MethodBadge } from '../components/UI'
import { team } from '../data'

export function Team() {
  return (
    <Section title="Team">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr] border-b border-border-subtle bg-white/[0.015] px-6 py-3 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-muted">
          <div>Member</div><div>Country</div><div>Method</div><div className="text-right">Monthly</div>
        </div>
        <ul>
          {team.map((m) => (
            <li key={m.id} className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr] items-center border-b border-border-subtle px-6 py-3.5 last:border-b-0">
              <div className="flex items-center gap-3">
                <Avatar initials={m.initials} color={m.avatarColor} />
                <div><div className="text-[13.5px] font-medium">{m.name}</div><div className="text-[12px] text-text-muted">{m.role}</div></div>
              </div>
              <div className="text-[13px] text-text-secondary">{m.country}</div>
              <div><MethodBadge method={m.method} /></div>
              <div className="text-right font-mono text-[13px] tabular-nums">${m.amount.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  )
}

export function Transactions() {
  return (
    <Section title="Transactions">
      <Card className="p-12 text-center">
        <p className="text-[14px] text-text-secondary">Transaction history view coming soon.</p>
      </Card>
    </Section>
  )
}

export function Reports() {
  return (
    <Section title="Reports">
      <Card className="p-12 text-center">
        <p className="text-[14px] text-text-secondary">Reports view coming soon.</p>
      </Card>
    </Section>
  )
}

export function Settings() {
  return (
    <Section title="Settings">
      <Card className="p-12 text-center">
        <p className="text-[14px] text-text-secondary">Settings view coming soon.</p>
      </Card>
    </Section>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-8 py-4">
        <h1 className="text-[18px] font-semibold">{title}</h1>
        <Pill tone="green" className="h-7 px-2.5"><LiveDot /> Live · USDC/USDT</Pill>
      </div>
      <div className="flex-1 overflow-auto px-8 py-7">{children}</div>
    </div>
  )
}
