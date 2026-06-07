import { useEmotionalStore } from '@stores/emotionalStore'

// Renders a full-viewport frosted-glass layer whose blur intensity
// scales with distress (0 → 0px, 100 → 6px).
export function BlurOverlay() {
  const distress = useEmotionalStore((s) => s.distress)
  const blur = ((distress / 100) * 6).toFixed(2)

  if (distress < 5) return null

  return (
    <div
      className="effect-overlay"
      aria-hidden="true"
      style={{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        opacity: distress / 100,
        pointerEvents: 'none',
      }}
    />
  )
}
