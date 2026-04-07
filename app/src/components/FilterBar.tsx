import { useMemo } from 'react'
import type { CompiledFilament, Material } from '../types/filament'
import { useTranslation } from '../i18n'

interface Props {
  filaments: CompiledFilament[]
  materials: Material[]
  search: string
  setSearch: (v: string) => void
  manufacturer: string
  setManufacturer: (v: string) => void
  material: string
  setMaterial: (v: string) => void
  diameter: string
  setDiameter: (v: string) => void
}

export default function FilterBar({
  filaments,
  materials,
  search,
  setSearch,
  manufacturer,
  setManufacturer,
  material,
  setMaterial,
  diameter,
  setDiameter,
}: Props) {
  const { t } = useTranslation()

  const manufacturers = useMemo(() => {
    const set = new Set(filaments.map(f => f.manufacturer))
    return Array.from(set).sort()
  }, [filaments])

  const diameters = useMemo(() => {
    const set = new Set(filaments.map(f => f.diameter))
    return Array.from(set).sort((a, b) => a - b)
  }, [filaments])

  const selectCls = "w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.catalog.search}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={manufacturer}
          onChange={e => setManufacturer(e.target.value)}
          className={selectCls}
        >
          <option value="">{t.catalog.allManufacturers}</option>
          {manufacturers.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={material}
          onChange={e => setMaterial(e.target.value)}
          className={selectCls}
        >
          <option value="">{t.catalog.allMaterials}</option>
          {materials.map(m => (
            <option key={m.material} value={m.material}>{m.material}</option>
          ))}
        </select>

        <select
          value={diameter}
          onChange={e => setDiameter(e.target.value)}
          className={selectCls}
        >
          <option value="">{t.catalog.allDiameters}</option>
          {diameters.map(d => (
            <option key={d} value={d}>{d}{t.catalog.mm}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
