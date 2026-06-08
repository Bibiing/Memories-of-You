import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BreathingRhythm } from '../BreathingRhythm'
import { StruggleButton } from '../StruggleButton'
import { HoldToDelete } from '../HoldToDelete'
import { WordPuzzle } from '../WordPuzzle'
import { PlantingGame } from '../PlantingGame'
import { SliderPuzzle } from '../SliderPuzzle'
import { MiniGameHost } from '../MiniGameHost'

// ── BreathingRhythm ───────────────────────────────────────────
describe('BreathingRhythm', () => {
  it('renders inhale phase initially', () => {
    render(
      <BreathingRhythm
        config={{ inhaleSeconds: 4, holdSeconds: 2, exhaleSeconds: 4, cycles: 3 }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    expect(screen.getByText('Tarik Napas')).toBeInTheDocument()
    expect(screen.getByText('Latihan Pernapasan')).toBeInTheDocument()
  })

  it('shows cycle counter', () => {
    render(
      <BreathingRhythm
        config={{ inhaleSeconds: 4, holdSeconds: 2, exhaleSeconds: 4, cycles: 3 }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    expect(screen.getByText('1 / 3 siklus')).toBeInTheDocument()
  })

  it('calls onAbandon when Lewati is clicked', () => {
    const onAbandon = vi.fn()
    render(
      <BreathingRhythm
        config={{ inhaleSeconds: 4, holdSeconds: 2, exhaleSeconds: 4, cycles: 3 }}
        onComplete={vi.fn()}
        onAbandon={onAbandon}
      />,
    )
    fireEvent.click(screen.getByText('Lewati'))
    expect(onAbandon).toHaveBeenCalledOnce()
  })
})

// ── StruggleButton ────────────────────────────────────────────
describe('StruggleButton', () => {
  it('renders with initial count 0', () => {
    render(
      <StruggleButton
        config={{ target: 10, label: 'Test!', timeLimit: 15 }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    expect(screen.getByText('0 / 10')).toBeInTheDocument()
  })

  it('increments count on button press', () => {
    render(
      <StruggleButton
        config={{ target: 10, label: 'Test!', timeLimit: 15 }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByText('TEKAN'))
    expect(screen.getByText('1 / 10')).toBeInTheDocument()
  })

  it('calls onComplete when target is reached', () => {
    const onComplete = vi.fn()
    render(
      <StruggleButton
        config={{ target: 3, label: 'Test!', timeLimit: 15 }}
        onComplete={onComplete}
        onAbandon={vi.fn()}
      />,
    )
    const btn = screen.getByText('TEKAN')
    fireEvent.click(btn)
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ success: true }))
  })
})

// ── HoldToDelete ─────────────────────────────────────────────
describe('HoldToDelete', () => {
  it('renders all elements', () => {
    render(
      <HoldToDelete
        config={{
          holdDuration: 1000,
          elements: [
            { id: 'a', label: 'Foto', color: '#c9a0dc' },
            { id: 'b', label: 'Chat', color: '#7ec8a0' },
          ],
        }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    expect(screen.getByText('Foto')).toBeInTheDocument()
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('2 tersisa')).toBeInTheDocument()
  })

  it('calls onAbandon on Lewati click', () => {
    const onAbandon = vi.fn()
    render(
      <HoldToDelete
        config={{ holdDuration: 1000, elements: [{ id: 'a', label: 'Item', color: '#fff' }] }}
        onComplete={vi.fn()}
        onAbandon={onAbandon}
      />,
    )
    fireEvent.click(screen.getByText('Lewati'))
    expect(onAbandon).toHaveBeenCalledOnce()
  })
})

// ── WordPuzzle ────────────────────────────────────────────────
describe('WordPuzzle', () => {
  it('renders letter bank', () => {
    render(
      <WordPuzzle
        config={{ target: 'HI', letters: ['H', 'I', 'A'], timeLimit: 30 }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByText('I')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('picks a letter into assembled area', () => {
    render(
      <WordPuzzle
        config={{ target: 'HI', letters: ['H', 'I', 'A'], timeLimit: 30 }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    // Click H from the bank
    const bankLetters = screen.getAllByRole('button', { name: 'H' })
    const bankH = bankLetters.find((b) => b.classList.contains('wp-letter--bank'))
    if (bankH) fireEvent.click(bankH)
    // Now the bank no longer has H
    const remaining = screen.queryAllByRole('button', { name: 'H' })
    expect(remaining.some((b) => b.classList.contains('wp-letter--bank'))).toBe(false)
  })

  it('calls onComplete when correct word assembled', () => {
    const onComplete = vi.fn()
    render(
      <WordPuzzle
        config={{ target: 'HI', letters: ['H', 'I', 'A'], timeLimit: 30 }}
        onComplete={onComplete}
        onAbandon={vi.fn()}
      />,
    )
    const allBtns = screen.getAllByRole('button')
    const bankH = allBtns.find((b) => b.textContent === 'H' && b.classList.contains('wp-letter--bank'))
    const bankI = allBtns.find((b) => b.textContent === 'I' && b.classList.contains('wp-letter--bank'))
    if (bankH) fireEvent.click(bankH)
    if (bankI) fireEvent.click(bankI)
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ success: true }))
  })
})

// ── PlantingGame ──────────────────────────────────────────────
describe('PlantingGame', () => {
  const config = {
    steps: [
      { id: 's1', label: 'Siapkan pot', icon: '🪴' },
      { id: 's2', label: 'Isi tanah', icon: '🌱' },
    ],
    correctOrder: ['s1', 's2'],
  }

  it('renders action buttons for all steps', () => {
    render(<PlantingGame config={config} onComplete={vi.fn()} onAbandon={vi.fn()} />)
    expect(screen.getByText('Siapkan pot')).toBeInTheDocument()
    expect(screen.getByText('Isi tanah')).toBeInTheDocument()
  })

  it('completes when steps done in correct order', () => {
    const onComplete = vi.fn()
    render(<PlantingGame config={config} onComplete={onComplete} onAbandon={vi.fn()} />)
    const allBtns = screen.getAllByRole('button')
    const s1Btn = allBtns.find((b) => b.textContent?.includes('Siapkan pot'))
    const s2Btn = allBtns.find((b) => b.textContent?.includes('Isi tanah'))
    if (s1Btn) fireEvent.click(s1Btn)
    if (s2Btn) fireEvent.click(s2Btn)
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ success: true }))
  })

  it('does not complete when steps done in wrong order', () => {
    const onComplete = vi.fn()
    render(<PlantingGame config={config} onComplete={onComplete} onAbandon={vi.fn()} />)
    const allBtns = screen.getAllByRole('button')
    const s2Btn = allBtns.find((b) => b.textContent?.includes('Isi tanah'))
    if (s2Btn) fireEvent.click(s2Btn)
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// ── SliderPuzzle ──────────────────────────────────────────────
describe('SliderPuzzle', () => {
  const config = {
    rows: 3,
    cols: 3,
    grid: [
      [0, 0, 0],
      [0, 2, 0],
      [0, 0, 3],
    ],
  }

  it('renders the grid', () => {
    render(<SliderPuzzle config={config} onComplete={vi.fn()} onAbandon={vi.fn()} />)
    expect(screen.getByLabelText('Grid puzzle')).toBeInTheDocument()
  })

  it('renders D-pad controls', () => {
    render(<SliderPuzzle config={config} onComplete={vi.fn()} onAbandon={vi.fn()} />)
    expect(screen.getByLabelText('Atas')).toBeInTheDocument()
    expect(screen.getByLabelText('Bawah')).toBeInTheDocument()
    expect(screen.getByLabelText('Kiri')).toBeInTheDocument()
    expect(screen.getByLabelText('Kanan')).toBeInTheDocument()
  })

  it('increments step counter on move', () => {
    render(<SliderPuzzle config={config} onComplete={vi.fn()} onAbandon={vi.fn()} />)
    expect(screen.getByText('0 langkah')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Kanan'))
    expect(screen.getByText('1 langkah')).toBeInTheDocument()
  })

  it('does not move into wall', () => {
    const wallConfig = {
      rows: 3,
      cols: 3,
      grid: [
        [1, 1, 1],
        [1, 2, 1],
        [1, 1, 3],
      ],
    }
    render(<SliderPuzzle config={wallConfig} onComplete={vi.fn()} onAbandon={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Kanan')) // wall
    expect(screen.getByText('0 langkah')).toBeInTheDocument()
  })
})

// ── MiniGameHost ──────────────────────────────────────────────
describe('MiniGameHost', () => {
  it('renders BreathingRhythm for breathing-rhythm type', () => {
    render(
      <MiniGameHost
        type="breathing-rhythm"
        config={{ inhaleSeconds: 4, holdSeconds: 2, exhaleSeconds: 4, cycles: 2 }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    expect(screen.getByText('Latihan Pernapasan')).toBeInTheDocument()
  })

  it('renders WordPuzzle for word-puzzle type', () => {
    render(
      <MiniGameHost
        type="word-puzzle"
        config={{ target: 'HI', letters: ['H', 'I'], timeLimit: 30 }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    expect(screen.getByText('Susun Kata')).toBeInTheDocument()
  })

  it('renders SliderPuzzle for slider-puzzle type', () => {
    render(
      <MiniGameHost
        type="slider-puzzle"
        config={{ rows: 3, cols: 3, grid: [[0,0,0],[0,2,0],[0,0,3]] }}
        onComplete={vi.fn()}
        onAbandon={vi.fn()}
      />,
    )
    expect(screen.getByText('Cari Jalan')).toBeInTheDocument()
  })
})
