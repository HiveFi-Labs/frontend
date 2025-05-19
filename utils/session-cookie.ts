export const SESSION_HISTORY_COOKIE = 'strategy:sessions'
export const LAST_SESSION_COOKIE = 'strategy:lastSession'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function getSessionHistory(): string[] {
  if (typeof document === 'undefined') return []
  const match = document.cookie.match(
    new RegExp(`${SESSION_HISTORY_COOKIE}=([^;]+)`),
  )
  if (match?.[1]) {
    try {
      return JSON.parse(decodeURIComponent(match[1])) as string[]
    } catch {
      return []
    }
  }
  return []
}

export function saveSessionHistory(history: string[]) {
  if (typeof document === 'undefined') return
  document.cookie = `${SESSION_HISTORY_COOKIE}=${encodeURIComponent(
    JSON.stringify(history),
  )}; path=/; max-age=${COOKIE_MAX_AGE}`
}

export function getLastSessionId(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp(`${LAST_SESSION_COOKIE}=([^;]+)`),
  )
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function saveLastSessionId(id: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${LAST_SESSION_COOKIE}=${encodeURIComponent(
    id,
  )}; path=/; max-age=${COOKIE_MAX_AGE}`
}
