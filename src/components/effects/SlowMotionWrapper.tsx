import type { ReactNode } from 'react'
import { useEmotionalStore } from '@stores/emotionalStore'

interface Props {
  children: ReactNode
}

// Slows down CSS animations inside the wrapper proportional to distress.
// At distress=0 → 1× speed; at distress=100 → 0.4× speed.
export function SlowMotionWrapper({ children }: Props) {
  const distress = useEmotionalStore((s) => s.distress)
  const speedFactor = 1 - (distress / 100) * 0.6

  return (
    <div
      style={{
        animationDuration: `calc(var(--anim-base-duration, 1s) / ${speedFactor.toFixed(2)})`,
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}
