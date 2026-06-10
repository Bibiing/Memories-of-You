import { useEffect, useRef } from 'react'
import { useGameStateStore } from '@stores/gameStateStore'
import { useMusicStore } from '@stores/musicStore'
import { playTrack, stopTrack } from '@systems/audioSystem/musicPlayer'
import { CHAPTER_PLAYLISTS } from '@data/playlists'

/**
 * Otomatis memutar track pertama dari playlist chapter yang aktif.
 * Berhenti saat unmount.
 */
export function useChapterBGM() {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const currentTrackId = useMusicStore((s) => s.currentTrackId)
  const prevChapterRef = useRef<string | null>(null)

  useEffect(() => {
    if (chapter === prevChapterRef.current) return
    prevChapterRef.current = chapter

    const tracks = CHAPTER_PLAYLISTS[chapter]
    if (tracks.length === 0) return

    const first = tracks[0]
    if (!first) return

    // Jangan restart kalau track yang sama sudah bermain
    if (currentTrackId === first.id) return

    playTrack(first.src, first.id)
  }, [chapter, currentTrackId])

  useEffect(() => {
    return () => {
      stopTrack()
    }
  }, [])
}
