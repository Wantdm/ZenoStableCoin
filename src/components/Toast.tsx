import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { IconCheck } from './Icons'

export function ToastHost() {
  const { toasts, dismissToast } = useApp()
  return (
    <div
      className="pointer-events-none fixed right-5 top-5 z-[100] flex flex-col gap-2"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => dismissToast(t.id)}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-auto group flex items-center gap-2.5 rounded-xl border border-border-subtle bg-bg-elevated px-3.5 py-2.5 text-[13px] shadow-xl backdrop-blur transition-colors hover:border-border hover:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            title="Click to dismiss"
            aria-label={`${t.msg} (click to dismiss)`}
          >
            {t.tone === 'green' ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                <IconCheck width={12} height={12} />
              </span>
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
              </span>
            )}
            <span className="text-text-primary">{t.msg}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
