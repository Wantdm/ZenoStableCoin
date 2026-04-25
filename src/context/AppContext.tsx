import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { team as seedTeam, Member, Method } from '../data'

export type View = 'dashboard' | 'payroll' | 'treasury' | 'team' | 'transactions' | 'reports' | 'settings'
export type Route = 'landing' | 'app'

type Toast = { id: number; msg: string; tone?: 'neutral' | 'green' }

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

  toasts: Toast[]
  toast: (msg: string, tone?: 'neutral' | 'green') => void
  dismissToast: (id: number) => void

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

  useEffect(() => {
    try {
      window.localStorage.setItem('zeno.team', JSON.stringify(team))
    } catch {}
  }, [team])

  const navigate = useCallback((r: Route) => {
    setRoute(r)
    const path = r === 'app' ? '/app' : '/'
    window.history.pushState({ route: r }, '', path)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  useEffect(() => {
    const onPop = () => {
      setRoute(window.location.pathname.startsWith('/app') ? 'app' : 'landing')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const setView = useCallback((v: View) => {
    setViewInner(v)
  }, [])

  const goToPayroll = useCallback(() => {
    setViewInner('payroll')
    setPayrollStep(0)
    setAuthorized(false)
  }, [])

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

  const value = useMemo<Ctx>(() => ({
    route, navigate, view, setView, goToPayroll,
    team, setAmount, addMember, updateMember, removeMember,
    payrollStep, setPayrollStep, authorized, setAuthorized,
    toasts, toast, dismissToast,
    resetDemo,
  }), [route, navigate, view, setView, goToPayroll, team, setAmount, addMember, updateMember, removeMember, payrollStep, authorized, toasts, toast, dismissToast, resetDemo])

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
