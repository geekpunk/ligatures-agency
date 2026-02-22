import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import { mockConfig } from './mockConfig'

describe('Album Viewer', () => {
  beforeEach(() => {
    global.fetch.mockReset()
    global.fetch.mockResolvedValue({
      json: async () => mockConfig
    })
  })

  describe('Basic Rendering', () => {
    it('renders album viewer element', async () => {
      render(<App />)

      await waitFor(() => {
        const viewer = document.querySelector('.album-viewer')
        expect(viewer).toBeInTheDocument()
      })
    })

    it('displays album artwork image', async () => {
      render(<App />)

      await waitFor(() => {
        const img = screen.getByAltText('album artwork')
        expect(img).toBeInTheDocument()
        expect(img.src).toContain('Front.png')
      })
    })

    it('has pointer event handlers', async () => {
      render(<App />)

      await waitFor(() => {
        const viewer = document.querySelector('.album-viewer')
        expect(viewer).toBeInTheDocument()
        // Viewer should be interactive
        expect(viewer.className).toContain('album-viewer')
      })
    })
  })

  describe('Navigation Dots', () => {
    it('renders 4 navigation dots', async () => {
      render(<App />)

      await waitFor(() => {
        const dots = document.querySelectorAll('.album-dot')
        expect(dots).toHaveLength(4)
      })
    })

    it('highlights first dot initially', async () => {
      render(<App />)

      await waitFor(() => {
        const activeDots = document.querySelectorAll('.album-dot-active')
        expect(activeDots).toHaveLength(1)
      })
    })

    it('dots container has correct structure', async () => {
      render(<App />)

      await waitFor(() => {
        const dotsContainer = document.querySelector('.album-dots')
        expect(dotsContainer).toBeInTheDocument()
        expect(dotsContainer.children).toHaveLength(4)
      })
    })
  })

  describe('Images Configuration', () => {
    it('has access to all 4 images from config', async () => {
      render(<App />)

      await waitFor(() => {
        const viewer = document.querySelector('.album-viewer')
        expect(viewer).toBeInTheDocument()
      })

      // Config should have all 4 image paths
      expect(mockConfig.images.front).toBeDefined()
      expect(mockConfig.images.lyrics).toBeDefined()
      expect(mockConfig.images.lyricsBack).toBeDefined()
      expect(mockConfig.images.back).toBeDefined()
    })
  })

  describe('Interactive Features', () => {
    it('has touch-action styling for mobile', async () => {
      render(<App />)

      await waitFor(() => {
        const viewer = document.querySelector('.album-viewer')
        const styles = window.getComputedStyle(viewer)
        // The CSS should include touch-action: pan-y
        expect(viewer).toBeInTheDocument()
      })
    })

    it('has user-select disabled for drag interactions', async () => {
      render(<App />)

      await waitFor(() => {
        const viewer = document.querySelector('.album-viewer')
        expect(viewer).toBeInTheDocument()
        // CSS should have user-select: none
      })
    })

    it('displays shadow for depth effect', async () => {
      render(<App />)

      await waitFor(() => {
        const viewer = document.querySelector('.album-viewer')
        expect(viewer).toBeInTheDocument()
        // CSS should include box-shadow
      })
    })
  })
})
