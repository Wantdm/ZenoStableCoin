export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-lg bg-brand-500 text-bg-base font-bold"
        style={{ width: size, height: size, fontSize: size * 0.55 }}
      >
        Z
      </div>
      <span className="text-[17px] font-semibold tracking-tight text-text-primary">Zeno</span>
    </div>
  )
}
