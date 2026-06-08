import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MapApp } from '../MapApp'
import { useGameStateStore } from '@stores/gameStateStore'

beforeEach(() => {
  useGameStateStore.setState({
    currentChapter: 'denial',
    currentLocation: 'kamar',
    availableLocations: ['kamar', 'kelas', 'lab', 'taman', 'pusat-perbelanjaan'],
  })
})

describe('MapApp', () => {
  it('renders all 14 location entries', () => {
    render(<MapApp onBack={vi.fn()} />)
    expect(screen.getByText('Kamar')).toBeInTheDocument()
    expect(screen.getByText('Rooftop')).toBeInTheDocument()
    expect(screen.getByText('Kelas')).toBeInTheDocument()
    expect(screen.getByText('Bioskop')).toBeInTheDocument()
  })

  it('marks current location with "di sini" badge', () => {
    render(<MapApp onBack={vi.fn()} />)
    expect(screen.getByText('di sini')).toBeInTheDocument()
  })

  it('disables unavailable locations', () => {
    render(<MapApp onBack={vi.fn()} />)
    const bioskopBtn = screen.getByText('Bioskop').closest('button')
    expect(bioskopBtn).toBeDisabled()
  })

  it('enables available locations', () => {
    render(<MapApp onBack={vi.fn()} />)
    const kelasBtn = screen.getByText('Kelas').closest('button')
    expect(kelasBtn).not.toBeDisabled()
  })

  it('calls setLocation and onBack when clicking available location', () => {
    const onBack = vi.fn()
    const setLocation = vi.fn()
    useGameStateStore.setState({ setLocation })
    render(<MapApp onBack={onBack} />)
    fireEvent.click(screen.getByText('Kelas').closest('button')!)
    expect(setLocation).toHaveBeenCalledWith('kelas')
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('does not call setLocation for disabled locations', () => {
    const onBack = vi.fn()
    render(<MapApp onBack={onBack} />)
    const bioskopBtn = screen.getByText('Bioskop').closest('button')!
    fireEvent.click(bioskopBtn)
    expect(onBack).not.toHaveBeenCalled()
  })

  it('shows back button that calls onBack', () => {
    const onBack = vi.fn()
    render(<MapApp onBack={onBack} />)
    fireEvent.click(screen.getByLabelText('Kembali'))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
