import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from './Logo'
import { IconDashboard, IconPayroll, IconTreasury, IconTeam, IconTx, IconReports, IconSettings, IconChevronDown } from './Icons'
import { useApp, View } from '../context/AppContext'
import { preloadView } from '../preload'

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

export function Sidebar() {
  const { view, setView, navigate, toast, setPaletteOpen } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-border-subtle bg-bg-sidebar">
      <button
        onClick={() => navigate('landing')}
        className="rounded-md px-5 pt-5 pb-6 text-left transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        title="Back to homepage"
      >
        <Logo />
      </button>

      <nav className="flex-1 px-3">
        <SectionLabel>Main</SectionLabel>
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <NavItem key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} onPrefetch={() => preloadView[item.id]()} />
          ))}
        </ul>

        <SectionLabel className="mt-7">Finance</SectionLabel>
        <ul className="space-y-0.5">
          {financeNav.map((item) => (
            <NavItem key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} onPrefetch={() => preloadView[item.id]()} />
          ))}
        </ul>

        <button
          onClick={() => setPaletteOpen(true)}
          className="mt-5 flex w-full items-center justify-between rounded-lg border border-border-subtle bg-transparent px-3 py-2 text-[12px] text-text-muted transition-colors hover:border-brand-500/40 hover:bg-white/[0.02] hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          title="Command palette"
        >
          <span className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            Search…
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border-subtle bg-white/[0.04] px-1 py-px font-mono text-[9.5px]">{isMac ? '⌘' : 'Ctrl'}</kbd>
            <kbd className="rounded border border-border-subtle bg-white/[0.04] px-1 py-px font-mono text-[9.5px]">K</kbd>
          </span>
        </button>
      </nav>

      <div className="relative p-3" ref={menuRef}>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.14 }}
              className="absolute bottom-[74px] left-3 right-3 z-30 overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated shadow-xl"
            >
              <button
                className="block w-full px-3 py-2.5 text-left text-[13px] text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
                onClick={() => { setMenuOpen(false); toast('Only Acme Corp is set up in this demo') }}
              >
                Switch workspace
              </button>
              <div className="border-t border-border-subtle" />
              <button
                className="block w-full px-3 py-2.5 text-left text-[13px] text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
                onClick={() => { setMenuOpen(false); toast('Signed out (demo)') }}
              >
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated px-3 py-2.5 text-left transition-colors hover:border-border focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-500 text-sm font-semibold text-white">AC</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[13.5px] font-medium text-text-primary">Acme Corp</span>
              <span className="rounded bg-brand-500/15 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand-400">Demo</span>
            </div>
            <div className="truncate text-[11.5px] text-text-muted">Growth plan</div>
          </div>
          <IconChevronDown width={14} height={14} className={`text-text-muted transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>
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

function NavItem({ item, active, onClick, onPrefetch }: { item: { label: string; icon: React.FC<any>; badge?: string }; active: boolean; onClick: () => void; onPrefetch?: () => void }) {
  const Icon = item.icon
  return (
    <li>
      <button
        onClick={onClick}
        onMouseEnter={onPrefetch}
        onFocus={onPrefetch}
        className={[
          'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
          active ? 'text-brand-400' : 'text-text-secondary hover:bg-white/[0.03] hover:text-text-primary',
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
