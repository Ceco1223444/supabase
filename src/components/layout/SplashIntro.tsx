import { useEffect, useState } from 'react'
import { WORDMARK_LETTERS } from '@/lib/wordmarkLetters'

const SESSION_KEY = 'ansera_intro_shown'
const SPIN_MS = 1800
const FADE_START_MS = 2600
const FADE_DURATION_MS = 350

type Phase = 'playing' | 'fading' | 'hidden'

export function SplashIntro() {
  const [phase, setPhase] = useState<Phase>(() =>
    sessionStorage.getItem(SESSION_KEY) ? 'hidden' : 'playing',
  )

  useEffect(() => {
    if (phase !== 'playing') return
    sessionStorage.setItem(SESSION_KEY, '1')
    const fadeTimer = setTimeout(() => setPhase('fading'), FADE_START_MS)
    const hideTimer = setTimeout(() => setPhase('hidden'), FADE_START_MS + FADE_DURATION_MS)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [phase])

  if (phase === 'hidden') return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-page transition-opacity ease-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
    >
      <div className="splash-perspective">
        <div
          className="splash-spin select-none text-5xl font-bold tracking-[0.02em]"
          style={{ fontFamily: "'Roboto', system-ui, 'Segoe UI', sans-serif", animationDuration: `${SPIN_MS}ms` }}
        >
          {WORDMARK_LETTERS.map((letter, i) => (
            <span key={i} className={letter.colorClass}>
              {letter.char}
            </span>
          ))}
        </div>
      </div>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-border-light">
        <div
          className="splash-progress-fill h-full rounded-full bg-cat-1"
          style={{ animationDuration: `${FADE_START_MS}ms` }}
        />
      </div>
    </div>
  )
}
