import { useGameStateStore } from '@stores/gameStateStore'
import { getVisibleNotes } from '@data/notes/index'
import { AppBar } from './AppBar'

interface Props {
  onBack: () => void
}

export function NotesApp({ onBack }: Props) {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const currentDay = useGameStateStore((s) => s.currentDay)

  const notes = getVisibleNotes(chapter, currentDay)

  return (
    <div className="app-root">
      <AppBar title="Catatan" onBack={onBack} />
      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="app-empty">Belum ada catatan.</p>
        ) : (
          [...notes].reverse().map((note) => (
            <article key={note.day} className="note-item">
              <span className="note-day">Hari {note.day}</span>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-content">{note.content}</p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
