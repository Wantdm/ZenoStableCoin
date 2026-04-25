import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import { team as seedTeam, treasury as seedTreasury, recentActivity as seedActivity, Member, Method } from '../data'

export type View = 'dashboard' | 'payroll' | 'treasury' | 'team' | 'transactions' | 'reports' | 'settings'
export type Route = 'landing' | 'app'

type Toast = { id: number; msg: string; tone?: 'neutral' | 'green' }

export type Activity = {
  id: string
  type: 'Payroll' | 'Yield' | 'Deposit' | 'Swap'
  detail: string
  amount: number
  date: string
  createdAt?: number
}

export function formatActivityDate(a: Activity, now: number = Date.now()): string {
  if (!a.createdAt) return a.date
  const elapsed = now - a.createdAt
  if (elapsed < 5_000) return 'Just now'
  if (elapsed < 60_000) return `${Math.floor(elapsed / 1000)}s ago`
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m ago`
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h ago`
  return a.date
}

type Ctx = {
  route: Route
  navigate: (r: Route) => void
  view: View
  setView: (v: View) => void
  goToPayroll: () => void

  team: Member[]
  setAmount: (id: string, amount: number) => void
  addMember: (m: Partial<Member>) => string
  updateMember: (id: string, patch: Partial<Member>) => void
  removeMember: (id: string) => void

  payrollStep: 0 | 1 | 2
  setPayrollStep: (s: 0 | 1 | 2) => void
  authorized: boolean
  setAuthorized: (v: boolean) => void
  isExecuting: boolean

  treasuryBalance: number
  treasuryYieldMtd: number
  activity: Activity[]
  addTransaction: (tx: Omit<Activity, 'id'> & { id?: string }) => void

  toasts: Toast[]
  toast: (msg: string, tone?: 'neutral' | 'green') => void
  dismissToast: (id: number) => void

  paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void

  resetDemo: () => void
}

const AppCtx = createContext<Ctx | null>(null)

export function useApp() {
  const v = useContext(AppCtx)
  if (!v) throw new Error('useApp must be used inside AppProvider')
  return v
}

