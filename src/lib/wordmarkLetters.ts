// Colored exactly like Google's own wordmark technique: each letter cycles
// through the brand's four core colors, in the same sequence Google uses for
// "Google" (blue, red, yellow, blue, green, red) — "Ansera" is coincidentally
// six letters too, so it maps 1:1. Shared between Wordmark and SplashIntro so
// both use the exact same letter/color mapping.
export const WORDMARK_LETTERS: { char: string; colorClass: string }[] = [
  { char: 'A', colorClass: 'text-cat-1' }, // #4285F4 blue
  { char: 'n', colorClass: 'text-cat-6' }, // #EA4335 red
  { char: 's', colorClass: 'text-cat-3' }, // #FBBC05 yellow
  { char: 'e', colorClass: 'text-cat-1' }, // #4285F4 blue
  { char: 'r', colorClass: 'text-cat-2' }, // #34A853 green
  { char: 'a', colorClass: 'text-cat-6' }, // #EA4335 red
]
