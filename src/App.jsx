import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'

const BASE = import.meta.env.BASE_URL

const lyrics = {
  'All Kindsa Guys': `I've been growing a mustache
I've been getting into weird martial arts
And I don't care any more
I've lost the will to want more

I've been building my brand
I've been talking about "projects"
That I never will do
Watch me tell it to you

Look at me!
Acknowledge me!
There are all kinds of guys here but none like me

I've been getting tattoos of swords and maces
I've been loitering in public spaces
Come and talk to me

I've been documenting my minutiae
incessantly
Put down whatever you're on
Look I wrote you a song`,

  'White Rose': `dad told me to teach the kids
How to drive and how to swim
when they come you never know
when they are here it's time to go

We've seen this all before
From tulsa to Dachau
We've seen this all before
from the plaines to the shores

Sophie and Hans left
On such a fine sunny day
So thousands can awaken
And be stirred today

We've seen this all before
From the tulsa to the putsch
We've seen this all before
from the cities to the hills

It's just a test
Free their body
It's just a test
Free Palestine
It's just a test
Free DC`,

  'Eyes Wide Open': `Am I what you want
Is this what you want us to be
Am I what you want
Is this what you what you want to be
It was all a game after all, it was just a game`,

  'Currency Museum': `How does gold turn to lead?
How does lead turn to rust?
How does a trillion evaporate?
How do you monetize trust?

These answers and more in the currency museum

Why does rarity bring value?
Why does production bring decline?
Why are forgeries burnt?
How does it move the lines?

Does this make sense? Does this make euros, does this make cents?
Does this make sense? Does this make pounds, does this make pence?
Dollars and dinars, yuan and yen
Met expectations, smile and pretend

In the currency museum
Make money or just make your own`,

  'Position Paper': `Value proposition on my chest.
Position papers are referenced.
Reaction, transaction
What more do I need to say about whoever's lives matter today
Consult my feed, no need for talking. Any questions read my front
Categorize, tabulate
Ossify, disseminate.`,

  'Sheer Terror': null,

  'Naval Observatory': `Don't have to roll in the mud
just to learn that it's dirty
as the years they marched on on on
look what's become of me
can't put it into words
can barely put it to sound
no matter how deep I go
I'm never feeling the ground

Trapped in the Navel
Observatory
you're going to hear me shout
Shout shout shout it out
I think i've lost the route
Moving in circles, looking for a path out

never judge a man
without wearing the shoes
no matter where I go
Just brings on the blues
It's hard to survive
don't know if I can make it
U keep me alive
I'll let you know when you blow it

Trapped in the Navel
Observatory
you're going to hear me shout
Shout shout shout it out
I think i've lost the route
Moving in circles, looking for a path out

Testify! Testify!
Testify against the lord
And I let the spirit out

it's pointing spectral Spectral fingers

subpoenas mysteriously ignored.
Got a summary judgement
got summarily judged

yet despite the proceedings
can't abandon the grudge

Trapped in the Navel
Observatory
you're going to hear me shout
Shout shout
like it or lump it
I've lost the route
Moving in circles, looking for a path out`,
}

