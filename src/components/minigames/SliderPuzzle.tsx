import { useState, useCallback } from 'react'
import type { MiniGameProps, SliderPuzzleConfig } from '@/types/minigame'

const CELL_WALL = 1
const CELL_GOAL = 3

interface Pos {
  row: number
  col: number
}

function findStart(grid: number[][]): Pos {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
      if (grid[r]?.[c] === 2) return { row: r, col: c }
    }
  }
  return { row: 0, col: 0 }
}

export function SliderPuzzle({ config, onComplete, onAbandon }: MiniGameProps<SliderPuzzleConfig>) {
  const { grid, rows, cols } = config
  const [playerPos, setPlayerPos] = useState<Pos>(() => findStart(grid))
  const [steps, setSteps] = useState(0)

  const move = useCallback(
    (dr: number, dc: number) => {
      setPlayerPos((pos) => {
        const nr = pos.row + dr
        const nc = pos.col + dc
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return pos
        const cell = grid[nr]?.[nc]
        if (cell === CELL_WALL) return pos

        setSteps((s) => {
          const next = s + 1
          if (cell === CELL_GOAL) {
            setTimeout(() => {
              onComplete({ success: true, score: next })
            }, 200)
          }
          return next
        })
        return { row: nr, col: nc }
      })
    },
    [grid, rows, cols, onComplete]
  )

  const handleKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        move(-1, 0)
        break
      case 'ArrowDown':
        e.preventDefault()
        move(1, 0)
        break
      case 'ArrowLeft':
        e.preventDefault()
        move(0, -1)
        break
      case 'ArrowRight':
        e.preventDefault()
        move(0, 1)
        break
    }
  }

  const cellSize = Math.min(Math.floor(260 / Math.max(rows, cols)), 40)

  return (
    <div className="minigame-root minigame-slider" onKeyDown={handleKey} tabIndex={0}>
      <div className="mg-header">
        <span className="mg-title">Cari Jalan</span>
        <span className="mg-counter">{String(steps)} langkah</span>
      </div>

      <p className="mg-instruction">Gunakan tombol arah untuk bergerak.</p>

      <div
        className="slider-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(' + String(cols) + ', ' + String(cellSize) + 'px)',
          gridTemplateRows: 'repeat(' + String(rows) + ', ' + String(cellSize) + 'px)',
          gap: 2,
        }}
        aria-label="Grid puzzle"
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isPlayer = r === playerPos.row && c === playerPos.col
            const cellClass = [
              'slider-cell',
              cell === CELL_WALL ? 'slider-cell--wall' : '',
              cell === CELL_GOAL ? 'slider-cell--goal' : '',
              cell === 0 ? 'slider-cell--empty' : '',
              isPlayer ? 'slider-cell--player' : '',
            ].join(' ')
            return (
              <div
                key={String(r) + '-' + String(c)}
                className={cellClass}
                style={{ width: cellSize, height: cellSize }}
              >
                {isPlayer && <span className="slider-player" aria-label="Pemain" />}
                {cell === CELL_GOAL && !isPlayer && <span className="slider-goal-marker">★</span>}
              </div>
            )
          })
        )}
      </div>

      <div className="slider-dpad">
        <button
          className="dpad-btn dpad-up"
          onClick={() => {
            move(-1, 0)
          }}
          aria-label="Atas"
        >
          ▲
        </button>
        <div className="dpad-row">
          <button
            className="dpad-btn dpad-left"
            onClick={() => {
              move(0, -1)
            }}
            aria-label="Kiri"
          >
            ◄
          </button>
          <button
            className="dpad-btn dpad-down"
            onClick={() => {
              move(1, 0)
            }}
            aria-label="Bawah"
          >
            ▼
          </button>
          <button
            className="dpad-btn dpad-right"
            onClick={() => {
              move(0, 1)
            }}
            aria-label="Kanan"
          >
            ►
          </button>
        </div>
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>
        Lewati
      </button>
    </div>
  )
}
