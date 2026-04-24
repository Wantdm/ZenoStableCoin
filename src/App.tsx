import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Landing } from './views/Landing'
import { Dashboard } from './views/Dashboard'
import { Payroll } from './views/Payroll'
import { Treasury } from './views/Treasury'
import { Team, Transactions, Reports, Settings } from './views/Simple'

export type View = 'dashboard' | 'payroll' | 'treasury' | 'team' | 'transactions' | 'reports' | 'settings'

export default function App() {
  const [mode, setMode] = useState<'landing' | 'app'>('landing')
  const [view, setView] = useState<View>('payroll')

  if (mode === 'landing') {
    return <Landing onEnterApp={() => setMode('app')} />
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-base">
      <Sidebar view={view} setView={setView} />
      <main className="flex-1 overflow-hidden">
        {view === 'dashboard' && <Dashboard setView={setView} />}
        {view === 'payroll' && <Payroll />}
        {view === 'treasury' && <Treasury />}
        {view === 'team' && <Team />}
        {view === 'transactions' && <Transactions />}
        {view === 'reports' && <Reports />}
        {view === 'settings' && <Settings />}
      </main>
    </div>
  )
}
