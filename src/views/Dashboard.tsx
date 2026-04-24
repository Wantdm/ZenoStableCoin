import { Card, Pill, LiveDot, Button, Avatar, MethodBadge } from '../components/UI'
import { treasury, team, recentActivity } from '../data'
import { IconTrendUp, IconArrowRight, IconBolt } from '../components/Icons'
import type { View } from '../App'

export function Dashboard({ setView }: { setView: (v: View) => void }) {
  const monthly = team.reduce((s, m) => s + m.amount, 0)
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-8 py-4">
        <h1 className="text-[18px] font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Pill tone="green" className="h-7 px-2.5"><LiveDot /> Live · USDC/USDT</Pill>
          <Button variant="primary" onClick={() => setView('payroll')}>
            <IconBolt width={14} height={14} /> Run payroll
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-7">
        <div className="grid grid-cols-4 gap-4">
          <Stat label="Treasury balance" value={`$${treasury.balance.toLocaleString()}`} sub={`+$${treasury.yieldMtd.toLocaleString()} MTD`} subTone="green" />
          <Stat label="Yield (APY)" value={`${treasury.apy}%`} sub="Auto-compounded" />
          <Stat label="Monthly payroll" value={`$${monthly.toLocaleString()}`} sub={`${team.length} contractors`} />
          <Stat label="Avg settlement" value="< 3 min" sub="0.2% fee" subTone="green" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14.5px] font-semibold">Treasury growth</div>
                <div className="text-[12px] text-text-muted">Last 12 months · including yield</div>
              </div>
              <div className="flex items-center gap-2 text-[12.5px] text-brand-400"><IconTrendUp width={14} height={14} /> +18.4%</div>
            </div>
            <Sparkline />
          </Card>

          <Card className="p-6">
            <div className="text-[14.5px] font-semibold">Next payroll</div>
            <div className="mt-2 font-mono text-[28px] font-semibold tabular-nums">${monthly.toLocaleString()}</div>
            <div className="text-[12.5px] text-text-secondary">Scheduled · April 30</div>
            <div className="mt-5 flex -space-x-2">
              {team.map((m) => (
                <div key={m.id} className="ring-2 ring-bg-surface rounded-full"><Avatar initials={m.initials} color={m.avatarColor} size={28} /></div>
              ))}
            </div>
            <Button variant="secondary" className="mt-5 w-full" onClick={() => setView('payroll')}>
              Review payroll <IconArrowRight width={14} height={14} />
            </Button>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="col-span-2 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
              <h3 className="text-[14.5px] font-semibold">Team</h3>
              <Button variant="ghost" size="sm" onClick={() => setView('team')}>View team <IconArrowRight width={12} height={12} /></Button>
            </div>
            <ul>
              {team.map((m) => (
                <li key={m.id} className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr] items-center border-b border-border-subtle px-6 py-3 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Avatar initials={m.initials} color={m.avatarColor} size={32} />
                    <div>
                      <div className="text-[13.5px] font-medium">{m.name}</div>
                      <div className="text-[12px] text-text-muted">{m.role}</div>
                    </div>
                  </div>
                  <div className="text-[13px] text-text-secondary">{m.country}</div>
                  <div><MethodBadge method={m.method} /></div>
                  <div className="text-right font-mono text-[13px] tabular-nums">${m.amount.toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-border-subtle px-6 py-4">
              <h3 className="text-[14.5px] font-semibold">Recent activity</h3>
            </div>
            <ul>
              {recentActivity.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-center justify-between border-b border-border-subtle px-6 py-3 last:border-b-0">
                  <div>
                    <div className="text-[13px] font-medium">{a.type}</div>
                    <div className="text-[11.5px] text-text-muted">{a.date}</div>
                  </div>
                  <div className={`font-mono text-[13px] tabular-nums ${a.amount >= 0 ? 'text-brand-400' : 'text-text-primary'}`}>
                    {a.amount >= 0 ? '+' : '−'}${Math.abs(a.amount).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, sub, subTone = 'muted' }: { label: string; value: string; sub: string; subTone?: 'muted' | 'green' }) {
  return (
    <Card className="p-5">
      <div className="text-[11.5px] uppercase tracking-[0.1em] text-text-muted">{label}</div>
      <div className="mt-2 font-mono text-[22px] font-semibold tabular-nums tracking-tight">{value}</div>
      <div className={`mt-1 text-[12px] ${subTone === 'green' ? 'text-brand-400' : 'text-text-muted'}`}>{sub}</div>
    </Card>
  )
}

function Sparkline() {
  const points = [40, 42, 48, 46, 55, 60, 58, 68, 72, 78, 82, 92]
  const w = 720, h = 160, pad = 8
  const max = Math.max(...points), min = Math.min(...points)
  const path = points
    .map((p, i) => {
      const x = pad + (i * (w - pad * 2)) / (points.length - 1)
      const y = h - pad - ((p - min) / (max - min)) * (h - pad * 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-5 w-full">
      <defs>
        <linearGradient id="dg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`} fill="url(#dg)" />
      <path d={path} stroke="#22c55e" strokeWidth="1.8" fill="none" />
    </svg>
  )
}
