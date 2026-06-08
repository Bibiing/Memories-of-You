import { useState } from 'react'
import type { Chapter, GameScene, Location } from '@/types/game'
import type { MiniGameType } from '@/types/minigame'
import { useGameStateStore } from '@stores/gameStateStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { MiniGameHost } from '@components/minigames/MiniGameHost'

const CHAPTERS: Chapter[] = [
  'prologue',
  'denial',
  'anger',
  'bargaining',
  'depression',
  'acceptance',
  'epilogue',
]
const SCENES: GameScene[] = [
  'main-menu',
  'name-input',
  'load-screen',
  'gameplay',
  'evening-reflection',
  'flashback',
  'chapter-transition',
  'credits',
]
const LOCATIONS: Location[] = [
  'kamar',
  'rooftop',
  'kelas',
  'lab',
  'koridor-lab',
  'taman',
  'pusat-perbelanjaan',
  'jalanan-kota',
  'venue-pameran',
  'lapangan',
  'restoran',
  'tempat-main',
  'bioskop',
  'kamar-mandi',
]

// Only rendered in development mode
export function DebugPanel() {
  if (!import.meta.env.DEV) return null

  return <DebugPanelInner />
}

const MINIGAME_TYPES: MiniGameType[] = [
  'breathing-rhythm',
  'struggle-button',
  'hold-to-delete',
  'word-puzzle',
  'quick-time-event',
  'hidden-object',
  'find-the-difference',
  'planting-game',
  'drag-drop-scheduler',
  'room-decoration',
  'slider-puzzle',
]

const SAMPLE_CONFIGS: Record<MiniGameType, unknown> = {
  'breathing-rhythm': { inhaleSeconds: 4, holdSeconds: 2, exhaleSeconds: 4, cycles: 3 },
  'struggle-button': { target: 20, label: 'Lampiaskan!', timeLimit: 15 },
  'hold-to-delete': {
    holdDuration: 1200,
    elements: [
      { id: 'a', label: 'Foto berdua', color: '#c9a0dc' },
      { id: 'b', label: 'Chat lama', color: '#7ec8a0' },
    ],
  },
  'word-puzzle': {
    target: 'IKHLAS',
    letters: ['I', 'K', 'H', 'L', 'A', 'S', 'E', 'O'],
    timeLimit: 30,
  },
  'quick-time-event': {
    duration: 15,
    spawnInterval: 1.2,
    targets: Array.from({ length: 12 }, (_, i) => ({
      id: 't' + String(i),
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      label: '!',
    })),
  },
  'hidden-object': {
    timeLimit: 30,
    targets: [
      { id: 'o1', x: 35, y: 45, radius: 8, label: 'Foto' },
      { id: 'o2', x: 65, y: 30, radius: 8, label: 'Surat' },
    ],
  },
  'find-the-difference': {
    timeLimit: 45,
    differences: [
      { id: 'd1', x: 40, y: 50, radius: 10 },
      { id: 'd2', x: 70, y: 30, radius: 10 },
    ],
  },
  'planting-game': {
    steps: [
      { id: 's1', label: 'Siapkan pot', icon: '🪴' },
      { id: 's2', label: 'Isi tanah', icon: '🌱' },
      { id: 's3', label: 'Tanam', icon: '🌵' },
      { id: 's4', label: 'Siram', icon: '💧' },
    ],
    correctOrder: ['s1', 's2', 's3', 's4'],
  },
  'drag-drop-scheduler': {
    tasks: [
      { id: 't1', label: 'Kuliah PBO', duration: 1, color: '#7ec8a0' },
      { id: 't2', label: 'Makan siang', duration: 1, color: '#c87941' },
    ],
    slots: ['08:00', '10:00', '12:00'],
    correctMapping: { t1: '08:00', t2: '12:00' },
  },
  'room-decoration': {
    items: [
      { id: 'kaktus', label: 'Kaktus', color: '#3a8a5f' },
      { id: 'buku', label: 'Buku', color: '#c87941' },
    ],
    slots: [
      { id: 'meja', label: 'Meja', x: 30, y: 40, accepts: 'buku' },
      { id: 'pojok', label: 'Pojok', x: 70, y: 60, accepts: 'kaktus' },
    ],
  },
  'slider-puzzle': {
    rows: 5,
    cols: 5,
    grid: [
      [1, 1, 1, 1, 1],
      [1, 2, 0, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 3, 1],
    ],
  },
}