const randAvatarColor = () => {
  const pool = ['bg-emerald-600', 'bg-sky-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-teal-600', 'bg-indigo-600']
  return pool[Math.floor(Math.random() * pool.length)]
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => (window.location.pathname.startsWith('/app') ? 'app' : 'landing'))
  const [view, setViewInner] = useState<View>('dashboard')
  const [team, setTeam] = useState<Member[]>(() => {
    try {
      const raw = window.localStorage.getItem('zeno.team')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length) return parsed as Member[]
      }
    } catch {}
    return seedTeam
  })
  const [payrollStep, setPayrollStep] = useState<0 | 1 | 2>(0)
  const [authorized, setAuthorized] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const [treasuryBalance, setTreasuryBalance] = useState(seedTreasury.balance)
  const [treasuryYieldMtd, setTreasuryYieldMtd] = useState(seedTreasury.yieldMtd)
  const [activity, setActivity] = useState<Activity[]>(seedActivity as Activity[])
  const [paletteOpen, setPaletteOpen] = useState(false)
  const balanceTargetRef = useRef(seedTreasury.balance)

  useEffect(() => {
    try {
      window.localStorage.setItem('zeno.team', JSON.stringify(team))
    } catch {}
  }, [team])

  // Random-walk treasury balance toward a moving target every 3–5s
  useEffect(() => {
    let timer: number
    const schedule = () => {
      const delay = 3000 + Math.random() * 2000
      timer = window.setTimeout(() => {
        setTreasuryBalance((b) => {
          const drift = (Math.random() - 0.5) * 100
          const target = balanceTargetRef.current + (Math.random() - 0.5) * 100
          return Math.round((b + (target - b) * 0.6 + drift * 0.2) * 100) / 100
        })
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  // Yield ticks every 12s — visible during a demo
  useEffect(() => {
    const id = window.setInterval(() => {
      setTreasuryYieldMtd((v) => Math.round((v + 0.5 + Math.random() * 1.5) * 100) / 100)
    }, 12000)
    return () => clearInterval(id)
  }, [])

  const navigate = useCallback((r: Route) => {
    setRoute(r)
    const path = r === 'app' ? '/app' : '/'
    window.history.pushState({ route: r }, '', path)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      setRoute(window.location.pathname.startsWith('/app') ? 'app' : 'landing')
      const v = e.state?.view as View | undefined
      if (v) setViewInner(v)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const setView = useCallback((v: View) => {
    setViewInner((prev) => {
      if (prev !== v) {
        window.history.pushState({ route: 'app', view: v }, '', '/app')
      }
      return v
    })
  }, [])

  const goToPayroll = useCallback(() => {
    setView('payroll')
    setPayrollStep(0)
    setAuthorized(false)
  }, [setView])

  const setAmount = useCallback((id: string, amount: number) => {
    setTeam((t) => t.map((m) => (m.id === id ? { ...m, amount } : m)))
  }, [])

  const addMember = useCallback((m: Partial<Member>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 6)
    const initials = (m.name || '').split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase() || '??'
    const newMember: Member = {
      id,
      name: m.name ?? '',
      role: m.role ?? 'Contractor',
      country: m.country ?? 'United States',
      countryCode: m.countryCode ?? 'US',
      method: (m.method as Method) ?? 'USDC',
      amount: m.amount ?? 3000,
      initials,
      avatarColor: m.avatarColor ?? randAvatarColor(),
    }
    setTeam((t) => [...t, newMember])
    return id
  }, [])

  const updateMember = useCallback((id: string, patch: Partial<Member>) => {
    setTeam((t) => t.map((m) => {
      if (m.id !== id) return m
      const next = { ...m, ...patch }
      if (patch.name !== undefined) {
        next.initials = patch.name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase() || '??'
      }
      return next
    }))
  }, [])

  const removeMember = useCallback((id: string) => {
    setTeam((t) => t.filter((m) => m.id !== id))
  }, [])

  const addTransaction = useCallback((tx: Omit<Activity, 'id'> & { id?: string }) => {
    const id = tx.id ?? String(Date.now()) + Math.random().toString(36).slice(2, 6)
    const createdAt = tx.createdAt ?? Date.now()
    setActivity((a) => [{ ...tx, id, createdAt }, ...a])
    balanceTargetRef.current = Math.max(0, balanceTargetRef.current + tx.amount)
    setTreasuryBalance((b) => Math.max(0, b + tx.amount))
  }, [])

  // Live yield event every ~70s — adds a new "Yield · accrued" entry so the
  // activity feed feels alive during the demo, not just during a payroll.
  useEffect(() => {
    const id = window.setInterval(() => {
      const amt = Math.round(20 + Math.random() * 60)
      addTransaction({
        type: 'Yield',
        detail: 'T-bill token yield · accrued',
        amount: amt,
        date: 'Today',
      })
    }, 70000)
    return () => clearInterval(id)
  }, [addTransaction])

  const toast = useCallback((msg: string, tone: 'neutral' | 'green' = 'neutral') => {
    const id = Date.now() + Math.random()
    setToasts((ts) => [...ts, { id, msg, tone }])
    window.setTimeout(() => {
      setToasts((ts) => ts.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id))
  }, [])

  const resetDemo = useCallback(() => {
    setTeam(seedTeam)
    setPayrollStep(0)
    setAuthorized(false)
    setActivity(seedActivity as Activity[])
    setTreasuryBalance(seedTreasury.balance)
    setTreasuryYieldMtd(seedTreasury.yieldMtd)
    balanceTargetRef.current = seedTreasury.balance
    try {
      window.localStorage.removeItem('zeno.team')
    } catch {}
    toast('Demo reset', 'green')
  }, [toast])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setToasts([])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isExecuting = view === 'payroll' && payrollStep === 2

  const value = useMemo<Ctx>(() => ({
    route, navigate, view, setView, goToPayroll,
    team, setAmount, addMember, updateMember, removeMember,
    payrollStep, setPayrollStep, authorized, setAuthorized, isExecuting,
    treasuryBalance, treasuryYieldMtd, activity, addTransaction,
    toasts, toast, dismissToast,
    paletteOpen, setPaletteOpen,
    resetDemo,
  }), [route, navigate, view, setView, goToPayroll, team, setAmount, addMember, updateMember, removeMember, payrollStep, authorized, isExecuting, treasuryBalance, treasuryYieldMtd, activity, addTransaction, toasts, toast, dismissToast, paletteOpen, resetDemo])

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
