import { useEffect, useState } from 'react'
import { read, write } from '../design-system'
import type { Lang } from '../content'

/** English by default; the visitor's choice is remembered and set on <html lang>. */
export function useLang() {
  const [lang, setLang] = useState<Lang>(() => (read('lang') === 'fr' ? 'fr' : 'en'))
  useEffect(() => {
    document.documentElement.lang = lang
    write('lang', lang)
  }, [lang])
  return { lang, toggleLang: () => setLang((l) => (l === 'en' ? 'fr' : 'en')) }
}
