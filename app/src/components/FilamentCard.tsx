import type { CompiledFilament } from '../types/filament'
import { useTranslation } from '../i18n'

interface Props {
  filament: CompiledFilament
}

export default function FilamentCard({ filament }: Props) {
  const { t } = useTranslation()
  const colors = filament.color_hex ? [filament.color_hex] : filament.color_hexes || []

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {filament.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filament.manufacturer}</p>
        </div>
        <span className="shrink-0 px-2.5 py-1 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
          {filament.material}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {colors.slice(0, 8).map((hex, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
            style={{ backgroundColor: `#${hex}` }}
            title={`#${hex}`}
          />
        ))}
        {colors.length > 8 && (
          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            +{colors.length - 8}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span>{filament.diameter}{t.catalog.mm}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span>{filament.weight}{t.catalog.g}</span>
        </div>
        {filament.extruder_temp && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
            <span>{filament.extruder_temp}{t.catalog.celsius}</span>
          </div>
        )}
        {filament.bed_temp && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
            <span>{filament.bed_temp}{t.catalog.celsius}</span>
          </div>
        )}
      </div>
    </div>
  )
}
