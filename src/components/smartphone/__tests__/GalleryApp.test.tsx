import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryApp } from '../GalleryApp'
import { useInventoryStore } from '@stores/inventoryStore'
import { GALLERY_PHOTOS } from '@data/gallery'

beforeEach(() => {
  useInventoryStore.setState({ flashbackUnlocked: [], actionHistory: [], inventory: [] })
})

describe('GalleryApp', () => {
  it('renders 7 photo slots', () => {
    render(<GalleryApp onBack={vi.fn()} onOpenFlashback={vi.fn()} />)
    const locked = screen.getAllByLabelText('Kenangan terkunci')
    expect(locked).toHaveLength(GALLERY_PHOTOS.length)
  })

  it('shows ??? for all locked photos', () => {
    render(<GalleryApp onBack={vi.fn()} onOpenFlashback={vi.fn()} />)
    const qs = screen.getAllByText('???')
    expect(qs).toHaveLength(GALLERY_PHOTOS.length)
  })

  it('shows correct title for unlocked photo', () => {
    useInventoryStore.setState({
      flashbackUnlocked: ['fb_telponan'],
      actionHistory: [],
      inventory: [],
    })
    render(<GalleryApp onBack={vi.fn()} onOpenFlashback={vi.fn()} />)
    expect(screen.getByText('Pukul Satu Dini Hari')).toBeInTheDocument()
  })

  it('does not show ??? for unlocked photo', () => {
    useInventoryStore.setState({
      flashbackUnlocked: ['fb_telponan'],
      actionHistory: [],
      inventory: [],
    })
    render(<GalleryApp onBack={vi.fn()} onOpenFlashback={vi.fn()} />)
    const qs = screen.getAllByText('???')
    expect(qs).toHaveLength(GALLERY_PHOTOS.length - 1)
  })

  it('calls onOpenFlashback when clicking unlocked photo', () => {
    useInventoryStore.setState({
      flashbackUnlocked: ['fb_makan'],
      actionHistory: [],
      inventory: [],
    })
    const onOpenFlashback = vi.fn()
    render(<GalleryApp onBack={vi.fn()} onOpenFlashback={onOpenFlashback} />)
    fireEvent.click(screen.getByLabelText('Satu Porsi Berdua'))
    expect(onOpenFlashback).toHaveBeenCalledWith('fb_makan')
  })

  it('does not call onOpenFlashback for locked photo', () => {
    const onOpenFlashback = vi.fn()
    render(<GalleryApp onBack={vi.fn()} onOpenFlashback={onOpenFlashback} />)
    const locked = screen.getAllByLabelText('Kenangan terkunci')[0]!
    fireEvent.click(locked)
    expect(onOpenFlashback).not.toHaveBeenCalled()
  })

  it('shows unlock progress counter', () => {
    useInventoryStore.setState({
      flashbackUnlocked: ['fb_telponan', 'fb_makan'],
      actionHistory: [],
      inventory: [],
    })
    render(<GalleryApp onBack={vi.fn()} onOpenFlashback={vi.fn()} />)
    expect(screen.getByText(`2/${GALLERY_PHOTOS.length} kenangan terbuka`)).toBeInTheDocument()
  })
})
