import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { SmartphoneFrame } from '../SmartphoneFrame'
import { useGameStateStore } from '@stores/gameStateStore'
import { useInventoryStore } from '@stores/inventoryStore'

vi.mock('@systems/audioSystem/musicPlayer', () => ({
  playTrack: vi.fn(),
  pauseTrack: vi.fn(),
  resumeTrack: vi.fn(),
  setHowlerVolume: vi.fn(),
}))

beforeEach(() => {
  useGameStateStore.setState({
    currentChapter: 'prologue',
    currentDay: 1,
    currentLocation: 'kamar',
    availableLocations: ['kamar', 'taman', 'rooftop'],
  })
  useInventoryStore.setState({ flashbackUnlocked: [], actionHistory: [], inventory: [] })
})

describe('SmartphoneFrame', () => {
  it('renders home screen with 5 app icons', () => {
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    expect(screen.getByLabelText('Map')).toBeInTheDocument()
    expect(screen.getByLabelText('Chat')).toBeInTheDocument()
    expect(screen.getByLabelText('Galeri')).toBeInTheDocument()
    expect(screen.getByLabelText('Musik')).toBeInTheDocument()
    expect(screen.getByLabelText('Catatan')).toBeInTheDocument()
  })

  it('navigates to MapApp when Map icon is clicked', () => {
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Map'))
    expect(screen.getByText('Peta')).toBeInTheDocument()
  })

  it('navigates to ChatApp when Chat icon is clicked', () => {
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Chat'))
    expect(screen.getByText('Pesan')).toBeInTheDocument()
  })

  it('navigates to GalleryApp when Galeri icon is clicked', () => {
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Galeri'))
    expect(screen.getByText('Galeri')).toBeInTheDocument()
  })

  it('navigates to NotesApp when Catatan icon is clicked', () => {
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Catatan'))
    expect(screen.getByText('Catatan')).toBeInTheDocument()
  })

  it('returns to home when back button is pressed', () => {
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Map'))
    expect(screen.getByText('Peta')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Kembali'))
    expect(screen.getByLabelText('Map')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<SmartphoneFrame onClose={onClose} onOpenFlashback={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Tutup smartphone'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows chat badge when chapter has threads', () => {
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    // prologue has 2 threads → badge = 2
    const badge = screen.getByLabelText('2 notifikasi')
    expect(badge).toBeInTheDocument()
  })

  it('clears badge after opening the app', () => {
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Chat'))
    fireEvent.click(screen.getByLabelText('Kembali'))
    // After visiting Chat, badge should be gone
    expect(screen.queryByLabelText('2 notifikasi')).not.toBeInTheDocument()
  })

  it('shows gallery badge equal to unlocked flashback count', () => {
    useInventoryStore.setState({
      flashbackUnlocked: ['fb_telponan', 'fb_makan'],
      actionHistory: [],
      inventory: [],
    })
    render(<SmartphoneFrame onClose={vi.fn()} onOpenFlashback={vi.fn()} />)
    const galeriBtn = screen.getByLabelText('Galeri')
    expect(within(galeriBtn).getByLabelText('2 notifikasi')).toBeInTheDocument()
  })
})
