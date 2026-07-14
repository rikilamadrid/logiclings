import type { PackagingLevelContent } from '../domain/content'

export const applyContent: PackagingLevelContent = {
  mode: 'apply',
  predicting: {
    prompt:
      'An agent is adding a field to the user profile form and saving it to the database. The budget is tighter this time, and there are more distractors — pack carefully.',
    scenario: {
      taskPrompt: 'Add a new field to the user profile form and save it to the database.',
      budget: 50,
      idealIncludedIds: ['profile-form', 'user-repo', 'validation-decision'],
      items: [
        {
          id: 'profile-form',
          label: 'ProfileForm.tsx',
          description: 'The form component you need to extend with the new field',
          category: 'relevant-file',
          cost: 15,
        },
        {
          id: 'user-repo',
          label: 'userRepository.ts',
          description: 'Where profile fields are persisted to the database',
          category: 'relevant-file',
          cost: 15,
        },
        {
          id: 'validation-decision',
          label: 'Decision Doc: Form Validation',
          description: 'Why profile forms validate on the client before submitting',
          category: 'prior-decision',
          cost: 10,
        },
        {
          id: 'billing-invoice',
          label: 'billing-invoice.tsx',
          description: 'The billing invoice screen',
          category: 'unrelated-file',
          cost: 15,
        },
        {
          id: 'onboarding-experiment',
          label: 'Onboarding Redesign Notes',
          description: 'Notes from an abandoned onboarding redesign',
          category: 'stale-note',
          cost: 10,
        },
      ],
    },
  },
  transfer: {
    prompt:
      'New task, same tight budget: add pagination to the orders list page. Pack only what the agent needs.',
    scenario: {
      taskPrompt: 'Add pagination to the orders list page.',
      budget: 50,
      idealIncludedIds: ['orders-list', 'orders-api', 'pagination-decision'],
      items: [
        {
          id: 'orders-list',
          label: 'OrdersListPage.tsx',
          description: 'The page component rendering the orders list',
          category: 'relevant-file',
          cost: 15,
        },
        {
          id: 'orders-api',
          label: 'orders-api.ts',
          description: 'The API endpoint returning orders — needs a page/limit param',
          category: 'relevant-file',
          cost: 15,
        },
        {
          id: 'pagination-decision',
          label: 'Decision Doc: Pagination Style',
          description: 'This app standardizes on cursor-based pagination',
          category: 'prior-decision',
          cost: 10,
        },
        {
          id: 'account-settings',
          label: 'AccountSettingsPage.tsx',
          description: 'The account settings page',
          category: 'unrelated-file',
          cost: 15,
        },
        {
          id: 'infinite-scroll-notes',
          label: 'Infinite Scroll Experiment Notes',
          description: 'Notes from a deprecated infinite-scroll experiment',
          category: 'stale-note',
          cost: 10,
        },
      ],
    },
  },
  explanation:
    "A tighter budget makes every extra item cost something real: pack a distractor and there's less room left for what the agent actually needs. The decision doc mattered here too — it told the agent which pattern to follow, not just where the code lives.",
}
