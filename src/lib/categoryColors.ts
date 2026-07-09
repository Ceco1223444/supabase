export const CATEGORY_ORDER = [
  'Reclamation',
  'Shipping',
  'Technical',
  'Inventory',
  'Pricing',
  'Urgent',
  'Other',
] as const

export const CATEGORY_HEX: Record<string, string> = {
  Reclamation: '#3987e5',
  Shipping: '#199e70',
  Technical: '#c98500',
  Inventory: '#008300',
  Pricing: '#9085e9',
  Urgent: '#e66767',
  Other: '#d55181',
}
