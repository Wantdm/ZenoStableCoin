import type { View } from './context/AppContext'

export const preloadView: Record<View, () => Promise<unknown>> = {
  dashboard: () => import('./views/Dashboard'),
  payroll: () => import('./views/Payroll'),
  treasury: () => import('./views/Treasury'),
  team: () => import('./views/Simple'),
  transactions: () => import('./views/Simple'),
  reports: () => import('./views/Simple'),
  settings: () => import('./views/Simple'),
}
