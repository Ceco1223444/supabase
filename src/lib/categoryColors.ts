export const CATEGORY_ORDER = [
  'Reclamation',
  'Shipping',
  'Technical',
  'Inventory',
  'Pricing',
  'Urgent',
  'Other',
] as const

// Muted categorical palette for charts — deliberately NOT the wordmark's
// saturated brand hues, which stay exclusive to the logo. Slot order is the
// colorblind-safety mechanism (validated: worst adjacent CVD ΔE 24.2 on
// white; aqua/yellow/magenta sit below 3:1 contrast, so the donut legend
// carries visible per-category counts as the relief).
export const CATEGORY_HEX: Record<string, string> = {
  Reclamation: '#2a78d6',
  Shipping: '#1baf7a',
  Technical: '#eda100',
  Inventory: '#008300',
  Pricing: '#4a3aa7',
  Urgent: '#e34948',
  Other: '#e87ba4',
}
