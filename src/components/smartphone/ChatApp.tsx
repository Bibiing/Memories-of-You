import { useState } from 'react'
import { useGameStateStore } from '@stores/gameStateStore'
import { getChapterChats } from '@data/chats/index'
import { AppBar } from './AppBar'
import type { ChatThread } from '@/types/smartphone'

interface Props {
  onBack: () => void
}

function ThreadList({
  threads,
  onSelect,
}: {
  threads: ChatThread[]
  onSelect: (id: string) => void
}) {
  const currentDay = useGameStateStore((s) => s.currentDay)

  if (threads.length === 0) {
    return <p className="app-empty">Belum ada pesan.</p>
  }

  return (
    <div className="chat-thread-list">
      {threads.map((t) => {
        const lastMsg = t.messages.filter((m) => m.day <= currentDay).at(-1)
        if (!lastMsg) return null
        return (
          <button
            key={t.id}
            className="chat-thread-item"
            onClick={() => {
              onSelect(t.id)
            }}
          >
            <div className="chat-thread-avatar" style={{ background: t.accentColor }}>
              {t.participantName.charAt(0)}
            </div>
            <div className="chat-thread-info">
              <span className="chat-thread-name">{t.participantName}</span>
              <span className="chat-thread-preview">{lastMsg.text}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function MessageView({ thread, onBack }: { thread: ChatThread; onBack: () => void }) {
  const currentDay = useGameStateStore((s) => s.currentDay)
  const messages = thread.messages.filter((m) => m.day <= currentDay)

  return (
    <div className="app-root">
      <AppBar title={thread.participantName} onBack={onBack} />
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble chat-bubble--${msg.sender}`}>
            <p className="chat-bubble-text">{msg.text}</p>
            <span className="chat-bubble-time">{msg.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChatApp({ onBack }: Props) {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)

  const { threads } = getChapterChats(chapter)
  const activeThread = threads.find((t) => t.id === activeThreadId)

  if (activeThread) {
    return (
      <MessageView
        thread={activeThread}
        onBack={() => {
          setActiveThreadId(null)
        }}
      />
    )
  }

  return (
    <div className="app-root">
      <AppBar title="Pesan" onBack={onBack} />
      <ThreadList threads={threads} onSelect={setActiveThreadId} />
    </div>
  )
}
