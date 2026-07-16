import { WORDMARK_LETTERS } from '@/lib/wordmarkLetters'

export function Wordmark() {
  return (
    <div
      role="img"
      aria-label="Ansera"
      className="select-none text-4xl font-bold tracking-[0.02em]"
      style={{ fontFamily: "'Roboto', system-ui, 'Segoe UI', sans-serif" }}
    >
      {WORDMARK_LETTERS.map((letter, i) => (
        <span key={i} className={letter.colorClass}>
          {letter.char}
        </span>
      ))}
    </div>
  )
}
