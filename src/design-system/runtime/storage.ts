// Best effort: storage can be blocked (private browsing, disabled cookies…). Never throws.
export const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable: the choice just won't be remembered */
  }
}
