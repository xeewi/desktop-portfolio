import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

// two sites, one content: the desktop on "/" (and the old "/desktop"), the classic page on "/classic".
// Each is its own chunk, so neither loads the other's code or styles.
const classic = /^\/classic\/?$/.test(location.pathname)
// one lazy() per page: a single import() behind a ternary gets the wrong page's CSS preloaded
const Site = classic ? lazy(() => import('./classic/Classic.tsx')) : lazy(() => import('./App.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense>
      <Site />
    </Suspense>
  </StrictMode>,
)
