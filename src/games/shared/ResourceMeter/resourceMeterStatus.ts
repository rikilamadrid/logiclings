export type ResourceMeterStatus = 'calm' | 'busy' | 'strained'

export function resourceMeterStatus(value: number, max: number): ResourceMeterStatus {
  const ratio = max <= 0 ? 0 : value / max
  if (ratio >= 0.7) return 'strained'
  if (ratio >= 0.34) return 'busy'
  return 'calm'
}
