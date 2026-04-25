import { ReactNode, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { IconRotate, IconCheck, IconX } from './Icons'

export function TopBar({ title, children }: { title: string; children?: ReactNode }) {
  const { resetDemo, isExecuting, toast } = useApp()
  const [armed, setArmed] = useState(false)
  const armTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (armTimerRef.current) clearTimeout(armTimerRef.current)
    }
  }, [])

  const arm = () => {
    if (isExecuting) {
      toast('Wait for payroll to finish before resetting')
      return
    }
    setArmed(true)
    if (armTimerRef.current) clearTimeout(armTimerRef.current)
    armTimerRef.current = window.setTimeout(() => setArmed(false), 3000)
  }

  const cancel = () => {
    setArmed(false)
    if (armTimerRef.current) clearTimeout(armTimerRef.current)
  }

  const confirm = () => {
    setArmed(false)
    if (armTimerRef.current) clearTimeout(armTimerRef.current)
    resetDemo()
  }

  return (
    <div className="flex items-center justify-between border-b border-border-subtle px-8 py-4">
      <h1 className="text-[18px] font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
        <div className="ml-1 relative">
          <AnimatePresence mode="wait" initial={false}>
            {armed ? (
              <motion.div
                key="armed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-1.5 py-1 text-[11.5px]"
              >
                <span className="px-1.5 text-rose-300">Reset demo?</span>
                <button
                  onClick={cancel}
                  className="inline-flex h-6 items-center gap-1 rounded-md px-2 text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="Cancel reset"
                >
                  <IconX width={11} height={11} /> Cancel
                </button>
                <button
                  onClick={confirm}
                  autoFocus
                  className="inline-flex h-6 items-center gap-1 rounded-md bg-rose-500/80 px-2 text-white transition-colors hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  aria-label="Confirm reset"
                >
                  <IconCheck width={11} height={11} /> Confirm
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="idle"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                onClick={arm}
                disabled={isExecuting}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-transparent px-2.5 py-1.5 text-[11.5px] text-text-muted transition-colors hover:border-brand-500/40 hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border-subtle disabled:hover:text-text-muted"
                title={isExecuting ? 'Reset disabled while payroll is executing' : 'Reset demo state'}
                aria-label="Reset demo"
                aria-disabled={isExecuting}
              >
                <IconRotate width={12} height={12} className="transition-transform group-hover:-rotate-90 group-disabled:transform-none" />
                Reset
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
