import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { Button, Pill, Card, LiveDot, CountUpNumber } from '../components/UI'
import { competitors } from '../data'
import { IconArrowRight, IconBolt, IconGlobe, IconShield, IconTrendUp, IconCheck, IconPayroll } from '../components/Icons'
import { useApp } from '../context/AppContext'

export function Landing() {
  const { navigate } = useApp()
  const launch = () => navigate('app')
  const productRef = useRef<HTMLDivElement>(null)
  const howRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const docsRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border-subtle/80 bg-bg-base/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="focus:outline-none focus:ring-2 focus:ring-brand-500/30 rounded-md">
            <Logo />
          </button>
          <nav className="hidden items-center gap-7 md:flex">
            <NavLink onClick={() => scrollTo(productRef)}>Product</NavLink>
            <NavLink onClick={() => scrollTo(pricingRef)}>Pricing</NavLink>
            <NavLink onClick={() => scrollTo(docsRef)}>Docs</NavLink>
            <NavLink onClick={() => scrollTo(aboutRef)}>About</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={launch}>Sign in</Button>
            <Button variant="primary" size="sm" onClick={launch}>Launch app <IconArrowRight width={14} height={14} /></Button>
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
            <Button variant="primary" size="lg" onClick={launch}>Launch app <IconArrowRight width={16} height={16} /></Button>
            <Button variant="secondary" size="lg" onClick={() => scrollTo(howRef)}>Read the blueprint</Button>
          </div>

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
      <section ref={productRef} className="mx-auto max-w-6xl px-6 pb-20">
        <Card className="overflow-hidden p-0">
          <ProductPreview onEnterApp={launch} />
        </Card>
      </section>

      {/* Savings callout */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <SavingsCallout onEnterApp={launch} />
      </section>

      {/* How it works */}
      <section ref={howRef} className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-400">The blueprint</div>
          <h2 className="mt-3 text-[36px] font-semibold tracking-tight">How it works</h2>
          <p className="mt-3 text-[15px] text-text-secondary">
            Three moves: fund once, earn always, pay in minutes. No new bank account, no multi-day wires.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4">
          <HowStep n="01" title="Fund your treasury" copy="Wire USD or deposit USDC/USDT. Balance auto-routes to tokenized T-bills earning 4.5% APY." />
          <HowStep n="02" title="Set up your team" copy="Import contractors by CSV or paste from your HR tool. Each picks USDC, USDT, or a local-rail off-ramp." />
          <HowStep n="03" title="Run payroll in 3 min" copy="Zeno redeems the exact amount from treasury, fans it out to recipients globally, and writes receipts." />
        </div>
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
          <Feature icon={<IconPayroll />} title="Drop-in API" copy="Trigger payroll from your HR stack — Rippling, Gusto, Notion DBs, or a CSV." />
        </div>
      </section>

      {/* Comparison */}
      <section ref={pricingRef} className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-400">How we compare</div>
          <h2 className="mt-3 text-[36px] font-semibold tracking-tight">Faster, cheaper, and yield-bearing</h2>
        </div>

        <ComparisonTable />
      </section>

      {/* Docs */}
      <section ref={docsRef} className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-8">
            <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-400">Docs</div>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight">Drop-in payroll API</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
              Trigger payroll runs from your existing HR stack with one POST. Webhooks stream live settlement status.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-lg border border-border-subtle bg-bg-base px-4 py-3.5 font-mono text-[12px] leading-relaxed text-text-secondary">
<span className="text-brand-400">POST</span> https://api.zeno.finance/v1/payrolls{'\n'}
<span className="text-text-muted">{"{"}</span>{'\n'}
{"  "}<span className="text-info-500">"idempotency_key"</span>: <span className="text-brand-400">"2026-04-apr"</span>,{'\n'}
{"  "}<span className="text-info-500">"recipients"</span>: [<span className="text-text-muted">…</span>]{'\n'}
<span className="text-text-muted">{"}"}</span>
            </pre>
            <Button variant="secondary" className="mt-5">View API reference <IconArrowRight width={14} height={14} /></Button>
          </Card>
          <Card className="p-8">
            <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-400">Integrations</div>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight">Plays well with your stack</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">Pipe contractors in from the tools you already use. CSV works if you don't.</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {['Rippling', 'Gusto', 'Notion', 'Deel', 'Airtable', 'CSV'].map((n) => (
                <div key={n} className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5 text-center text-[12.5px] text-text-secondary transition-colors hover:border-border hover:text-text-primary">
                  {n}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* About */}
      <section ref={aboutRef} className="mx-auto max-w-6xl px-6 py-20">
        <Card className="grid grid-cols-2 gap-10 p-10">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-400">About</div>
            <h2 className="mt-3 text-[32px] font-semibold tracking-tight">Built for founders paying contractors in 15 time zones.</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
              Traditional payroll was built for full-time W-2 in one country. Zeno is built for the way teams actually work in 2026: mostly remote, mostly 1099, mostly not American.
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="primary" onClick={launch}>Launch app <IconArrowRight width={14} height={14} /></Button>
              <Button variant="secondary">Read our thesis</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat big="< 3m" small="Median settlement" />
            <Stat big="0.2%" small="Flat fee" />
            <Stat big="120+" small="Countries" />
            <Stat big="4.5%" small="Treasury APY" />
          </div>
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
              <Button variant="primary" size="lg" onClick={launch}>Launch app <IconArrowRight width={16} height={16} /></Button>
              <Button variant="secondary" size="lg" onClick={() => scrollTo(howRef)}>Read the blueprint</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-[12.5px] text-text-muted">
          <div className="flex items-center gap-3"><Logo size={22} /><span className="text-text-muted">© 2026 Zeno Labs</span></div>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Status', 'Contact'].map((l) => (
              <a key={l} href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-text-primary">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-[13.5px] text-text-secondary transition-colors duration-150 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 rounded-md px-1">
      {children}
    </button>
  )
}

