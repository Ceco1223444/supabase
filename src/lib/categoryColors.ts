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
  Reclamation: '#4285f4',
  Shipping: '#34a853',
  Technical: '#fbbc05',
  Inventory: '#00897b',
  Pricing: '#5e35b1',
  Urgent: '#ea4335',
  Other: '#c2185b',
}
