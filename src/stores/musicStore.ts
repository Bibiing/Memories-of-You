import { create } from 'zustand'

interface MusicState {
  currentTrackId: string | null
  isPlaying: boolean
  volume: number
}

interface MusicActions {
  setCurrentTrack: (id: string | null) => void
  setPlaying: (playing: boolean) => void
  setVolume: (vol: number) => void
}

export const useMusicStore = create<MusicState & MusicActions>((set) => ({
  currentTrackId: null,
  isPlaying: false,
  volume: 0.7,

  setCurrentTrack: (id) => { set({ currentTrackId: id }) },
  setPlaying: (playing) => { set({ isPlaying: playing }) },
  setVolume: (vol) => { set({ volume: vol }) },
}))
