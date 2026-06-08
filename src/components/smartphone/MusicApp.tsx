import { useGameStateStore } from '@stores/gameStateStore'
import { useMusicStore } from '@stores/musicStore'
import {
  playTrack,
  pauseTrack,
  resumeTrack,
  setHowlerVolume,
} from '@systems/audioSystem/musicPlayer'
import { CHAPTER_PLAYLISTS } from '@data/playlists'
import { AppBar } from './AppBar'

interface Props {
  onBack: () => void
}

export function MusicApp({ onBack }: Props) {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const currentTrackId = useMusicStore((s) => s.currentTrackId)
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const volume = useMusicStore((s) => s.volume)
  const setVolume = useMusicStore((s) => s.setVolume)

  const tracks = CHAPTER_PLAYLISTS[chapter]

  const handleTrackClick = (trackId: string, src: string) => {
    if (trackId === currentTrackId) {
      if (isPlaying) pauseTrack()
      else resumeTrack()
    } else {
      playTrack(src, trackId)
    }
  }

  const handleVolume = (val: number) => {
    setVolume(val)
    setHowlerVolume(val)
  }

  return (
    <div className="app-root">
      <AppBar title="Musik" onBack={onBack} />
      <div className="music-track-list">
        {tracks.map((track) => {
          const isActive = track.id === currentTrackId
          return (
            <button
              key={track.id}
              className={`music-track-item${isActive ? ' music-track-item--active' : ''}`}
              onClick={() => {
                handleTrackClick(track.id, track.src)
              }}
              aria-pressed={isActive}
            >
              <span className="music-track-icon" aria-hidden="true">
                {isActive && isPlaying ? '⏸' : '▶'}
              </span>
              <div className="music-track-info">
                <span className="music-track-title">{track.title}</span>
                <span className="music-track-meta">
                  {track.artist} · {track.duration}
                </span>
              </div>
            </button>
          )
        })}
      </div>
      <div className="music-volume">
        <label className="music-volume-label" htmlFor="music-vol-slider">
          Volume
        </label>
        <input
          id="music-vol-slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          className="music-volume-slider"
          onChange={(e) => {
            handleVolume(parseFloat(e.target.value))
          }}
          aria-label="Volume musik"
        />
      </div>
      <p className="music-note">Audio tersedia setelah aset OST diunggah.</p>
    </div>
  )
}
