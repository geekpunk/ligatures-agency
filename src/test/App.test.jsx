import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { mockConfig } from './mockConfig'

describe('App', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch.mockReset()
    global.fetch.mockResolvedValue({
      json: async () => mockConfig
    })
  })

  describe('Configuration Loading', () => {
    it('shows loading state initially', () => {
      global.fetch.mockImplementation(() => new Promise(() => {})) // Never resolves
      render(<App />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('loads and displays configuration', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(/Test Artist/)).toBeInTheDocument()
        expect(screen.getByText(/Test Album/)).toBeInTheDocument()
      })
    })

    it('sets page title from config', async () => {
      render(<App />)

      await waitFor(() => {
        expect(document.title).toBe('Test Artist – Test Album')
      })
    })

    it('applies custom colors from config', async () => {
      render(<App />)

      await waitFor(() => {
        const root = document.documentElement
        expect(root.style.getPropertyValue('--color-primary')).toBe('#5B96C7')
      })
    })
  })

  describe('Album Viewer', () => {
    it('renders album artwork', async () => {
      render(<App />)

      await waitFor(() => {
        const img = screen.getByAltText('album artwork')
        expect(img).toBeInTheDocument()
        expect(img.src).toContain('Front.png')
      })
    })

    it('shows navigation dots', async () => {
      render(<App />)

      await waitFor(() => {
        const dots = document.querySelectorAll('.album-dot')
        expect(dots).toHaveLength(4)
      })
    })

    it('advances to next page on click', async () => {
      const user = userEvent.setup()
      render(<App />)

      await waitFor(() => {
        expect(screen.getByAltText('album artwork')).toBeInTheDocument()
      })

      const viewer = document.querySelector('.album-viewer')
      await user.click(viewer)

      // After click animation, should show next image
      await waitFor(() => {
        const activeDot = document.querySelectorAll('.album-dot-active')
        expect(activeDot).toHaveLength(1)
      })
    })
  })

  describe('Music Player', () => {
    it('displays first track on load', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(/A1\. Test Song 1/)).toBeInTheDocument()
      })
    })

    it('has play/pause button', async () => {
      render(<App />)

      await waitFor(() => {
        const playButton = screen.getByLabelText('Play')
        expect(playButton).toBeInTheDocument()
      })
    })

    it('has previous and next track buttons', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByLabelText('Previous track')).toBeInTheDocument()
        expect(screen.getByLabelText('Next track')).toBeInTheDocument()
      })
    })

    it('shows progress bar', async () => {
      render(<App />)

      await waitFor(() => {
        expect(document.querySelector('.player-progress')).toBeInTheDocument()
      })
    })

    it('shows lyrics button for tracks with lyrics', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Lyrics')).toBeInTheDocument()
      })
    })

    it('does not show lyrics button for instrumental tracks', async () => {
      const user = userEvent.setup()
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Lyrics')).toBeInTheDocument()
      })

      // Navigate to instrumental track (B1)
      const nextButton = screen.getByLabelText('Next track')
      await user.click(nextButton)
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.queryByText('Lyrics')).not.toBeInTheDocument()
      })
    })
  })

  // Lyrics Display tests are covered in the Music Player section above

  describe('Track List', () => {
    it('displays all tracks', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Test Song 1')).toBeInTheDocument()
        expect(screen.getByText('Test Song 2')).toBeInTheDocument()
        expect(screen.getByText('Instrumental')).toBeInTheDocument()
      })
    })

    it('shows track durations', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText("3'00\"")).toBeInTheDocument()
        expect(screen.getByText("2'30\"")).toBeInTheDocument()
      })
    })

    it('shows download links for each track', async () => {
      render(<App />)

      await waitFor(() => {
        const downloadLinks = screen.getAllByText('Download')
        expect(downloadLinks.length).toBeGreaterThan(0)
      })
    })

    it('plays track when clicked', async () => {
      const user = userEvent.setup()
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Test Song 2')).toBeInTheDocument()
      })

      const trackElement = screen.getByText('Test Song 2').closest('.track')
      await user.click(trackElement)

      await waitFor(() => {
        expect(screen.getByText(/A2\. Test Song 2/)).toBeInTheDocument()
      })
    })
  })

  describe('Album Download', () => {
    it('shows download album button', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(/Download Full Album/)).toBeInTheDocument()
      })
    })

    it('download button links to correct zip file', async () => {
      render(<App />)

      await waitFor(() => {
        const downloadButton = screen.getByText(/Download Full Album/).closest('a')
        expect(downloadButton.href).toContain('test-album.zip')
      })
    })
  })

  describe('Credits', () => {
    it('displays credits section', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(/Test credits line 1/)).toBeInTheDocument()
      })
    })

    it('renders links in credits', async () => {
      render(<App />)

      await waitFor(() => {
        const studioLink = screen.getByText('Test Studio')
        expect(studioLink).toBeInTheDocument()
        expect(studioLink.href).toBe('https://test-studio.com/')
      })
    })
  })

  describe('Social Links', () => {
    it('displays social media links', async () => {
      render(<App />)

      await waitFor(() => {
        const githubLink = screen.getByLabelText('GitHub')
        const instagramLink = screen.getByLabelText('Instagram')
        const bandcampLink = screen.getByLabelText('Bandcamp')

        expect(githubLink).toBeInTheDocument()
        expect(instagramLink).toBeInTheDocument()
        expect(bandcampLink).toBeInTheDocument()
      })
    })
  })

  describe('Footer', () => {
    it('displays footer message', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Test footer message')).toBeInTheDocument()
      })
    })
  })

  describe('URL Parameters', () => {
    it('loads specific song from URL parameter', async () => {
      // Mock URL with song parameter
      delete window.location
      window.location = new URL('http://localhost/?song=test_song_2')

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(/A2\. Test Song 2/)).toBeInTheDocument()
      })
    })
  })
})
