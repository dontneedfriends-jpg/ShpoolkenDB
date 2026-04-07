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
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 3v18" />
          </svg>
          <span>{filament.diameter}{t.catalog.mm}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 8v8M8 12h8" />
          </svg>
          <span>{filament.weight}{t.catalog.g}</span>
        </div>
        {filament.extruder_temp && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v10M9 13h6M8 21h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{filament.extruder_temp}{t.catalog.celsius}</span>
          </div>
        )}
        {filament.bed_temp && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h16M6 5v14M18 5v14" />
            </svg>
            <span>{filament.bed_temp}{t.catalog.celsius}</span>
          </div>
        )}
      </div>
    </div>
  )
}
