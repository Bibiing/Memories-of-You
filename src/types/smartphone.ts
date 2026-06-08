import type { Chapter, FlashbackId } from '@/types/game'

export type AppId = 'map' | 'chat' | 'gallery' | 'music' | 'notes'

export interface ChatMessage {
  id: string
  sender: 'mc' | 'dia' | 'npc'
  senderName: string
  text: string
  timestamp: string
  day: number
}

export interface ChatThread {
  id: string
  participantName: string
  accentColor: string
  messages: ChatMessage[]
}

export interface ChapterChats {
  chapter: Chapter
  threads: ChatThread[]
}

export interface DailyNote {
  day: number
  title: string
  content: string
}

export interface ChapterNotes {
  chapter: Chapter
  notes: DailyNote[]
}

export interface GalleryPhoto {
  flashbackId: FlashbackId
  title: string
  accentColor: string
  chapter: Chapter
}

export interface Track {
  id: string
  title: string
  artist: string
  duration: string
  src: string
}
