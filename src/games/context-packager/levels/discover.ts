import type { PackagingLevelContent } from '../domain/content'

export const discoverContent: PackagingLevelContent = {
  mode: 'discover',
  predicting: {
    prompt:
      "An agent is fixing a bug: discount codes don't apply at checkout. Pack only what it needs into its context — you have a limited budget.",
    scenario: {
      taskPrompt: "Fix the bug where discount codes don't apply at checkout.",
      budget: 40,
      idealIncludedIds: ['checkout-service', 'discount-spec'],
      items: [
        {
          id: 'checkout-service',
          label: 'checkout-service.ts',
          description: 'Where the discount is applied to the order total',
          category: 'relevant-file',
          cost: 20,
        },
        {
          id: 'onboarding-flow',
          label: 'onboarding-flow.tsx',
          description: 'The new-user onboarding screens',
          category: 'unrelated-file',
          cost: 15,
        },
        {
          id: 'discount-spec',
          label: 'Discount Rules Spec',
          description: 'How discount codes should be validated and applied',
          category: 'spec-snippet',
          cost: 15,
        },
        {
          id: 'old-notes',
          label: 'Q1 Planning Notes',
          description: 'Six-month-old notes about a pricing experiment that shipped and was later removed',
          category: 'stale-note',
          cost: 10,
        },
      ],
    },
  },
  transfer: {
    prompt:
      "New bug, same budget: the search bar doesn't return results for accented characters. Pack only what the agent needs.",
    scenario: {
      taskPrompt: "Fix the bug where the search bar doesn't return results for accented characters.",
      budget: 40,
      idealIncludedIds: ['search-index', 'unicode-spec'],
      items: [
        {
          id: 'search-index',
          label: 'search-index.ts',
          description: 'Where search queries are matched against the index',
          category: 'relevant-file',
          cost: 20,
        },
        {
          id: 'marketing-banner',
          label: 'marketing-banner.tsx',
          description: 'The homepage promo banner component',
          category: 'unrelated-file',
          cost: 10,
        },
        {
          id: 'unicode-spec',
          label: 'Search Normalization Spec',
          description: 'How search terms should be normalized before matching',
          category: 'spec-snippet',
          cost: 15,
        },
        {
          id: 'old-changelog',
          label: 'v1 Changelog',
          description: "Release notes from a version that's no longer deployed",
          category: 'stale-note',
          cost: 10,
        },
      ],
    },
  },
  explanation:
    "An agent only reasons well over what's actually in its context window. The file with the bug and the spec describing the correct behavior told it everything it needed — the unrelated file and the stale note about a scrapped experiment would only have diluted its focus.",
}
