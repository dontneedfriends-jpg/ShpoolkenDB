import { useState, useCallback } from 'react'
import { useTranslation } from '../i18n'
import { useFilaments } from '../hooks/useFilaments'
import { generateIssueUrl } from '../utils/github'
import type { SpoolType, Finish, Pattern, MultiColorDirection } from '../types/filament'

interface WeightEntry {
  weight: string
  spool_weight: string
  spool_type: SpoolType
}

interface ColorEntry {
  name: string
  hex: string
}

interface FormData {
  manufacturer: string
  isNewManufacturer: boolean
  newManufacturerName: string
  filamentName: string
  material: string
  density: string
  extruder_temp: string
  bed_temp: string
  extruder_temp_range_min: string
  extruder_temp_range_max: string
  bed_temp_range_min: string
  bed_temp_range_max: string
  weights: WeightEntry[]
  diameters: string[]
  colors: ColorEntry[]
  finish: Finish
  pattern: Pattern
  multi_color_direction: MultiColorDirection
  translucent: boolean
  glow: boolean
}

function sanitizeString(str: string): string {
  return str.replace(/[<>&"']/g, '')
}

function createInitialForm(): FormData {
  return {
    manufacturer: '',
    isNewManufacturer: false,
    newManufacturerName: '',
    filamentName: '',
    material: '',
    density: '',
    extruder_temp: '',
    bed_temp: '',
    extruder_temp_range_min: '',
    extruder_temp_range_max: '',
    bed_temp_range_min: '',
    bed_temp_range_max: '',
    weights: [{ weight: '', spool_weight: '', spool_type: null }],
    diameters: [''],
    colors: [{ name: '', hex: '' }],
    finish: null,
    pattern: null,
    multi_color_direction: null,
    translucent: false,
    glow: false,
  }
}

export default function AddFilamentForm() {
  const { t } = useTranslation()
  const { data: existingFilaments } = useFilaments()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(createInitialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  const manufacturers = Array.from(new Set(existingFilaments.map(f => f.manufacturer))).sort()

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }, [])

  const updateWeight = useCallback((idx: number, field: keyof WeightEntry, value: string | SpoolType) => {
    setForm(prev => {
      const w = [...prev.weights]
      w[idx] = { ...w[idx], [field]: value }
      return { ...prev, weights: w }
    })
  }, [])

  const addWeight = useCallback(() => {
    setForm(prev => ({ ...prev, weights: [...prev.weights, { weight: '', spool_weight: '', spool_type: null }] }))
  }, [])

  const removeWeight = useCallback((idx: number) => {
    setForm(prev => ({ ...prev, weights: prev.weights.filter((_, i) => i !== idx) }))
  }, [])

  const updateDiameter = useCallback((idx: number, value: string) => {
    setForm(prev => {
      const d = [...prev.diameters]
      d[idx] = value
      return { ...prev, diameters: d }
    })
  }, [])

  const addDiameter = useCallback(() => {
    setForm(prev => ({ ...prev, diameters: [...prev.diameters, ''] }))
  }, [])

  const removeDiameter = useCallback((idx: number) => {
    setForm(prev => ({ ...prev, diameters: prev.diameters.filter((_, i) => i !== idx) }))
  }, [])

  const updateColor = useCallback((idx: number, field: keyof ColorEntry, value: string) => {
    setForm(prev => {
      const c = [...prev.colors]
      c[idx] = { ...c[idx], [field]: value }
      return { ...prev, colors: c }
    })
  }, [])

  const addColor = useCallback(() => {
    setForm(prev => ({ ...prev, colors: [...prev.colors, { name: '', hex: '' }] }))
  }, [])

  const removeColor = useCallback((idx: number) => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }))
  }, [])

  const validateStep = useCallback((s: number): boolean => {
    const errs: Record<string, string> = {}

    if (s === 0) {
      if (!form.manufacturer && !form.isNewManufacturer) errs.manufacturer = t.form.required
      if (form.isNewManufacturer && !form.newManufacturerName.trim()) errs.newManufacturerName = t.form.required
    }

    if (s === 1) {
      if (!form.filamentName.trim()) errs.filamentName = t.form.required
      if (!form.material.trim()) errs.material = t.form.required
      if (!form.density || Number(form.density) <= 0) errs.density = t.form.invalidDensity
    }

    if (s === 2) {
      const validWeights = form.weights.filter(w => w.weight && Number(w.weight) > 0)
      if (validWeights.length === 0) errs.weights = t.form.atLeastOneWeight
      const validDiameters = form.diameters.filter(d => d && Number(d) > 0)
      if (validDiameters.length === 0) errs.diameters = t.form.atLeastOneDiameter
    }

    if (s === 3) {
      const validColors = form.colors.filter(c => c.name.trim() && c.hex.trim())
      if (validColors.length === 0) errs.colors = t.form.atLeastOneColor
      form.colors.forEach((c, i) => {
        if (c.hex && !/^[0-9a-fA-F]{6}$/.test(c.hex.trim())) {
          errs[`color_${i}`] = t.form.invalidHex
        }
      })
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [form, t])

  const nextStep = useCallback(() => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 3))
  }, [step, validateStep])

  const prevStep = useCallback(() => {
    setStep(s => Math.max(s - 1, 0))
  }, [])

  const buildJson = useCallback(() => {
    const mfr = form.isNewManufacturer ? form.newManufacturerName.trim() : form.manufacturer
    const weights = form.weights
      .filter(w => w.weight && Number(w.weight) > 0)
      .map(w => {
        const obj: Record<string, unknown> = { weight: Number(w.weight) }
        if (w.spool_weight) obj.spool_weight = Number(w.spool_weight)
        if (w.spool_type) obj.spool_type = w.spool_type
        return obj
      })
    const diameters = form.diameters.filter(d => d && Number(d) > 0).map(Number)
    const colors = form.colors
      .filter(c => c.name.trim() && c.hex.trim())
      .map(c => {
        const obj: Record<string, unknown> = { name: c.name.trim(), hex: c.hex.trim() }
        if (form.finish) obj.finish = form.finish
        if (form.pattern) obj.pattern = form.pattern
        if (form.multi_color_direction) obj.multi_color_direction = form.multi_color_direction
        if (form.translucent) obj.translucent = true
        if (form.glow) obj.glow = true
        return obj
      })

    const filament: Record<string, unknown> = {
      name: form.filamentName.trim(),
      material: form.material.trim(),
      density: Number(form.density),
      weights,
      diameters,
      colors,
    }

    if (form.extruder_temp) filament.extruder_temp = Number(form.extruder_temp)
    if (form.bed_temp) filament.bed_temp = Number(form.bed_temp)
    if (form.extruder_temp_range_min && form.extruder_temp_range_max) {
      filament.extruder_temp_range = [Number(form.extruder_temp_range_min), Number(form.extruder_temp_range_max)]
    }
    if (form.bed_temp_range_min && form.bed_temp_range_max) {
      filament.bed_temp_range = [Number(form.bed_temp_range_min), Number(form.bed_temp_range_max)]
    }

    return { manufacturer: mfr, filaments: [filament] }
  }, [form])

  const handleSubmit = useCallback(() => {
    const json = buildJson()
    const mfr = sanitizeString(form.isNewManufacturer ? form.newManufacturerName.trim() : form.manufacturer)
    const url = generateIssueUrl(json, mfr)
    window.open(url, '_blank')
  }, [buildJson, form])

  const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
  const errorCls = "text-xs text-red-500 mt-1"
  const selectCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"

  const steps = [t.form.step1, t.form.step2, t.form.step3, t.form.step4]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.form.title}</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
              i < step ? 'bg-violet-600 text-white' :
              i === step ? 'bg-violet-600 text-white ring-4 ring-violet-200 dark:ring-violet-900' :
              'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {i < step ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`hidden sm:block text-xs font-medium ${
              i <= step ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
            }`}>{s}</span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        {/* Step 0: Manufacturer */}
        {step === 0 && (
          <>
            <div>
              <label className={labelCls}>{t.form.manufacturer}</label>
              <select
                value={form.manufacturer}
                onChange={e => { update('manufacturer', e.target.value); if (e.target.value) update('isNewManufacturer', false) }}
                className={selectCls}
              >
                <option value="">{t.form.selectManufacturer}</option>
                {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                <option value="__new__">{t.form.newManufacturer}</option>
              </select>
              {errors.manufacturer && <p className={errorCls}>{errors.manufacturer}</p>}
            </div>

            {form.manufacturer === '__new__' && (
              <div>
                <label className={labelCls}>{t.form.manufacturerName}</label>
                <input
                  type="text"
                  value={form.newManufacturerName}
                  onChange={e => { update('newManufacturerName', e.target.value); update('isNewManufacturer', true) }}
                  placeholder="eSun, Prusament..."
                  className={inputCls}
                />
                {errors.newManufacturerName && <p className={errorCls}>{errors.newManufacturerName}</p>}
              </div>
            )}
          </>
        )}

        {/* Step 1: Basic params */}
        {step === 1 && (
          <>
            <div>
              <label className={labelCls}>{t.form.filamentName}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.filamentName}
                  onChange={e => update('filamentName', e.target.value)}
                  placeholder="PLA {color_name}"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => {
                    const pos = form.filamentName.indexOf('{color_name}')
                    if (pos >= 0) {
                      update('filamentName', form.filamentName.replace('{color_name}', ''))
                    } else {
                      update('filamentName', form.filamentName + '{color_name}')
                    }
                  }}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                  title={t.form.filamentNameHint}
                >
                  {form.filamentName.includes('{color_name}') ? '✓ {color_name}' : '+ {color_name}'}
                </button>
              </div>
              {errors.filamentName && <p className={errorCls}>{errors.filamentName}</p>}
            </div>

            <div>
              <label className={labelCls}>{t.form.material}</label>
              <input
                type="text"
                value={form.material}
                onChange={e => update('material', e.target.value)}
                placeholder="PLA, PETG, ABS..."
                className={inputCls}
              />
              {errors.material && <p className={errorCls}>{errors.material}</p>}
            </div>

            <div>
              <label className={labelCls}>{t.form.density}</label>
              <input
                type="number"
                step="0.01"
                value={form.density}
                onChange={e => update('density', e.target.value)}
                placeholder="1.24"
                className={inputCls}
              />
              {errors.density && <p className={errorCls}>{errors.density}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t.form.extruderTemp}</label>
                <input
                  type="number"
                  value={form.extruder_temp}
                  onChange={e => update('extruder_temp', e.target.value)}
                  placeholder="210"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>{t.form.bedTemp}</label>
                <input
                  type="number"
                  value={form.bed_temp}
                  onChange={e => update('bed_temp', e.target.value)}
                  placeholder="50"
                  className={inputCls}
                />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Weights & Diameters */}
        {step === 2 && (
          <>
            <div>
              <label className={labelCls}>{t.form.weights}</label>
              <div className="space-y-2">
                {form.weights.map((w, i) => (
                  <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-start">
                    <input
                      type="number"
                      value={w.weight}
                      onChange={e => updateWeight(i, 'weight', e.target.value)}
                      placeholder={t.form.weight}
                      className={inputCls}
                    />
                    <input
                      type="number"
                      value={w.spool_weight}
                      onChange={e => updateWeight(i, 'spool_weight', e.target.value)}
                      placeholder={t.form.spoolWeight}
                      className={inputCls}
                    />
                    <select
                      value={w.spool_type || ''}
                      onChange={e => updateWeight(i, 'spool_type', (e.target.value || null) as SpoolType)}
                      className={selectCls}
                    >
                      <option value="">{t.form.spoolType}</option>
                      <option value="plastic">{t.form.spoolTypePlastic}</option>
                      <option value="cardboard">{t.form.spoolTypeCardboard}</option>
                      <option value="metal">{t.form.spoolTypeMetal}</option>
                    </select>
                    {form.weights.length > 1 && (
                      <button
                        onClick={() => removeWeight(i)}
                        className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.weights && <p className={errorCls}>{errors.weights}</p>}
              <button onClick={addWeight} className="mt-2 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
                + {t.form.addWeight}
              </button>
            </div>

            <div>
              <label className={labelCls}>{t.form.diameters}</label>
              <div className="space-y-2">
                {form.diameters.map((d, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <input
                      type="number"
                      step="0.01"
                      value={d}
                      onChange={e => updateDiameter(i, e.target.value)}
                      placeholder="1.75"
                      className={`${inputCls} flex-1`}
                    />
                    {form.diameters.length > 1 && (
                      <button
                        onClick={() => removeDiameter(i)}
                        className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.diameters && <p className={errorCls}>{errors.diameters}</p>}
              <button onClick={addDiameter} className="mt-2 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
                + {t.form.addDiameter}
              </button>
            </div>
          </>
        )}

        {/* Step 3: Colors */}
        {step === 3 && (
          <>
            <div className="space-y-3">
              <label className={labelCls}>{t.form.colors}</label>
              {form.colors.map((c, i) => (
                <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <input
                    type="color"
                    value={c.hex.startsWith('#') ? c.hex : `#${c.hex}`}
                    onChange={e => updateColor(i, 'hex', e.target.value.replace('#', ''))}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={c.name}
                    onChange={e => updateColor(i, 'name', e.target.value)}
                    placeholder={t.form.colorName}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="text"
                    value={c.hex}
                    onChange={e => updateColor(i, 'hex', e.target.value.replace(/[^0-9a-fA-F]/g, ''))}
                    placeholder="FFFFFF"
                    maxLength={8}
                    className={`${inputCls} w-24 font-mono uppercase`}
                  />
                  {form.colors.length > 1 && (
                    <button
                      onClick={() => removeColor(i)}
                      className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {errors.colors && <p className={errorCls}>{errors.colors}</p>}
              {form.colors.map((_, i) => (
                errors[`color_${i}`] ? <p key={i} className={errorCls}>{errors[`color_${i}`]}</p> : null
              ))}
              <button onClick={addColor} className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
                + {t.form.addColor}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div>
                <label className={labelCls}>{t.form.finish}</label>
                <select value={form.finish || ''} onChange={e => update('finish', (e.target.value || null) as Finish)} className={selectCls}>
                  <option value="">{t.form.patternNone}</option>
                  <option value="matte">{t.form.finishMatte}</option>
                  <option value="glossy">{t.form.finishGlossy}</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t.form.pattern}</label>
                <select value={form.pattern || ''} onChange={e => update('pattern', (e.target.value || null) as Pattern)} className={selectCls}>
                  <option value="">{t.form.patternNone}</option>
                  <option value="marble">{t.form.patternMarble}</option>
                  <option value="sparkle">{t.form.patternSparkle}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.translucent} onChange={e => update('translucent', e.target.checked)} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.form.translucent}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.glow} onChange={e => update('glow', e.target.checked)} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.form.glow}</span>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {t.form.back}
        </button>

        {step < 3 ? (
          <button
            onClick={nextStep}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
          >
            {t.form.next}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {t.form.preview}
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              {t.form.submit}
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      {showPreview && step === 3 && (
        <div className="bg-gray-900 dark:bg-black rounded-xl p-4 overflow-x-auto">
          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
            {JSON.stringify(buildJson(), null, 2)}
          </pre>
        </div>
      )}

      {step === 3 && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          {t.form.submitDesc}
        </p>
      )}
    </div>
  )
}
