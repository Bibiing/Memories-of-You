import { useState } from 'react'
import { useGameStateStore } from '@stores/gameStateStore'
import { useInventoryStore } from '@stores/inventoryStore'
import { getChapterChats } from '@data/chats/index'
import { getVisibleNotes } from '@data/notes/index'
import { MapApp } from './MapApp'
import { ChatApp } from './ChatApp'
import { GalleryApp } from './GalleryApp'
import { MusicApp } from './MusicApp'
import { NotesApp } from './NotesApp'
import type { AppId } from '@/types/smartphone'
import type { FlashbackId } from '@/types/game'

interface Props {
  onClose: () => void
  onOpenFlashback: (id: FlashbackId) => void
}

const APP_DEFS: { id: AppId; label: string; icon: string }[] = [
  { id: 'map',     label: 'Map',    icon: '◎' },
  { id: 'chat',    label: 'Chat',   icon: '◻' },
  { id: 'gallery', label: 'Galeri', icon: '◈' },
  { id: 'music',   label: 'Musik',  icon: '♪' },
  { id: 'notes',   label: 'Catatan',icon: '≡' },
]

function HomeScreen({
  onOpen,
  badge,
}: {
  onOpen: (id: AppId) => void
  badge: (id: AppId) => number
}) {
  return (
    <div className="home-screen">
      <p className="home-title">Memories of You</p>
      <div className="home-grid">
        {APP_DEFS.map((app) => {
          const count = badge(app.id)
          return (
            <button
              key={app.id}
              className="app-icon-btn"
              onClick={() => { onOpen(app.id) }}
              aria-label={app.label}
            >
              <span className="app-icon-symbol">{app.icon}</span>
              <span className="app-icon-label">{app.label}</span>
              {count > 0 && (
                <span className="app-icon-badge" aria-label={String(count) + ' notifikasi'}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function SmartphoneFrame({ onClose, onOpenFlashback }: Props) {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const currentDay = useGameStateStore((s) => s.currentDay)
  const flashbackUnlocked = useInventoryStore((s) => s.flashbackUnlocked)

  const [activeApp, setActiveApp] = useState<AppId | null>(null)
  const [readApps, setReadApps] = useState<ReadonlySet<AppId>>(new Set())

  const chatThreadCount = getChapterChats(chapter).threads.length
  const visibleNoteCount = getVisibleNotes(chapter, currentDay).length

  const openApp = (id: AppId) => {
    setActiveApp(id)
    setReadApps((prev) => new Set([...prev, id]))
  }

  const badge = (id: AppId): number => {
    if (readApps.has(id)) return 0
    switch (id) {
      case 'chat':    return chatThreadCount > 0 ? chatThreadCount : 0
      case 'gallery': return flashbackUnlocked.length
      case 'notes':   return visibleNoteCount
      default:        return 0
    }
  }

  const renderApp = () => {
    switch (activeApp) {
      case 'map':     return <MapApp onBack={() => { setActiveApp(null) }} />
      case 'chat':    return <ChatApp onBack={() => { setActiveApp(null) }} />
      case 'gallery': return (
        <GalleryApp
          onBack={() => { setActiveApp(null) }}
          onOpenFlashback={(id) => { onOpenFlashback(id); onClose() }}
        />
      )
      case 'music':   return <MusicApp onBack={() => { setActiveApp(null) }} />
      case 'notes':   return <NotesApp onBack={() => { setActiveApp(null) }} />
      default:        return null
    }
  }

  return (
    <div className="smartphone-frame" role="dialog" aria-label="Smartphone">
      <div className="smartphone-status">
        <span className="smartphone-time" aria-hidden="true">●●●</span>
        <button
          className="smartphone-close-btn"
          onClick={onClose}
          aria-label="Tutup smartphone"
        >
          ✕
        </button>
      </div>

      <div className="smartphone-screen">
        {activeApp === null ? (
          <HomeScreen onOpen={openApp} badge={badge} />
        ) : (
          renderApp()
        )}
      </div>
    </div>
  )
}
