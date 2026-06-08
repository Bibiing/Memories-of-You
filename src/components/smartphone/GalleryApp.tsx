import { useInventoryStore } from '@stores/inventoryStore'
import { GALLERY_PHOTOS } from '@data/gallery'
import { AppBar } from './AppBar'
import type { FlashbackId } from '@/types/game'

interface Props {
  onBack: () => void
  onOpenFlashback: (id: FlashbackId) => void
}

export function GalleryApp({ onBack, onOpenFlashback }: Props) {
  const flashbackUnlocked = useInventoryStore((s) => s.flashbackUnlocked)

  return (
    <div className="app-root">
      <AppBar title="Galeri" onBack={onBack} />
      <div className="gallery-grid">
        {GALLERY_PHOTOS.map((photo) => {
          const isUnlocked = flashbackUnlocked.includes(photo.flashbackId)
          return (
            <button
              key={photo.flashbackId}
              className={`gallery-photo${isUnlocked ? '' : ' gallery-photo--locked'}`}
              onClick={() => { if (isUnlocked) onOpenFlashback(photo.flashbackId) }}
              disabled={!isUnlocked}
              aria-label={isUnlocked ? photo.title : 'Kenangan terkunci'}
              style={isUnlocked ? { '--photo-accent': photo.accentColor } as React.CSSProperties : undefined}
            >
              <div className="gallery-photo-inner" />
              <span className="gallery-photo-title">{isUnlocked ? photo.title : '???'}</span>
            </button>
          )
        })}
      </div>
      <p className="gallery-hint">
        {flashbackUnlocked.length}/{GALLERY_PHOTOS.length} kenangan terbuka
      </p>
    </div>
  )
}
