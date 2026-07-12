import { WORDMARK_LETTERS } from '@/lib/wordmarkLetters'

const PULSE_STAGGER_MS = 130

export function Wordmark() {
  return (
    <div
      role="img"
      aria-label="Ansera"
      className="select-none text-4xl font-bold tracking-[0.02em]"
      style={{ fontFamily: "'Roboto', system-ui, 'Segoe UI', sans-serif" }}
    >
      {WORDMARK_LETTERS.map((letter, i) => (
        <span
          key={i}
          className={`wordmark-letter ${letter.colorClass}`}
          style={{ animationDelay: `${i * PULSE_STAGGER_MS}ms` }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  )
}
