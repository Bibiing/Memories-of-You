import { Howl } from 'howler'
import { useMusicStore } from '@stores/musicStore'

let currentHowl: Howl | null = null
let currentSrc = ''

export function playTrack(src: string, trackId: string): void {
  if (src === currentSrc && currentHowl) {
    if (!currentHowl.playing()) currentHowl.play()
    return
  }
  stopTrack()
  currentSrc = src
  const vol = useMusicStore.getState().volume
  currentHowl = new Howl({
    src: [src],
    loop: true,
    volume: vol,
    onloaderror: () => {
      useMusicStore.getState().setPlaying(false)
      useMusicStore.getState().setCurrentTrack(null)
    },
    onplay: () => { useMusicStore.getState().setPlaying(true) },
    onpause: () => { useMusicStore.getState().setPlaying(false) },
    onstop: () => { useMusicStore.getState().setPlaying(false) },
  })
  currentHowl.play()
  useMusicStore.getState().setCurrentTrack(trackId)
}

export function pauseTrack(): void {
  currentHowl?.pause()
}

export function resumeTrack(): void {
  currentHowl?.play()
}

export function stopTrack(): void {
  if (currentHowl) {
    currentHowl.stop()
    currentHowl.unload()
    currentHowl = null
    currentSrc = ''
  }
  useMusicStore.getState().setPlaying(false)
  useMusicStore.getState().setCurrentTrack(null)
}

export function setHowlerVolume(vol: number): void {
  currentHowl?.volume(vol)
}

export function isCurrentlyPlaying(): boolean {
  return currentHowl?.playing() ?? false
}
