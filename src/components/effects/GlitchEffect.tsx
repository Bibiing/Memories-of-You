import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  // 0 = no glitch, 1 = maximum
  intensity: number
  active?: boolean
}

// Applies a CSS glitch effect over children using the @keyframes glitch
// defined in global.css. Two pseudo-layers are simulated via inline divs.
export function GlitchEffect({ children, intensity, active = false }: Props) {
  if (!active || intensity <= 0) {
    return <>{children}</>
  }

  const duration = Math.max(0.15, 0.6 - intensity * 0.45)
  const iterationCount = intensity > 0.7 ? 'infinite' : '3'

  return (
    <div className="glitch-root" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {children}
      {/* Layer A — shifted right, red channel */}
      <div
        className="glitch-layer"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          animation: `glitch ${String(duration)}s step-end ${iterationCount}`,
          mixBlendMode: 'screen',
          opacity: intensity * 0.6,
          filter: 'url(#glitch-red)',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
      {/* Layer B — shifted left, cyan channel */}
      <div
        className="glitch-layer"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          animation: `glitch ${String(duration * 1.3)}s step-end ${iterationCount} ${String(duration * 0.1)}s`,
          mixBlendMode: 'screen',
          opacity: intensity * 0.4,
          transform: 'translate(-3px, 0)',
          filter: 'hue-rotate(180deg)',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}
