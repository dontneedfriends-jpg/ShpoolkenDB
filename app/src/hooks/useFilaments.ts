import { useState, useEffect, useMemo } from 'react'
import type { CompiledFilament } from '../types/filament'
import materialsData from '../data/materials.json'
import type { Material } from '../types/filament'

const FILAMENTS_URL = 'https://dontneedfriends-jpg.github.io/ShpoolkenDB/filaments.json'

export function useFilaments() {
  const [data, setData] = useState<CompiledFilament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(FILAMENTS_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(json => {
        if (!cancelled) {
          setData(json)
          setError(null)
        }
      })
      .catch(e => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const materials = useMemo(() => materialsData as Material[], [])

  return { data, materials, loading, error }
}
