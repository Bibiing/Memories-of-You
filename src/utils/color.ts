// HSL color interpolation for adaptive theme transitions

export interface HSLColor {
  h: number // 0–360
  s: number // 0–100
  l: number // 0–100
}

export function parseHSL(hslString: string): HSLColor {
  const match = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/.exec(hslString)
  if (!match) throw new Error(`Invalid HSL string: ${hslString}`)
  return {
    h: parseInt(match[1] ?? '0'),
    s: parseInt(match[2] ?? '0'),
    l: parseInt(match[3] ?? '0'),
  }
}

export function hslToString({ h, s, l }: HSLColor): string {
  return `hsl(${String(h)}, ${String(s)}%, ${String(l)}%)`
}

export function interpolateHSL(from: HSLColor, to: HSLColor, t: number): HSLColor {
  const clampedT = Math.min(1, Math.max(0, t))
  return {
    h: Math.round(from.h + (to.h - from.h) * clampedT),
    s: Math.round(from.s + (to.s - from.s) * clampedT),
    l: Math.round(from.l + (to.l - from.l) * clampedT),
  }
}

// Chapter color palettes
import type { Chapter } from '@/types/game'

export interface ChapterTheme {
  primary: HSLColor
  background: HSLColor
  accent: HSLColor
  textColor: HSLColor
}

export const CHAPTER_THEMES: Record<Chapter, ChapterTheme> = {
  prologue: {
    primary: { h: 270, s: 60, l: 70 }, // lavender
    background: { h: 270, s: 30, l: 15 },
    accent: { h: 45, s: 80, l: 65 }, // gold
    textColor: { h: 0, s: 0, l: 95 },
  },
  denial: {
    primary: { h: 290, s: 65, l: 55 }, // violet → magenta
    background: { h: 280, s: 30, l: 12 },
    accent: { h: 310, s: 70, l: 60 },
    textColor: { h: 0, s: 0, l: 92 },
  },
  anger: {
    primary: { h: 0, s: 85, l: 45 }, // fiery red
    background: { h: 0, s: 40, l: 8 },
    accent: { h: 280, s: 40, l: 25 }, // dark plum
    textColor: { h: 0, s: 0, l: 90 },
  },
  bargaining: {
    primary: { h: 255, s: 60, l: 45 }, // indigo
    background: { h: 250, s: 35, l: 10 },
    accent: { h: 230, s: 50, l: 55 },
    textColor: { h: 0, s: 0, l: 88 },
  },
  depression: {
    primary: { h: 220, s: 70, l: 20 }, // midnight blue
    background: { h: 220, s: 40, l: 5 },
    accent: { h: 220, s: 20, l: 30 },
    textColor: { h: 0, s: 0, l: 70 }, // slightly dimmed
  },
  acceptance: {
    primary: { h: 200, s: 55, l: 55 }, // soft blue → purple
    background: { h: 210, s: 25, l: 12 },
    accent: { h: 270, s: 40, l: 65 },
    textColor: { h: 0, s: 0, l: 92 },
  },
  epilogue: {
    primary: { h: 270, s: 65, l: 60 }, // violet — full spectrum
    background: { h: 260, s: 30, l: 10 },
    accent: { h: 45, s: 60, l: 60 },
    textColor: { h: 0, s: 0, l: 95 },
  },
}

export function applyTheme(theme: ChapterTheme, distress: number): void {
  const root = document.documentElement
  const distressFactor = Math.min(1, distress / 100)

  root.style.setProperty('--color-primary', hslToString(theme.primary))
  root.style.setProperty('--color-bg', hslToString(theme.background))
  root.style.setProperty('--color-accent', hslToString(theme.accent))
  root.style.setProperty('--color-text', hslToString(theme.textColor))

  // Distress affects grayscale and blur
  const grayscale = Math.round(distressFactor * 50) // 0–50%
  const blur = (distressFactor * 2).toFixed(1) // 0–2px
  root.style.setProperty(
    '--filter-distress',
    `grayscale(${String(grayscale)}%) blur(${blur}px)`
  )
}
