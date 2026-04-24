import { Logo } from './Logo'
import { IconDashboard, IconPayroll, IconTreasury, IconTeam, IconTx, IconReports, IconSettings } from './Icons'
import type { View } from '../App'

const mainNav: { id: View; label: string; icon: React.FC<any>; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
  { id: 'payroll', label: 'Payroll', icon: IconPayroll, badge: 'Run' },
  { id: 'treasury', label: 'Treasury', icon: IconTreasury },
  { id: 'team', label: 'Team', icon: IconTeam },
]

const financeNav: { id: View; label: string; icon: React.FC<any> }[] = [
  { id: 'transactions', label: 'Transactions', icon: IconTx },
  { id: 'reports', label: 'Reports', icon: IconReports },
  { id: 'settings', label: 'Settings', icon: IconSettings },
]

export function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-border-subtle bg-bg-sidebar">
      <div className="px-5 pt-5 pb-6">
        <Logo />
      </div>

      <nav className="flex-1 px-3">
        <SectionLabel>Main</SectionLabel>
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <NavItem key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
          ))}
        </ul>

        <SectionLabel className="mt-7">Finance</SectionLabel>
        <ul className="space-y-0.5">
          {financeNav.map((item) => (
            <NavItem key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
          ))}
        </ul>
      </nav>

      <div className="p-3">
        <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-500 text-sm font-semibold text-white">AC</div>
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-medium text-text-primary">Acme Corp</div>
            <div className="truncate text-[11.5px] text-text-muted">Growth plan</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-3 pb-2 pt-2 text-[10.5px] font-medium uppercase tracking-[0.12em] text-text-muted ${className}`}>
      {children}
    </div>
  )
}

function NavItem({ item, active, onClick }: { item: { label: string; icon: React.FC<any>; badge?: string }; active: boolean; onClick: () => void }) {
  const Icon = item.icon
  return (
    <li>
      <button
        onClick={onClick}
        className={[
          'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors',
          active
            ? 'bg-brand-500/12 text-brand-400'
            : 'text-text-secondary hover:bg-white/[0.03] hover:text-text-primary',
        ].join(' ')}
        style={active ? { backgroundColor: 'rgba(34,197,94,0.10)' } : undefined}
      >
        <Icon className={active ? 'text-brand-500' : ''} />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[10px] font-semibold text-bg-base">
            {item.badge}
          </span>
        )}
      </button>
    </li>
  )
}
