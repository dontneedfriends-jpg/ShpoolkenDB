import { useState, useEffect, useMemo } from 'react'
import type { CompiledFilament } from '../types/filament'
import materialsData from '../data/materials.json'
import type { Material } from '../types/filament'

const FILAMENTS_URL = 'https://dontneedfriends-jpg.github.io/ShpoolkenDB/filaments.json'
const CACHE_KEY = 'shpoolken_filaments_cache'
const CACHE_TIMESTAMP_KEY = 'shpoolken_filaments_timestamp'
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours

function getCachedData(): CompiledFilament[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp)
      if (age < CACHE_DURATION) {
        return JSON.parse(cached)
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return null
}

function setCachedData(data: CompiledFilament[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch {
    // Ignore localStorage errors
  }
}

export function useFilaments() {
  const [data, setData] = useState<CompiledFilament[]>(() => getCachedData() || [])
  const [loading, setLoading] = useState(!getCachedData())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    
    // Check if we need to fetch fresh data
    const cached = getCachedData()
    if (cached) {
      setData(cached)
      setLoading(false)
    }

    fetch(FILAMENTS_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(json => {
        if (!cancelled) {
          setData(json)
          setCachedData(json)
          setError(null)
        }
      })
      .catch(e => {
        if (!cancelled) {
          // If fetch fails but we have cached data, don't show error
          if (!cached) {
            setError(e.message)
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const materials = useMemo(() => materialsData as Material[], [])

  return { data, materials, loading, error }
}
