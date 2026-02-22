import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'

const BASE = import.meta.env.BASE_URL

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function renderCreditParagraph(para, index) {
  if (typeof para === 'string') {
    return <p key={index}>{para}</p>
  }

  // Handle complex paragraph with links
  const parts = []
  let keyIndex = 0

  if (para.text) {
    parts.push(<span key={keyIndex++}>{para.text}</span>)
  }

  if (para.link) {
    parts.push(
      <a key={keyIndex++} href={para.link.url} target="_blank" rel="noopener noreferrer">
        {para.link.text}
      </a>
    )
  }

  if (para.link1) {
    parts.push(
      <a key={keyIndex++} href={para.link1.url} target="_blank" rel="noopener noreferrer">
        {para.link1.text}
      </a>
    )
  }

  if (para.text && para.link2) {
    const textParts = para.text.split(' IGN482. ')
    if (textParts.length > 1) {
      parts.push(<span key={keyIndex++}> IGN482. </span>)
    }
  }

  if (para.link2) {
    parts.push(
      <a key={keyIndex++} href={para.link2.url} target="_blank" rel="noopener noreferrer">
        {para.link2.text}
      </a>
    )
  }

  if (para.suffix) {
    parts.push(<span key={keyIndex++}>{para.suffix}</span>)
  }

  return <p key={index}>{parts}</p>
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function BandcampIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 18.75l7.437-13.5H24l-7.438 13.5z"/>
    </svg>
  )
}

