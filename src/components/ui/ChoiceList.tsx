import type { DialogueChoice } from '@/types/dialogue'

interface Props {
  choices: DialogueChoice[]
  onChoose: (index: number) => void
}

export function ChoiceList({ choices, onChoose }: Props) {
  return (
    <div className="choice-list" role="group" aria-label="Pilihan">
      {choices.map((choice, i) => (
        <button
          key={i}
          className="choice-btn"
          onClick={(e) => {
            e.stopPropagation()
            onChoose(i)
          }}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}
