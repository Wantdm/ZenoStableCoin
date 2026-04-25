import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import { Sidebar } from './components/Sidebar'
import { ToastHost } from './components/Toast'
import { CommandPalette } from './components/CommandPalette'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Landing } from './views/Landing'
import { Dashboard } from './views/Dashboard'
import { Payroll } from './views/Payroll'
import { Treasury } from './views/Treasury'
import { Team, Transactions, Reports, Settings } from './views/Simple'

function Shell() {
  const { route, view } = useApp()

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
