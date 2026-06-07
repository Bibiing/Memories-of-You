import { useState, useCallback } from 'react'

interface Ripple {
  id: string
  x: number
  y: number
}

interface Props {
  children: (trigger: (x: number, y: number) => void) => React.ReactNode
}

// Render-prop component that exposes a `trigger(x, y)` function.
// Call it with normalised coordinates (0–100) to spawn a CSS shockwave ripple.
export function RippleEffect({ children }: Props) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const trigger = useCallback((x: number, y: number) => {
    // Use time + random suffix for a collision-free ID without needing a ref
    const id = `${String(Date.now())}-${Math.random().toString(36).slice(2)}`
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 1000)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {children(trigger)}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: `${String(r.x)}%`,
            top: `${String(r.y)}%`,
            transform: 'translate(-50%, -50%)',
            width: 0,
            height: 0,
            borderRadius: '50%',
            border: '2px solid var(--color-primary)',
            animation: 'ripple-expand 1s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}
