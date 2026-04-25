import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp, View } from './context/AppContext'
import { Sidebar } from './components/Sidebar'
import { ToastHost } from './components/Toast'
import { CommandPalette } from './components/CommandPalette'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Landing } from './views/Landing'
import { Dashboard } from './views/Dashboard'
import { Payroll } from './views/Payroll'
import { Treasury } from './views/Treasury'
import { Team, Transactions, Reports, Settings } from './views/Simple'

const navMap: Record<string, View> = {
  d: 'dashboard',
  p: 'payroll',
  y: 'treasury',
  t: 'team',
  x: 'transactions',
  r: 'reports',
  s: 'settings',
}

function useNavShortcuts() {
  const { setView, paletteOpen, route } = useApp()
  const lastG = useRef(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (paletteOpen || route !== 'app') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return

      const now = Date.now()
      if (e.key === 'g' || e.key === 'G') {
        lastG.current = now
        return
      }
      if (now - lastG.current < 1200) {
        const v = navMap[e.key.toLowerCase()]
        if (v) {
          e.preventDefault()
          setView(v)
          lastG.current = 0
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setView, paletteOpen, route])
}

function Shell() {
  const { route, view } = useApp()
  useNavShortcuts()

  return (
    <AnimatePresence mode="wait">
      {route === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Landing />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative flex h-screen w-screen overflow-hidden bg-bg-base"
        >
          <Sidebar />
          <main className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="h-full"
              >
                {view === 'dashboard' && <Dashboard />}
                {view === 'payroll' && <Payroll />}
                {view === 'treasury' && <Treasury />}
                {view === 'team' && <Team />}
                {view === 'transactions' && <Transactions />}
                {view === 'reports' && <Reports />}
                {view === 'settings' && <Settings />}
              </motion.div>
            </AnimatePresence>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Shell />
        <CommandPalette />
        <ToastHost />
      </AppProvider>
    </ErrorBoundary>
  )
}
