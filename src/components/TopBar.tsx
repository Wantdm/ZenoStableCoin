import { ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { IconRotate } from './Icons'

export function TopBar({ title, children }: { title: string; children?: ReactNode }) {
  const { resetDemo, isExecuting, toast } = useApp()
  const onClick = () => {
    if (isExecuting) {
      toast('Wait for payroll to finish before resetting')
      return
    }
    resetDemo()
  }
  return (
    <div className="flex items-center justify-between border-b border-border-subtle px-8 py-4">
      <h1 className="text-[18px] font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
        <button
          onClick={onClick}
          disabled={isExecuting}
          className="group ml-1 inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-transparent px-2.5 py-1.5 text-[11.5px] text-text-muted transition-colors hover:border-brand-500/40 hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border-subtle disabled:hover:text-text-muted"
          title={isExecuting ? 'Reset disabled while payroll is executing' : 'Reset demo state'}
          aria-label="Reset demo"
          aria-disabled={isExecuting}
        >
          <IconRotate width={12} height={12} className="transition-transform group-hover:-rotate-90 group-disabled:transform-none" />
          Reset
        </button>
      </div>
    </div>
  )
}
