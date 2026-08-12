export interface FilterOption {
  value: any
  label: string
  code?: string
}

export interface FilterField {
  name: string
  base: string
  lookup: string
  lookup_label: string
  label: string
  type: string
  endpoint?: string
  has_inline_options?: boolean
  options?: FilterOption[]
}