function DebugPanelInner() {
  const [open, setOpen] = useState(false)
  const [activeMG, setActiveMG] = useState<MiniGameType | null>(null)

  const chapter = useGameStateStore((s) => s.currentChapter)
  const scene = useGameStateStore((s) => s.currentScene)
  const location = useGameStateStore((s) => s.currentLocation)
  const setChapter = useGameStateStore((s) => s.setChapter)
  const setScene = useGameStateStore((s) => s.setScene)
  const setLocation = useGameStateStore((s) => s.setLocation)

  const distress = useEmotionalStore((s) => s.distress)
  const hope = useEmotionalStore((s) => s.hope)
  const setDistress = useEmotionalStore((s) => s.setDistress)
  const setHope = useEmotionalStore((s) => s.setHope)

  if (activeMG) {
    return (
      <MiniGameHost
        type={activeMG}
        config={SAMPLE_CONFIGS[activeMG]}
        onComplete={() => {
          setActiveMG(null)
        }}
        onAbandon={() => {
          setActiveMG(null)
        }}
      />
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: 11,
      }}
    >
      <button
        onClick={() => {
          setOpen((v) => !v)
        }}
        style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#0f0',
          border: '1px solid #0f0',
          borderRadius: 4,
          padding: '2px 8px',
          cursor: 'pointer',
        }}
      >
        {open ? '✕ Debug' : '⚙ Debug'}
      </button>

      {open && (
        <div
          style={{
            background: 'rgba(0,0,0,0.88)',
            border: '1px solid #333',
            borderRadius: 6,
            padding: 12,
            marginTop: 4,
            color: '#eee',
            minWidth: 220,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Chapter</span>
            <select
              value={chapter}
              onChange={(e) => {
                setChapter(e.target.value as Chapter)
              }}
              style={{
                background: '#111',
                color: '#eee',
                border: '1px solid #444',
                borderRadius: 3,
                padding: 2,
              }}
            >
              {CHAPTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Scene</span>
            <select
              value={scene}
              onChange={(e) => {
                setScene(e.target.value as GameScene)
              }}
              style={{
                background: '#111',
                color: '#eee',
                border: '1px solid #444',
                borderRadius: 3,
                padding: 2,
              }}
            >
              {SCENES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Location</span>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value as Location)
              }}
              style={{
                background: '#111',
                color: '#eee',
                border: '1px solid #444',
                borderRadius: 3,
                padding: 2,
              }}
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Distress: {distress}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={distress}
              onChange={(e) => {
                setDistress(Number(e.target.value))
              }}
              style={{ accentColor: '#e53935' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Hope: {hope}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={hope}
              onChange={(e) => {
                setHope(Number(e.target.value))
              }}
              style={{ accentColor: '#43a047' }}
            />
          </label>

          <div
            style={{
              borderTop: '1px solid #333',
              paddingTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ color: '#aaa', fontSize: 10 }}>Quick Actions</span>
            <button
              onClick={() => {
                setScene('evening-reflection')
              }}
              style={{
                background: '#1a1a00',
                color: '#FFD54F',
                border: '1px solid #555',
                borderRadius: 3,
                padding: '3px 8px',
                cursor: 'pointer',
                fontSize: 11,
              }}
            >
              ▶ Evening Reflection
            </button>
            <button
              onClick={() => {
                setScene('gameplay')
              }}
              style={{
                background: '#001a00',
                color: '#69F0AE',
                border: '1px solid #555',
                borderRadius: 3,
                padding: '3px 8px',
                cursor: 'pointer',
                fontSize: 11,
              }}
            >
              ▶ Gameplay
            </button>
          </div>

          <div
            style={{
              borderTop: '1px solid #333',
              paddingTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ color: '#aaa', fontSize: 10 }}>Mini-Games</span>
            {MINIGAME_TYPES.map((mg) => (
              <button
                key={mg}
                onClick={() => {
                  setActiveMG(mg)
                }}
                style={{
                  background: '#0a001a',
                  color: '#CE93D8',
                  border: '1px solid #555',
                  borderRadius: 3,
                  padding: '3px 8px',
                  cursor: 'pointer',
                  fontSize: 11,
                  textAlign: 'left',
                }}
              >
                ▶ {mg}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
