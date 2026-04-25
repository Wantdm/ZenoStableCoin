import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

type Row = { keys: string[]; label: string }

const shortcuts: { section: string; rows: Row[] }[] = [
  {
    section: 'General',
    rows: [
      { keys: ['⌘', 'K'], label: 'Open command palette' },
      { keys: ['?'], label: 'Show this help' },
      { keys: ['Esc'], label: 'Close palette · dismiss toasts' },
    ],
  },
  {
    section: 'Navigate (press g, then…)',
    rows: [
      { keys: ['g', 'd'], label: 'Dashboard' },
      { keys: ['g', 'p'], label: 'Payroll' },
      { keys: ['g', 'y'], label: 'Treasury' },
      { keys: ['g', 't'], label: 'Team' },
      { keys: ['g', 'x'], label: 'Transactions' },
      { keys: ['g', 'r'], label: 'Reports' },
      { keys: ['g', 's'], label: 'Settings' },
    ],
  },
]

export function ShortcutHelp() {
  const { paletteOpen, route } = useApp()
  const [open, setOpen] = useState(false)
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (paletteOpen) return
      if (route !== 'app') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === '?') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, paletteOpen, route])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="help"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Keyboard shortcuts"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
              <h2 className="text-[14px] font-semibold text-text-primary">Keyboard shortcuts</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-1.5 py-0.5 text-[11px] text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                aria-label="Close shortcuts"
              >
                Esc
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              {shortcuts.map((group) => (
                <div key={group.section} className="mb-4 last:mb-0">
                  <div className="mb-2 text-[10.5px] font-medium uppercase tracking-[0.12em] text-text-muted">{group.section}</div>
                  <ul className="space-y-1.5">
                    {group.rows.map((r) => (
                      <li key={r.label} className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] text-text-secondary hover:bg-white/[0.02]">
                        <span>{r.label}</span>
                        <span className="flex items-center gap-1">
                          {r.keys.map((k, i) => (
                            <kbd key={i} className="rounded border border-border-subtle bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10.5px] text-text-primary">
                              {k === '⌘' && !isMac ? 'Ctrl' : k}
                            </kbd>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