function App() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLyrics, setShowLyrics] = useState(false)

  // Album viewer: 4 pages (0=front, 1=lyrics, 2=lyrics-back, 3=back)
  const [albumPage, setAlbumPageState] = useState(0)
  const [trans, setTransState] = useState(null) // { from, to, progress } | null
  const albumRef = useRef(null)
  const albumPageRef = useRef(0)
  const transRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const rafIdRef = useRef(null)
  const timerDotRefs = useRef([null, null, null, null])
  const goToAlbumPageRef = useRef(null)

  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  // Load configuration
  useEffect(() => {
    fetch(`${BASE}album-config.json`)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        setLoading(false)

        // Set page title
        document.title = data.pageTitle

        // Apply custom colors if provided
        if (data.colors) {
          const root = document.documentElement
          if (data.colors.primary) root.style.setProperty('--color-primary', data.colors.primary)
          if (data.colors.heroBackground) root.style.setProperty('--color-hero-bg', data.colors.heroBackground)
          if (data.colors.background) root.style.setProperty('--color-bg', data.colors.background)
          if (data.colors.text) root.style.setProperty('--color-text', data.colors.text)
        }

        // Check for song parameter in URL
        const params = new URLSearchParams(window.location.search)
        const song = params.get('song')
        if (song) {
          const idx = data.tracks.findIndex(
            (t) => t.file.replace('.mp3', '') === song || t.number.toLowerCase() === song.toLowerCase()
          )
          if (idx !== -1) setCurrentTrack(idx)
        }
      })
      .catch((err) => {
        console.error('Failed to load album config:', err)
        setLoading(false)
      })
  }, [])

  const tracks = config?.tracks || []
  const sideA = tracks.filter((t) => t.side === 'A')
  const sideB = tracks.filter((t) => t.side === 'B')

  const updateQueryString = useCallback((index) => {
    if (!tracks[index]) return
    const slug = tracks[index].file.replace('.mp3', '')
    const url = new URL(window.location)
    url.searchParams.set('song', slug)
    window.history.replaceState({}, '', url)
  }, [tracks])

  const playTrack = useCallback((index) => {
    if (!tracks[index]) return
    setCurrentTrack(index)
    setIsPlaying(true)
    updateQueryString(index)
    if (audioRef.current) {
      audioRef.current.src = `${BASE}songs/${tracks[index].file}`
      audioRef.current.play().catch(() => {})
    }
  }, [updateQueryString, tracks])

  const togglePlay = () => {
    if (!audioRef.current || !tracks[currentTrack]) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        audioRef.current.src = `${BASE}songs/${tracks[currentTrack].file}`
      }
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const prevTrack = () => {
    const prev = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1
    playTrack(prev)
  }

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return
    const next = (currentTrack + 1) % tracks.length
    playTrack(next)
  }, [currentTrack, playTrack, tracks.length])

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    audioRef.current.currentTime = pct * duration
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration)
    const onEnded = () => nextTrack()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [nextTrack])

  const pct = duration ? (progress / duration) * 100 : 0

  // --- Album viewer helpers ---
  const allImages = config ? [
    config.images.front,
    config.images.lyrics,
    config.images.lyricsBack,
    config.images.back,
  ] : []

  const getAlbumTransType = (from, to) => {
    const lo = Math.min(from, to), hi = Math.max(from, to)
    return lo === 1 && hi === 2 ? 'slide' : 'flip'
  }

  const easeIO = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

  const setAlbumPage = (p) => { albumPageRef.current = p; setAlbumPageState(p) }
  const setTrans = (t) => { transRef.current = t; setTransState(t) }

  const runAlbumAnim = (startProg, endProg, duration, onDone) => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    const startTime = performance.now()
    const tick = (now) => {
      const raw = Math.min((now - startTime) / duration, 1)
      const prog = startProg + (endProg - startProg) * easeIO(raw)
      setTransState(prev => prev ? { ...prev, progress: prog } : null)
      if (raw < 1) {
        rafIdRef.current = requestAnimationFrame(tick)
      } else {
        rafIdRef.current = null
        onDone?.()
      }
    }
    rafIdRef.current = requestAnimationFrame(tick)
  }

  const commitAlbumTo = (toPage, startProg) => {
    const remaining = Math.max((1 - startProg) * 480, 40)
    runAlbumAnim(startProg, 1, remaining, () => {
      setAlbumPage(toPage)
      setTrans(null)
    })
  }

  const revertAlbum = (startProg) => {
    const remaining = Math.max(startProg * 320, 40)
    runAlbumAnim(startProg, 0, remaining, () => setTrans(null))
  }

  const goToAlbumPage = (newPage) => {
    const from = albumPageRef.current
    if (newPage === from || newPage < 0 || newPage > 3) return
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    transRef.current = { from, to: newPage, progress: 0 }
    setTransState({ from, to: newPage, progress: 0 })
    requestAnimationFrame(() => commitAlbumTo(newPage, 0))
  }

  // Keep ref current so the timer effect can always call the latest version
  goToAlbumPageRef.current = goToAlbumPage

  // Auto-advance timer: cycles pages every 10s when at top of page and not interacting
  useEffect(() => {
    const CYCLE = 10000
    let rafId
    let elapsed = 0
    let lastTimestamp = null
    let lastPage = albumPageRef.current

    const tick = (now) => {
      // Detect manual page change → reset timer
      if (albumPageRef.current !== lastPage) {
        timerDotRefs.current.forEach(el => { if (el) el.style.width = '' })
        elapsed = 0
        lastTimestamp = null
        lastPage = albumPageRef.current
      }

      const paused = isDraggingRef.current || window.scrollY > 5 || transRef.current !== null

      if (!paused) {
        if (lastTimestamp !== null) elapsed += now - lastTimestamp
        lastTimestamp = now
      } else {
        lastTimestamp = null
      }

      const progress = Math.min(elapsed / CYCLE, 1)

      // Drive active dot width directly (no React re-render)
      timerDotRefs.current.forEach((el, i) => {
        if (!el) return
        if (i === albumPageRef.current) {
          el.style.width = `${6 + progress * 26}px`
        } else {
          el.style.width = ''
        }
      })

      if (progress >= 1) {
        elapsed = 0
        lastTimestamp = null
        const cur = albumPageRef.current
        goToAlbumPageRef.current(cur < 3 ? cur + 1 : 0)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      timerDotRefs.current.forEach(el => { if (el) el.style.width = '' })
    }
  }, [])

  const revertResistance = (startAngle) => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    const startTime = performance.now()
    const duration = 380
    const tick = (now) => {
      const raw = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - raw, 3) // ease-out cubic
      const angle = startAngle * (1 - eased)
      transRef.current = { resistance: angle }
      setTransState({ resistance: angle })
      if (raw < 1) {
        rafIdRef.current = requestAnimationFrame(tick)
      } else {
        rafIdRef.current = null
        transRef.current = null
        setTransState(null)
      }
    }
    rafIdRef.current = requestAnimationFrame(tick)
  }

  const handleAlbumPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    // Cancel ongoing animation and settle
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
      const t = transRef.current
      if (t && !('resistance' in t)) {
        const settled = t.progress >= 0.5 ? t.to : t.from
        albumPageRef.current = settled
        setAlbumPageState(settled)
      }
      transRef.current = null
      setTransState(null)
    }
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
  }

  const handleAlbumPointerMove = (e) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartXRef.current
    const w = albumRef.current?.offsetWidth || 400
    const cur = albumPageRef.current

    if (dx < 0 && cur < 3) {
      const prog = Math.min(-dx / w, 1)
      const t = { from: cur, to: cur + 1, progress: prog }
      transRef.current = t
      setTransState(t)
    } else if (dx > 0 && cur > 0) {
      const prog = Math.min(dx / w, 1)
      const t = { from: cur, to: cur - 1, progress: prog }
      transRef.current = t
      setTransState(t)
    } else {
      // Boundary resistance: damped tilt with diminishing returns
      const angle = Math.sqrt(Math.min(Math.abs(dx) / w, 1)) * 18 * (dx > 0 ? 1 : -1)
      const t = { resistance: angle }
      transRef.current = t
      setTransState(t)
    }
  }

  const handleAlbumPointerUp = (e) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const dx = e.clientX - dragStartXRef.current
    const t = transRef.current

    if (Math.abs(dx) < 12) {
      // Tap: advance forward (or reverse at last page)
      if (t) setTrans(null)
      const cur = albumPageRef.current
      goToAlbumPage(cur < 3 ? cur + 1 : 0)
      return
    }

    if (!t) return

    if ('resistance' in t) {
      revertResistance(t.resistance)
      return
    }

    if (t.progress >= 0.25) {
      commitAlbumTo(t.to, t.progress)
    } else {
      revertAlbum(t.progress)
    }
  }

  const handleAlbumPointerCancel = () => {
    isDraggingRef.current = false
    const t = transRef.current
    if (!t) return
    if ('resistance' in t) revertResistance(t.resistance)
    else revertAlbum(t.progress)
  }

  const renderAlbumContent = () => {
    if (!trans) {
      return (
        <img
          key={albumPage}
          src={`${BASE}${allImages[albumPage]}`}
          alt="album artwork"
          style={{ width: '100%', display: 'block' }}
          draggable={false}
        />
      )
    }

    if ('resistance' in trans) {
      return (
        <div style={{ width: '100%', perspective: '800px' }}>
          <img
            src={`${BASE}${allImages[albumPage]}`}
            alt="album artwork"
            style={{
              width: '100%', display: 'block',
              transform: `rotateY(${trans.resistance}deg)`,
            }}
            draggable={false}
          />
        </div>
      )
    }

    const { from, to, progress } = trans
    const type = getAlbumTransType(from, to)
    const forward = to > from

    if (type === 'flip') {
      const lo = Math.min(from, to), hi = Math.max(from, to)
      const angle = forward ? -progress * 180 : -(1 - progress) * 180
      return (
        <div style={{ width: '100%', perspective: '1200px' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${angle}deg)`,
          }}>
            <img
              src={`${BASE}${allImages[lo]}`}
              alt=""
              style={{ width: '100%', display: 'block', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              draggable={false}
            />
            <img
              src={`${BASE}${allImages[hi]}`}
              alt=""
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', display: 'block',
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              draggable={false}
            />
          </div>
        </div>
      )
    }

    // slide
    const sign = forward ? -1 : 1
    return (
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img
          src={`${BASE}${allImages[from]}`}
          alt=""
          style={{ width: '100%', display: 'block', transform: `translateX(${sign * progress * 100}%)` }}
          draggable={false}
        />
        <img
          src={`${BASE}${allImages[to]}`}
          alt=""
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', display: 'block',
            transform: `translateX(${-sign * (1 - progress) * 100}%)`,
          }}
          draggable={false}
        />
      </div>
    )
  }
  // --- end album viewer helpers ---

  // Show loading state
  if (loading || !config) {
    return (
      <div className="site">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: '#999'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="site">
      <audio ref={audioRef} preload="metadata" />

      <section className="hero">
        <div
          ref={albumRef}
          className="album-viewer"
          onPointerDown={handleAlbumPointerDown}
          onPointerMove={handleAlbumPointerMove}
          onPointerUp={handleAlbumPointerUp}
          onPointerCancel={handleAlbumPointerCancel}
        >
          {renderAlbumContent()}
        </div>

        <div className="album-dots">
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              ref={el => { timerDotRefs.current[i] = el }}
              className={`album-dot${albumPage === i ? ' album-dot-active' : ''}`}
            />
          ))}
        </div>

        <h1 className="album-title">
          {config.artistName} <span>&ndash; {config.albumName}</span>
        </h1>

        <div className="player">
          <div className="player-now-playing">
            {tracks[currentTrack].number}. {tracks[currentTrack].name}
          </div>
          <div className="player-controls">
            <button className="player-btn" onClick={prevTrack} aria-label="Previous track">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            <button className="player-btn player-btn-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            <button className="player-btn" onClick={nextTrack} aria-label="Next track">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
          <div className="player-progress" onClick={handleSeek}>
            <div className="player-progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="player-time">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          {tracks[currentTrack]?.lyrics && (
            <button
              className="player-btn-lyrics"
              onClick={() => setShowLyrics(true)}
            >
              Lyrics
            </button>
          )}
        </div>

        <div className="album-download">
          <a
            className="album-download-btn"
            href={`${BASE}${config.downloadZip}`}
            download
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download Full Album (ZIP)
          </a>
        </div>
      </section>

      {showLyrics && tracks[currentTrack]?.lyrics && (
        <div className="lyrics-overlay" onClick={() => setShowLyrics(false)}>
          <div className="lyrics-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="lyrics-header">
              <h3>{tracks[currentTrack].name}</h3>
              <button
                className="lyrics-close"
                onClick={() => setShowLyrics(false)}
                aria-label="Close lyrics"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <pre className="lyrics-body">{tracks[currentTrack].lyrics}</pre>
          </div>
        </div>
      )}

      <section className="tracks">
        <h2>Tracklist</h2>

        <div className="side-label">Side A</div>
        {sideA.map((track) => {
          const idx = tracks.indexOf(track)
          const active = idx === currentTrack
          return (
            <div
              className={`track${active ? ' track-active' : ''}`}
              key={track.number}
              onClick={() => playTrack(idx)}
            >
              <span className="track-number">
                {active && isPlaying ? (
                  <span className="eq-bars">
                    <span /><span /><span />
                  </span>
                ) : (
                  track.number
                )}
              </span>
              <span className="track-name">{track.name}</span>
              <span className="track-duration">{track.duration}</span>
              <a
                className="track-download"
                href={`${BASE}songs/${track.file}`}
                download
                onClick={(e) => e.stopPropagation()}
              >
                Download
              </a>
            </div>
          )
        })}

        <div className="side-label">Side B</div>
        {sideB.map((track) => {
          const idx = tracks.indexOf(track)
          const active = idx === currentTrack
          return (
            <div
              className={`track${active ? ' track-active' : ''}`}
              key={track.number}
              onClick={() => playTrack(idx)}
            >
              <span className="track-number">
                {active && isPlaying ? (
                  <span className="eq-bars">
                    <span /><span /><span />
                  </span>
                ) : (
                  track.number
                )}
              </span>
              <span className="track-name">{track.name}</span>
              <span className="track-duration">{track.duration}</span>
              <a
                className="track-download"
                href={`${BASE}songs/${track.file}`}
                download
                onClick={(e) => e.stopPropagation()}
              >
                Download
              </a>
            </div>
          )
        })}
      </section>

      <section className="credits">
        <h2>Credits</h2>
        <div className="credits-text">
          {config.credits.paragraphs.map((para, index) => renderCreditParagraph(para, index))}
        </div>
      </section>

      <nav className="links">
        <a href={config.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GitHubIcon />
        </a>
        <a href={config.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <InstagramIcon />
        </a>
        <a href={config.links.bandcamp} target="_blank" rel="noopener noreferrer" aria-label="Bandcamp">
          <BandcampIcon />
        </a>
      </nav>

      <footer className="footer">{config.footer}</footer>
    </div>
  )
}

export default App
