import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import { Sidebar } from './components/Sidebar'
import { ToastHost } from './components/Toast'
import { Landing } from './views/Landing'
import { Dashboard } from './views/Dashboard'
import { Payroll } from './views/Payroll'
import { Treasury } from './views/Treasury'
import { Team, Transactions, Reports, Settings } from './views/Simple'
import { Button } from './components/UI'
import { IconRotate } from './components/Icons'

function Shell() {
  const { route, view, resetDemo } = useApp()

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

            <button
              onClick={resetDemo}
              className="group absolute right-5 top-5 z-40 flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-elevated/80 px-2.5 py-1.5 text-[11.5px] text-text-secondary backdrop-blur transition-colors hover:border-brand-500/40 hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              title="Reset demo state"
            >
              <IconRotate width={12} height={12} className="transition-transform group-hover:-rotate-90" />
              Reset demo
            </button>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
      <ToastHost />
    </AppProvider>
  )
}
