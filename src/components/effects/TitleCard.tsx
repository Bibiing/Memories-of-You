/**
 * components/effects/TitleCard.tsx
 *
 * Title card yang muncul di akhir Prologue.
 * Menampilkan "Memories of You" dengan dissolve effect.
 * Setelah animasi selesai, callback onComplete dipanggil.
 *
 * Visual: teks muncul perlahan dari hitam (fade in),
 * bertahan 2 detik, lalu fade out → callback.
 */

import { useEffect, useState } from 'react'
import styles from './TitleCard.module.css'

interface TitleCardProps {
  title: string
  subtitle?: string
  onComplete: () => void
  holdDuration?: number // ms title ditampilkan sebelum fade out (default 2500)
}

type Phase = 'fade-in' | 'hold' | 'fade-out' | 'done'

export function TitleCard({ title, subtitle, onComplete, holdDuration = 2500 }: TitleCardProps) {
  const [phase, setPhase] = useState<Phase>('fade-in')

  useEffect(() => {
    // fade-in: 1200ms
    const t1 = setTimeout(() => {
      setPhase('hold')
    }, 1200)
    // hold: holdDuration ms
    const t2 = setTimeout(() => {
      setPhase('fade-out')
    }, 1200 + holdDuration)
    // fade-out: 1000ms
    const t3 = setTimeout(
      () => {
        setPhase('done')
        onComplete()
      },
      1200 + holdDuration + 1000
    )

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [holdDuration, onComplete])

  if (phase === 'done') return null

  return (
    <div className={`${styles.titleCard ?? ''} ${styles[phase] ?? ''}`} aria-live="polite">
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  )
}