function Feature({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <Card className="p-6 transition-colors hover:border-border">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-400">{icon}</div>
      <h3 className="mt-4 text-[15px] font-semibold">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">{copy}</p>
    </Card>
  )
}

function HowStep({ n, title, copy }: { n: string; title: string; copy: string }) {
  return (
    <Card className="p-6">
      <div className="font-mono text-[11.5px] font-medium text-brand-400">{n}</div>
      <h3 className="mt-3 text-[16px] font-semibold">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">{copy}</p>
    </Card>
  )
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-elevated px-5 py-4">
      <div className="font-mono text-[22px] font-semibold tabular-nums text-brand-400">{big}</div>
      <div className="mt-1 text-[12px] text-text-muted">{small}</div>
    </div>
  )
}

function SavingsCallout({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <Card className="relative overflow-hidden p-10">
      <div className="absolute inset-0 glow-radial opacity-40" />
      <div className="relative grid grid-cols-5 items-center gap-8">
        <div className="col-span-3">
          <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-400">What you'd save</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight">
            <CountUpNumber target={28800} prefix="$" when="inView" durationMs={1800} className="font-mono text-brand-400" /> per year,{' '}
            for a typical 5-contractor global team.
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Based on a $25,600 monthly payroll. Zeno's 0.2% flat fee vs SWIFT's 2–7%, plus 4.5% APY on your idle operating balance — together that's ~$28.8k / year staying in your treasury instead of leaking to intermediaries.
          </p>
          <div className="mt-5">
            <Button variant="primary" onClick={onEnterApp}>See the math in the app <IconArrowRight width={14} height={14} /></Button>
          </div>
        </div>
        <div className="col-span-2">
          <Card className="bg-bg-elevated p-5">
            <div className="text-[11.5px] uppercase tracking-[0.1em] text-text-muted">Annual cost (5 contractors)</div>
            <ul className="mt-4 space-y-3">
              <Row label="SWIFT wires (5%)" value="$15,360" muted />
              <Row label="Opportunity cost on idle" value="$17,640" muted />
              <Row label="Zeno (0.2%)" value="$614" strike={false} green />
              <div className="my-2 h-px bg-border-subtle" />
              <Row label="Net savings" value="+$28,800" big />
            </ul>
          </Card>
        </div>
      </div>
    </Card>
  )
}

function Row({ label, value, muted, strike, green, big }: { label: string; value: string; muted?: boolean; strike?: boolean; green?: boolean; big?: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span className={`text-[13px] ${muted ? 'text-text-secondary' : 'text-text-primary'} ${big ? 'font-semibold text-text-primary' : ''}`}>{label}</span>
      <span className={`font-mono tabular-nums ${big ? 'text-[18px] font-semibold text-brand-400' : 'text-[13.5px]'} ${strike ? 'line-through text-text-muted' : ''} ${green ? 'text-brand-400' : ''}`}>
        {value}
      </span>
    </li>
  )
}

function ProductPreview({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <button onClick={onEnterApp} className="block w-full text-left transition-transform hover:scale-[1.005]">
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

function ComparisonTable() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  return (
    <Card className="mt-10 overflow-hidden">
      <div className="grid grid-cols-5 border-b border-border-subtle bg-white/[0.015] px-6 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-muted">
        <div>Provider</div>
        <div>Fee</div>
        <div>Speed</div>
        <div>Yield on float</div>
        <div>Coverage</div>
      </div>
      {competitors.map((c, i) => {
        const isZeno = c.highlight
        const isHovered = hoverIdx === i
        const dimmed = hoverIdx === 0 && !isZeno
        return (
          <motion.div
            key={c.name}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            animate={{
              opacity: dimmed ? 0.55 : 1,
              y: isZeno && hoverIdx === 0 ? -2 : 0,
              backgroundColor: isZeno
                ? hoverIdx === 0
                  ? 'rgba(34,197,94,0.10)'
                  : 'rgba(34,197,94,0.04)'
                : isHovered
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(0,0,0,0)',
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-5 items-center border-b border-border-subtle px-6 py-4 last:border-b-0"
          >
            <div className="flex items-center gap-2">
              {isZeno && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
              <span className={`text-[13.5px] ${isZeno ? 'font-semibold text-text-primary' : 'text-text-primary'}`}>{c.name}</span>
              {isZeno && <Pill tone="green" className="ml-1">You</Pill>}
            </div>
            <div className={`font-mono text-[13.5px] tabular-nums ${isZeno ? 'text-brand-400' : 'text-text-primary'}`}>{c.fee}</div>
            <div className={`font-mono text-[13.5px] tabular-nums ${isZeno ? 'text-brand-400' : 'text-text-primary'}`}>{c.speed}</div>
            <div className={`font-mono text-[13.5px] tabular-nums ${isZeno ? 'text-brand-400' : 'text-text-secondary'}`}>{c.yield}</div>
            <div className="text-[13.5px] text-text-secondary">{c.coverage}</div>
          </motion.div>
        )
      })}
    </Card>
  )
}
