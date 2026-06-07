import type { Chapter, Location } from '@/types/game'

// Vite: import SVGs as URLs
import kamarUrl from '@assets/locations/kamar.svg?url'
import rooftopUrl from '@assets/locations/rooftop.svg?url'
import kelasUrl from '@assets/locations/kelas.svg?url'
import labUrl from '@assets/locations/lab.svg?url'
import koridorLabUrl from '@assets/locations/koridor-lab.svg?url'
import tamanUrl from '@assets/locations/taman.svg?url'
import pusatPerbelanjaanUrl from '@assets/locations/pusat-perbelanjaan.svg?url'
import jalananKotaUrl from '@assets/locations/jalanan-kota.svg?url'
import venuePameranUrl from '@assets/locations/venue-pameran.svg?url'
import lapanganUrl from '@assets/locations/lapangan.svg?url'
import restoranUrl from '@assets/locations/restoran.svg?url'
import tempatMainUrl from '@assets/locations/tempat-main.svg?url'
import bioskopUrl from '@assets/locations/bioskop.svg?url'
import kamarMandiUrl from '@assets/locations/kamar-mandi.svg?url'

const LOCATION_URLS: Record<Location, string> = {
  kamar: kamarUrl,
  rooftop: rooftopUrl,
  kelas: kelasUrl,
  lab: labUrl,
  'koridor-lab': koridorLabUrl,
  taman: tamanUrl,
  'pusat-perbelanjaan': pusatPerbelanjaanUrl,
  'jalanan-kota': jalananKotaUrl,
  'venue-pameran': venuePameranUrl,
  lapangan: lapanganUrl,
  restoran: restoranUrl,
  'tempat-main': tempatMainUrl,
  bioskop: bioskopUrl,
  'kamar-mandi': kamarMandiUrl,
}

// Per-chapter colour tint blended over the background
const CHAPTER_TINTS: Record<Chapter, string> = {
  prologue: 'rgba(90, 40, 140, 0.15)',
  denial: 'rgba(80, 0, 120, 0.22)',
  anger: 'rgba(160, 0, 0, 0.28)',
  bargaining: 'rgba(40, 0, 120, 0.22)',
  depression: 'rgba(0, 0, 40, 0.45)',
  acceptance: 'rgba(0, 70, 140, 0.18)',
  epilogue: 'rgba(90, 40, 160, 0.12)',
}

interface Props {
  location: Location
  chapter: Chapter
}

export function SceneBackground({ location, chapter }: Props) {
  const url = LOCATION_URLS[location]
  const tint = CHAPTER_TINTS[chapter]

  return (
    <div className="scene-background" aria-hidden="true">
      <img
        src={url}
        alt=""
        className="scene-bg-img"
        draggable={false}
      />
      <div className="scene-tint" style={{ background: tint }} />
    </div>
  )
}
