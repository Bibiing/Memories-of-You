import { useGameStateStore } from '@stores/gameStateStore'
import { AppBar } from './AppBar'
import type { Location } from '@/types/game'

const ALL_LOCATIONS: Location[] = [
  'kamar', 'rooftop', 'kelas', 'lab', 'koridor-lab', 'taman',
  'pusat-perbelanjaan', 'jalanan-kota', 'venue-pameran',
  'lapangan', 'restoran', 'tempat-main', 'bioskop', 'kamar-mandi',
]

const LOCATION_LABELS: Record<Location, string> = {
  'kamar': 'Kamar',
  'rooftop': 'Rooftop',
  'kelas': 'Kelas',
  'lab': 'Lab',
  'koridor-lab': 'Koridor Lab',
  'taman': 'Taman',
  'pusat-perbelanjaan': 'Mall',
  'jalanan-kota': 'Jalanan Kota',
  'venue-pameran': 'Venue Pameran',
  'lapangan': 'Lapangan',
  'restoran': 'Restoran',
  'tempat-main': 'Tempat Main',
  'bioskop': 'Bioskop',
  'kamar-mandi': 'Kamar Mandi',
}

interface Props {
  onBack: () => void
}

export function MapApp({ onBack }: Props) {
  const availableLocations = useGameStateStore((s) => s.availableLocations)
  const currentLocation = useGameStateStore((s) => s.currentLocation)
  const setLocation = useGameStateStore((s) => s.setLocation)

  const handleSelect = (loc: Location) => {
    setLocation(loc)
    onBack()
  }

  return (
    <div className="app-root">
      <AppBar title="Peta" onBack={onBack} />
      <div className="map-list">
        {ALL_LOCATIONS.map((loc) => {
          const isAvailable = availableLocations.includes(loc)
          const isCurrent = loc === currentLocation
          return (
            <button
              key={loc}
              className={[
                'map-location-item',
                isCurrent ? 'map-location-item--current' : '',
                !isAvailable ? 'map-location-item--locked' : '',
              ].join(' ')}
              disabled={!isAvailable}
              onClick={() => { handleSelect(loc) }}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <span className="map-location-dot" />
              <span className="map-location-name">{LOCATION_LABELS[loc]}</span>
              {isCurrent && <span className="map-location-badge">di sini</span>}
              {!isAvailable && <span className="map-location-lock" aria-label="terkunci">⋯</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
