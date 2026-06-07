import type { ReactNode } from 'react'
import { useEmotionalStore } from '@stores/emotionalStore'

interface Props {
  children: ReactNode
}

// Wraps children and applies a CSS grayscale filter that intensifies with distress.
// At distress=100, the scene reaches 60% desaturated.
export function GrayscaleFilter({ children }: Props) {
  const distress = useEmotionalStore((s) => s.distress)
  const grayscale = Math.round((distress / 100) * 60)

  return (
    <div
      style={{
        filter: `grayscale(${String(grayscale)}%)`,
        transition: 'filter 2s ease',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}
