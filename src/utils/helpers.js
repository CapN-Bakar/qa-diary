export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function formatDate(d) {
  if (!d) return ''
  const date = new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function getCatClass(category) {
  const map = {
    'Learning': 'cat-learning',
    'Good Practice': 'cat-practice',
    'Reflection': 'cat-reflection',
    'Bug Analysis': 'cat-bug',
    'Tool/Technique': 'cat-tool',
  }
  return map[category] || 'cat-learning'
}

export function getRandomQuote(quotes) {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

/**
 * hashPin(pin) — SHA-256 hash a PIN string using the browser's
 * native Web Crypto API. Returns a hex string promise.
 */
export async function hashPin(pin) {
  const encoded = new TextEncoder().encode(pin)
  const buffer  = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