const tracks = [
  { side: 'A', number: 'A1', name: 'All Kindsa Guys', duration: "3'55\"", file: 'all_kindsa_guys.mp3' },
  { side: 'A', number: 'A2', name: 'White Rose', duration: "2'21\"", file: 'white_rose.mp3' },
  { side: 'A', number: 'A3', name: 'Eyes Wide Open', duration: "2'09\"", file: 'eyes_wide_open.mp3' },
  { side: 'B', number: 'B1', name: 'Currency Museum', duration: "4'20\"", file: 'currency_musuem.mp3' },
  { side: 'B', number: 'B2', name: 'Position Paper', duration: "1'54\"", file: 'position_paper.mp3' },
  { side: 'B', number: 'B3', name: 'Sheer Terror', duration: "1'58\"", file: 'sheer_terror.mp3' },
  { side: 'B', number: 'B4', name: 'Naval Observatory', duration: "2'50\"", file: 'naval_observatory.mp3' },
]

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
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
  const sideA = tracks.filter((t) => t.side === 'A')
  const sideB = tracks.filter((t) => t.side === 'B')

  const [showLyrics, setShowLyrics] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const song = params.get('song')
    if (song) {
      const idx = tracks.findIndex(
        (t) => t.file.replace('.mp3', '') === song || t.number.toLowerCase() === song.toLowerCase()
      )
      if (idx !== -1) return idx
    }
    return 0
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const updateQueryString = useCallback((index) => {
    const slug = tracks[index].file.replace('.mp3', '')
    const url = new URL(window.location)
    url.searchParams.set('song', slug)
    window.history.replaceState({}, '', url)
  }, [])

  const playTrack = useCallback((index) => {
    setCurrentTrack(index)
    setIsPlaying(true)
    updateQueryString(index)
    if (audioRef.current) {
      audioRef.current.src = `${BASE}songs/${tracks[index].file}`
      audioRef.current.play().catch(() => {})
    }
  }, [updateQueryString])

  const togglePlay = () => {
    if (!audioRef.current) return
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
    const next = (currentTrack + 1) % tracks.length
    playTrack(next)
  }, [currentTrack, playTrack])

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

  return (
    <div className="site">
      <audio ref={audioRef} preload="metadata" />

      <section className="hero">
        <div className="album-flip-container" onClick={() => setFlipped(!flipped)}>
          <div className={`album-flip-inner${flipped ? ' flipped' : ''}`}>
            <div className="album-flip-face album-flip-front">
              <img
                src={`${BASE}images/Agency-Front.png`}
                alt="Ligatures - Agency album cover"
              />
            </div>
            <div className="album-flip-face album-flip-back">
              <img
                src={`${BASE}images/Agency-Back.png`}
                alt="Ligatures - Agency album back cover"
              />
            </div>
          </div>
          <div className="flip-hint">{flipped ? 'front' : 'back'}</div>
        </div>

        <h1 className="album-title">
          Ligatures <span>&ndash; Agency</span>
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
          {lyrics[tracks[currentTrack].name] !== null && (
            <button
              className="player-btn-lyrics"
              onClick={() => setShowLyrics(true)}
            >
              Lyrics
            </button>
          )}
        </div>
      </section>

      {showLyrics && lyrics[tracks[currentTrack].name] && (
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
            <pre className="lyrics-body">{lyrics[tracks[currentTrack].name]}</pre>
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
          <p>Mostly made by Dan Goldberg, Mike Wolf, JD Foster.</p>
          <p>
            Sheer Terror written by{' '}
            <a href="https://dischord.com/band/government-issue" target="_blank" rel="noopener noreferrer">
              Government Issue
            </a>.
          </p>
          <p>
            Recorded and mixed at{' '}
            <a href="https://www.vivastudiova.com/" target="_blank" rel="noopener noreferrer">
              Viva Studio
            </a>{' '}
            in Fairfax, Va., in December 2025 and January 2026.
          </p>
          <p>Engineered and mixed by Matthew Michel.</p>
          <p>Mastered by Will Killingsworth.</p>
          <p>
            <a href="https://www.engineerrecords.com/" target="_blank" rel="noopener noreferrer">
              Engineer Records
            </a>{' '}IGN482.{' '}
            <a href="https://www.instagram.com/scene_police_records/" target="_blank" rel="noopener noreferrer">
              Scene Police Records
            </a>{' '}SCP045.
          </p>
        </div>
      </section>

      <nav className="links">
        <a href="https://www.github.com/geekpunk/ligatures-agency" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GitHubIcon />
        </a>
        <a href="https://www.instagram.com/ligatures.dc" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <InstagramIcon />
        </a>
        <a href="https://ligatures.bandcamp.com/" target="_blank" rel="noopener noreferrer" aria-label="Bandcamp">
          <BandcampIcon />
        </a>
      </nav>

      <footer className="footer">diy means you can make your own record, all music and art is on the github page.  Go forth and start your own label.</footer>
    </div>
  )
}

export default App
