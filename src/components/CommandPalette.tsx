import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp, View } from '../context/AppContext'

type Action = {
  id: string
  label: string
  hint: string
  run: () => void
}

export function CommandPalette() {
  const { setView, goToPayroll, resetDemo, navigate, toast, isExecuting, paletteOpen: open, setPaletteOpen: setOpen } = useApp()
  const [query, setQuery] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const actions = useMemo<Action[]>(() => {
    const goView = (v: View, label: string): Action => ({
      id: `go:${v}`,
      label: `Go to ${label}`,
      hint: 'View',
      run: () => setView(v),
    })
    return [
      goView('dashboard', 'Dashboard'),
      goView('payroll', 'Payroll'),
      goView('treasury', 'Treasury'),
      goView('team', 'Team'),
      goView('transactions', 'Transactions'),
      goView('reports', 'Reports'),
      goView('settings', 'Settings'),
      { id: 'run', label: 'Run new payroll', hint: 'Action', run: () => goToPayroll() },
      {
        id: 'reset',
        label: 'Reset demo state',
        hint: 'Action',
        run: () => {
          if (isExecuting) {
            toast('Wait for payroll to finish before resetting')
            return
          }
          resetDemo()
        },
      },
      { id: 'home', label: 'Back to landing page', hint: 'Navigate', run: () => navigate('landing') },
    ]
  }, [setView, goToPayroll, resetDemo, navigate, toast, isExecuting])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return actions
    return actions.filter((a) => a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q))
  }, [actions, query])

  // Global toggle: Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey
      if (isCmd && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  // Reset state on open + focus input
  useEffect(() => {
    if (!open) return
    setQuery('')
    setIdx(0)
    const t = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => clearTimeout(t)
  }, [open])

  // Keep highlight in bounds when filter changes
  useEffect(() => {
    setIdx((i) => {
      if (filtered.length === 0) return 0
      return Math.min(i, filtered.length - 1)
    })
  }, [filtered.length])

  // Keep highlighted item visible
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${idx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [idx, open])

  // Keyboard: arrow nav, enter, escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIdx((i) => (filtered.length === 0 ? 0 : Math.min(i + 1, filtered.length - 1)))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const action = filtered[idx]
        if (action) {
          action.run()
          setOpen(false)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, idx])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 backdrop-blur-[2px] pt-[14vh]"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated shadow-2xl"
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-border-subtle px-4">
              <span className="text-text-muted">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or page name…"
                aria-label="Search commands"
                className="h-12 flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-muted outline-none"
              />
              <kbd className="hidden rounded border border-border-subtle bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10.5px] text-text-muted sm:inline">esc</kbd>
            </div>

            <ul ref={listRef} className="max-h-[320px] overflow-y-auto py-1.5">
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center text-[13px] text-text-muted">No matches</li>
              )}
              {filtered.map((a, i) => {
                const active = i === idx
                return (
                  <li
                    key={a.id}
                    data-idx={i}
                    onMouseEnter={() => setIdx(i)}
                    onClick={() => {
                      a.run()
                      setOpen(false)
                    }}
                    className={[
                      'mx-1.5 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[13.5px]',
                      active ? 'bg-brand-500/10 text-text-primary' : 'text-text-secondary hover:bg-white/[0.03]',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`flex h-5 w-5 items-center justify-center rounded ${active ? 'bg-brand-500/20 text-brand-400' : 'bg-white/[0.04] text-text-muted'}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </span>
                      {a.label}
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-muted">{a.hint}</span>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-border-subtle bg-white/[0.015] px-4 py-2 text-[11px] text-text-muted">
              <div className="flex items-center gap-3">
                <KbHint>↑↓</KbHint>
                <span>navigate</span>
                <KbHint>↵</KbHint>
                <span>select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <KbHint>⌘</KbHint>
                <KbHint>K</KbHint>
                <span className="ml-1">to toggle</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function KbHint({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border-subtle bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10.5px] text-text-muted">
      {children}
    </kbd>
  )
}
