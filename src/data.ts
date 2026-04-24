export type Method = 'USDC' | 'USDT' | 'EUR Bank'

export type Member = {
  id: string
  name: string
  role: string
  country: string
  countryCode: string
  method: Method
  amount: number
  initials: string
  avatarColor: string
}

export const team: Member[] = [
  { id: '1', name: 'Ana Silva', role: 'Lead Engineer', country: 'Brazil', countryCode: 'BR', method: 'USDC', amount: 4200, initials: 'AS', avatarColor: 'bg-emerald-600' },
  { id: '2', name: 'Rohan Kumar', role: 'Backend Dev', country: 'India', countryCode: 'IN', method: 'USDT', amount: 5800, initials: 'RK', avatarColor: 'bg-orange-600' },
  { id: '3', name: 'Léa Martin', role: 'Product Designer', country: 'France', countryCode: 'FR', method: 'EUR Bank', amount: 6500, initials: 'LM', avatarColor: 'bg-amber-700' },
  { id: '4', name: 'Ji-woo Lee', role: 'Data Scientist', country: 'S. Korea', countryCode: 'KR', method: 'USDC', amount: 5200, initials: 'JL', avatarColor: 'bg-fuchsia-700' },
  { id: '5', name: 'Amara Osei', role: 'Fullstack Dev', country: 'Ghana', countryCode: 'GH', method: 'USDT', amount: 3900, initials: 'AO', avatarColor: 'bg-rose-700' },
]

export const treasury = {
  balance: 392140,
  yieldMtd: 1842,
  apy: 4.5,
  allocation: [
    { label: 'T-bill tokens', pct: 60, color: '#22c55e' },
    { label: 'USDC', pct: 25, color: '#3b82f6' },
    { label: 'USDT', pct: 15, color: '#a78bfa' },
  ],
}

export const recentActivity = [
  { id: 'a', type: 'Payroll', detail: 'March payroll · 5 contractors', amount: -24900, date: 'Mar 31' },
  { id: 'b', type: 'Yield', detail: 'T-bill token yield · accrued', amount: 612, date: 'Mar 28' },
  { id: 'c', type: 'Deposit', detail: 'Wire from Mercury · USDC', amount: 50000, date: 'Mar 24' },
  { id: 'd', type: 'Swap', detail: 'USDC → T-bill tokens', amount: -30000, date: 'Mar 20' },
  { id: 'e', type: 'Yield', detail: 'T-bill token yield · accrued', amount: 598, date: 'Mar 14' },
]

export const competitors = [
  { name: 'Zeno', fee: '0.2%', speed: '< 3 min', yield: '4.5% APY', coverage: 'Global', highlight: true },
  { name: 'Deel', fee: '1–3%', speed: '1–2 days', yield: 'None', coverage: 'Global', highlight: false },
  { name: 'Wise', fee: '0.4–2%', speed: '1–2 days', yield: 'None', coverage: 'Most', highlight: false },
  { name: 'SWIFT', fee: '2–7%', speed: '3–5 days', yield: 'None', coverage: 'Global', highlight: false },
]
