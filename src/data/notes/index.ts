import type { Chapter } from '@/types/game'
import type { ChapterNotes, DailyNote } from '@/types/smartphone'

import notesPrologue from './notes_prologue.json'
import notesDenial from './notes_denial.json'
import notesAnger from './notes_anger.json'
import notesBargaining from './notes_bargaining.json'
import notesDepression from './notes_depression.json'
import notesAcceptance from './notes_acceptance.json'
import notesEpilogue from './notes_epilogue.json'

const NOTES: Record<Chapter, ChapterNotes> = {
  prologue: notesPrologue as ChapterNotes,
  denial: notesDenial as ChapterNotes,
  anger: notesAnger as ChapterNotes,
  bargaining: notesBargaining as ChapterNotes,
  depression: notesDepression as ChapterNotes,
  acceptance: notesAcceptance as ChapterNotes,
  epilogue: notesEpilogue as ChapterNotes,
}

export function getChapterNotes(chapter: Chapter): ChapterNotes {
  return NOTES[chapter]
}

export function getVisibleNotes(chapter: Chapter, currentDay: number): DailyNote[] {
  return getChapterNotes(chapter).notes.filter((n) => n.day <= currentDay)
}
