const MISSING_ESSENTIAL_PENALTY = 30
const EXTRANEOUS_ITEM_PENALTY = 15
const OVER_BUDGET_PENALTY = 40

export type ContextItemCategory =
  | 'relevant-file'
  | 'unrelated-file'
  | 'stale-note'
  | 'prior-decision'
  | 'spec-snippet'
  | 'log-dump'

export interface ContextItem {
  id: string
  label: string
  description: string
  category: ContextItemCategory
  cost: number
}

export interface PackagingScenario {
  taskPrompt: string
  budget: number
  items: ContextItem[]
  /** The authored answer key: exactly which items belong in the package. */
  idealIncludedIds: string[]
}

export interface PackagingSimulationInput {
  scenario: PackagingScenario
  packedIds: string[]
}

export interface PackagingSimulationResult {
  totalCost: number
  overBudget: boolean
  missingIds: string[]
  extraneousIds: string[]
  qualityScore: number
  correct: boolean
}

export function totalCostOf(packedIds: Iterable<string>, items: ContextItem[]): number {
  const packed = new Set(packedIds)
  return items
    .filter((item) => packed.has(item.id))
    .reduce((sum, item) => sum + item.cost, 0)
}

/**
 * Grades a packed context selection against the scenario's answer key. Quality
 * degrades for every essential item left out (the agent lacks needed signal),
 * every non-essential item packed anyway (dilution), and for going over the
 * visible budget at all — a raw item count is never the deciding factor.
 */
export function simulatePackaging(input: PackagingSimulationInput): PackagingSimulationResult {
  const { scenario, packedIds } = input
  const packed = new Set(packedIds)
  const ideal = new Set(scenario.idealIncludedIds)

  const totalCost = totalCostOf(packed, scenario.items)
  const overBudget = totalCost > scenario.budget

  const missingIds = scenario.idealIncludedIds.filter((id) => !packed.has(id))
  const extraneousIds = packedIds.filter((id) => !ideal.has(id))

  let qualityScore =
    100 - missingIds.length * MISSING_ESSENTIAL_PENALTY - extraneousIds.length * EXTRANEOUS_ITEM_PENALTY
  if (overBudget) qualityScore -= OVER_BUDGET_PENALTY
  qualityScore = Math.max(0, Math.min(100, qualityScore))

  const correct = missingIds.length === 0 && extraneousIds.length === 0 && !overBudget

  return { totalCost, overBudget, missingIds, extraneousIds, qualityScore, correct }
}
