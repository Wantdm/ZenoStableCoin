import { ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { IconRotate } from './Icons'

export function TopBar({ title, children }: { title: string; children?: ReactNode }) {
  const { resetDemo } = useApp()
  return (
    <div className="flex items-center justify-between border-b border-border-subtle px-8 py-4">
      <h1 className="text-[18px] font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
        <button
          onClick={resetDemo}
          className="group ml-1 inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-transparent px-2.5 py-1.5 text-[11.5px] text-text-muted transition-colors hover:border-brand-500/40 hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          title="Reset demo state"
          aria-label="Reset demo"
        >
          <IconRotate width={12} height={12} className="transition-transform group-hover:-rotate-90" />
          Reset
        </button>
      </div>
    </div>
  )
}
