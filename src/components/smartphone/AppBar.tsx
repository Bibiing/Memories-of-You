interface Props {
  title: string
  onBack: () => void
}

export function AppBar({ title, onBack }: Props) {
  return (
    <div className="app-bar">
      <button className="app-bar-back" onClick={onBack} aria-label="Kembali">‹</button>
      <span className="app-bar-title">{title}</span>
    </div>
  )
}
