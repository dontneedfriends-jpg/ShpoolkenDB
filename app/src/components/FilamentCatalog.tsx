import { useState, useMemo } from 'react'
import { useFilaments } from '../hooks/useFilaments'
import FilamentCard from './FilamentCard'
import FilterBar from './FilterBar'
import { useTranslation } from '../i18n'

export default function FilamentCatalog() {
  const { t } = useTranslation()
  const { data, materials, loading, error } = useFilaments()
  const [search, setSearch] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [material, setMaterial] = useState('')
  const [diameter, setDiameter] = useState('')

  const filtered = useMemo(() => {
    return data.filter(f => {
      if (search) {
        const s = search.toLowerCase()
        if (!f.name.toLowerCase().includes(s) && !f.manufacturer.toLowerCase().includes(s)) return false
      }
      if (manufacturer && f.manufacturer !== manufacturer) return false
      if (material && f.material !== material) return false
      if (diameter && f.diameter !== Number(diameter)) return false
      return true
    })
  }, [data, search, manufacturer, material, diameter])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const f of filtered) {
      const arr = map.get(f.manufacturer) || []
      arr.push(f)
      map.set(f.manufacturer, arr)
    }
    return map
  }, [filtered])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>{t.catalog.loading}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="w-12 h-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{t.catalog.error}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
        >
          {t.catalog.retry}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.catalog.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} {t.catalog.filaments}
        </p>
      </div>

      <FilterBar
        filaments={data}
        materials={materials}
        search={search}
        setSearch={setSearch}
        manufacturer={manufacturer}
        setManufacturer={setManufacturer}
        material={material}
        setMaterial={setMaterial}
        diameter={diameter}
        setDiameter={setDiameter}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{t.catalog.noResults}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.catalog.noResultsDesc}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([mfr, items]) => (
            <div key={mfr}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
                {mfr}
                <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">({items.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(f => (
                  <FilamentCard key={f.id} filament={f} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
