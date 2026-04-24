import { Logo } from '../components/Logo'
import { Button, Pill, Card, LiveDot } from '../components/UI'
import { competitors } from '../data'
import { IconArrowRight, IconBolt, IconGlobe, IconShield, IconTrendUp, IconCheck } from '../components/Icons'

export function Landing({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border-subtle/80 bg-bg-base/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            {['Product', 'Treasury', 'Pricing', 'Customers', 'Docs'].map((n) => (
              <a key={n} href="#" className="text-[13.5px] text-text-secondary hover:text-text-primary">{n}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEnterApp}>Sign in</Button>
            <Button variant="primary" size="sm" onClick={onEnterApp}>Open app <IconArrowRight width={14} height={14} /></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-x-0 top-0 h-[520px] glow-radial" />
        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
          <Pill tone="green" className="h-7 px-3"><LiveDot /> USDC/USDT mainnet · live</Pill>
          <h1 className="mx-auto mt-6 max-w-3xl text-[56px] font-semibold leading-[1.04] tracking-[-0.02em]">
            Stablecoin payroll for{' '}
            <span className="text-brand-400">global teams.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-text-secondary">
            Pay global contractors in under 3 minutes at <span className="font-mono text-text-primary">0.2%</span> — versus{' '}
            <span className="font-mono text-text-primary">2–7%</span> and <span className="font-mono text-text-primary">3–5 days</span> with SWIFT.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={onEnterApp}>Open the app <IconArrowRight width={16} height={16} /></Button>
            <Button variant="secondary" size="lg">Book a demo</Button>
          </div>

          {/* Hero numbers */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle">
            {[
              ['0.2%', 'Network fee'],
              ['< 3 min', 'Settlement'],
              ['4.5%', 'Treasury APY'],
            ].map(([v, l]) => (
              <div key={l} className="bg-bg-surface px-6 py-6 text-left">
                <div className="font-mono text-[26px] font-semibold tracking-tight text-brand-400">{v}</div>
                <div className="mt-1 text-[12.5px] text-text-secondary">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Card className="overflow-hidden p-0">
          <ProductPreview onEnterApp={onEnterApp} />
        </Card>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-400">Why Zeno</div>
          <h2 className="mt-3 text-[36px] font-semibold tracking-tight">Built for the way payroll should work</h2>
          <p className="mt-3 text-[15px] text-text-secondary">Cut the wires. Keep your float earning. Send to anyone, anywhere, in minutes.</p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4">
          <Feature icon={<IconBolt />} title="3-minute payouts" copy="Stablecoin rails settle in seconds. No bank holidays, no cutoffs, no chasing wires." />
          <Feature icon={<IconGlobe />} title="120+ countries" copy="USDC, USDT, and local-rail off-ramps where contractors want them." />
          <Feature icon={<IconTrendUp />} title="Yield on idle cash" copy="Operating balance auto-routes to tokenized T-bills. Redeem for any payroll run." />
          <Feature icon={<IconShield />} title="SOC 2 + audited" copy="Bankruptcy-remote treasury, segregated wallets, full transaction trail." />
          <Feature icon={<IconCheck />} title="One-click compliance" copy="Auto-generated 1099s, contractor agreements, and country-specific tax forms." />
          <Feature icon={<IconArrowRight />} title="Drop-in API" copy="Trigger payroll from your HR stack — Rippling, Gusto, Notion DBs, or a CSV." />
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-400">How we compare</div>
          <h2 className="mt-3 text-[36px] font-semibold tracking-tight">Faster, cheaper, and yield-bearing</h2>
        </div>

        <Card className="mt-10 overflow-hidden">
          <div className="grid grid-cols-5 border-b border-border-subtle bg-white/[0.015] px-6 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-muted">
            <div>Provider</div>
            <div>Fee</div>
            <div>Speed</div>
            <div>Yield on float</div>
            <div>Coverage</div>
          </div>
          {competitors.map((c) => (
            <div
              key={c.name}
              className={`grid grid-cols-5 items-center border-b border-border-subtle px-6 py-4 last:border-b-0 ${c.highlight ? 'bg-brand-500/[0.04]' : ''}`}
            >
              <div className="flex items-center gap-2">
                {c.highlight && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                <span className={`text-[13.5px] ${c.highlight ? 'font-semibold text-text-primary' : 'text-text-primary'}`}>{c.name}</span>
                {c.highlight && <Pill tone="green" className="ml-1">You</Pill>}
              </div>
              <div className={`font-mono text-[13.5px] tabular-nums ${c.highlight ? 'text-brand-400' : 'text-text-primary'}`}>{c.fee}</div>
              <div className={`font-mono text-[13.5px] tabular-nums ${c.highlight ? 'text-brand-400' : 'text-text-primary'}`}>{c.speed}</div>
              <div className={`font-mono text-[13.5px] tabular-nums ${c.highlight ? 'text-brand-400' : 'text-text-secondary'}`}>{c.yield}</div>
              <div className="text-[13.5px] text-text-secondary">{c.coverage}</div>
            </div>
          ))}
        </Card>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-12 text-center">
          <div className="absolute inset-0 glow-radial" />
          <div className="relative">
            <h2 className="text-[36px] font-semibold tracking-tight">Run your next payroll in 3 minutes.</h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-text-secondary">
              No bank wires. No 2–7% fees. No 3–5 day settlement. Just stablecoin rails and a treasury that earns.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <Button variant="primary" size="lg" onClick={onEnterApp}>Open the app <IconArrowRight width={16} height={16} /></Button>
              <Button variant="secondary" size="lg">Book a demo</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-[12.5px] text-text-muted">
          <div className="flex items-center gap-3"><Logo size={22} /><span className="text-text-muted">© 2026 Zeno Labs</span></div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-primary">Privacy</a>
            <a href="#" className="hover:text-text-primary">Terms</a>
            <a href="#" className="hover:text-text-primary">Status</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Feature({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <Card className="p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-400">{icon}</div>
      <h3 className="mt-4 text-[15px] font-semibold">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">{copy}</p>
    </Card>
  )
}

function ProductPreview({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <button onClick={onEnterApp} className="block w-full text-left">
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-elevated px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="font-mono text-[11.5px] text-text-muted">app.zeno.finance/payroll</div>
        <Pill tone="green"><LiveDot /> Live</Pill>
      </div>
      <div className="grid grid-cols-[200px_1fr] gap-0 bg-bg-base">
        <div className="border-r border-border-subtle bg-bg-sidebar p-4">
          {['Dashboard', 'Payroll', 'Treasury', 'Team'].map((l, i) => (
            <div key={l} className={`mb-1 rounded-md px-3 py-2 text-[12.5px] ${i === 1 ? 'bg-brand-500/10 text-brand-400' : 'text-text-secondary'}`}>{l}</div>
          ))}
        </div>
        <div className="p-6">
          <div className="text-[11.5px] uppercase tracking-[0.12em] text-text-muted">Total payout</div>
          <div className="mt-1 font-mono text-[34px] font-semibold tabular-nums">$25,600</div>
          <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-brand-400"><IconBolt width={12} height={12} /> Settles in 2 min 18 s</div>
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {['Ana · BR', 'Rohan · IN', 'Léa · FR', 'Ji-woo · KR', 'Amara · GH', '+2 more'].map((s, i) => (
              <div key={s} className={`rounded-lg border px-3 py-2 text-[12px] ${i === 5 ? 'border-dashed border-border text-text-muted' : 'border-border-subtle bg-bg-elevated text-text-primary'}`}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}
