export type SpoolType = 'plastic' | 'cardboard' | 'metal' | null
export type Finish = 'matte' | 'glossy' | null
export type MultiColorDirection = 'coaxial' | 'longitudinal' | null
export type Pattern = 'marble' | 'sparkle' | null

export interface Weight {
  weight: number
  spool_weight?: number
  spool_type?: SpoolType
}

export interface Color {
  name: string
  hex?: string
  hexes?: string[]
  finish?: Finish
  multi_color_direction?: MultiColorDirection
  pattern?: Pattern
  translucent?: boolean
  glow?: boolean
}

export interface FilamentEntry {
  name: string
  material: string
  density: number
  weights: Weight[]
  diameters: number[]
  colors: Color[]
  extruder_temp?: number
  extruder_temp_range?: [number, number]
  bed_temp?: number
  bed_temp_range?: [number, number]
  finish?: Finish
  multi_color_direction?: MultiColorDirection
  pattern?: Pattern
  translucent?: boolean
  glow?: boolean
}

export interface FilamentManufacturer {
  manufacturer: string
  filaments: FilamentEntry[]
}

export interface CompiledFilament {
  id: string
  manufacturer: string
  name: string
  material: string
  density: number
  weight: number
  spool_weight?: number
  spool_type?: SpoolType
  diameter: number
  color_hex?: string
  color_hexes?: string[]
  extruder_temp?: number
  extruder_temp_range?: [number, number]
  bed_temp?: number
  bed_temp_range?: [number, number]
  finish?: Finish
  multi_color_direction?: MultiColorDirection
  pattern?: Pattern
  translucent?: boolean
  glow?: boolean
}

export interface Material {
  material: string
  density: number
  extruder_temp?: number
  bed_temp?: number
}
