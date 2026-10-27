import { describe, expect, it } from 'vitest'
import { baseName, crumbs, isDir, list } from './files'

const PATHS = ['src/App.tsx', 'src/apps/hood/files.ts', 'src/apps/registry.ts', 'src/main.tsx', 'README.md', 'e2e/a11y.spec.ts']

describe('list', () => {
  it('shows the root: folders first, each once, then files', () => {
    expect(list(PATHS, '')).toEqual([
      { name: 'e2e', path: 'e2e/', dir: true },
      { name: 'src', path: 'src/', dir: true },
      { name: 'README.md', path: 'README.md', dir: false },
    ])
  })

  it('shows only what is directly inside a folder', () => {
    expect(list(PATHS, 'src/').map((e) => e.path)).toEqual(['src/apps/', 'src/App.tsx', 'src/main.tsx'])
    expect(list(PATHS, 'src/apps/').map((e) => e.path)).toEqual(['src/apps/hood/', 'src/apps/registry.ts'])
  })

  it('an unknown folder is empty', () => {
    expect(list(PATHS, 'nope/')).toEqual([])
  })
})

describe('crumbs', () => {
  it('goes from the root to a file', () => {
    expect(crumbs('src/apps/x.ts')).toEqual(['', 'src/', 'src/apps/', 'src/apps/x.ts'])
  })
  it('goes from the root to a folder', () => {
    expect(crumbs('src/apps/')).toEqual(['', 'src/', 'src/apps/'])
  })
  it('the root alone', () => {
    expect(crumbs('')).toEqual([''])
  })
})

describe('isDir / baseName', () => {
  it('tells folders from files, and names them', () => {
    expect([isDir(''), isDir('src/'), isDir('src/App.tsx')]).toEqual([true, true, false])
    expect([baseName('src/apps/'), baseName('src/App.tsx'), baseName('')]).toEqual(['apps', 'App.tsx', ''])
  })
})
