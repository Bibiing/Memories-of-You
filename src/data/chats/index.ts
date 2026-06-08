import type { Chapter } from '@/types/game'
import type { ChapterChats, ChatThread } from '@/types/smartphone'

import chatsPrologue from './chats_prologue.json'
import chatsDenial from './chats_denial.json'
import chatsAnger from './chats_anger.json'
import chatsBargaining from './chats_bargaining.json'
import chatsDepression from './chats_depression.json'
import chatsAcceptance from './chats_acceptance.json'
import chatsEpilogue from './chats_epilogue.json'

const CHATS: Record<Chapter, ChapterChats> = {
  prologue: chatsPrologue as ChapterChats,
  denial: chatsDenial as ChapterChats,
  anger: chatsAnger as ChapterChats,
  bargaining: chatsBargaining as ChapterChats,
  depression: chatsDepression as ChapterChats,
  acceptance: chatsAcceptance as ChapterChats,
  epilogue: chatsEpilogue as ChapterChats,
}

export function getChapterChats(chapter: Chapter): ChapterChats {
  return CHATS[chapter]
}

export function getVisibleThreads(chapter: Chapter, currentDay: number): ChatThread[] {
  return getChapterChats(chapter)
    .threads.map((t) => ({
      ...t,
      messages: t.messages.filter((m) => m.day <= currentDay),
    }))
    .filter((t) => t.messages.length > 0)
}
