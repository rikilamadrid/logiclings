import type { PackagingLevelContent } from '../domain/content'

export const masterContent: PackagingLevelContent = {
  mode: 'master',
  predicting: {
    prompt:
      'An agent is fixing an intermittent 500 error on the payment webhook. A full log dump technically contains the answer, but it costs a lot of budget — decide what actually earns a spot in the package.',
    scenario: {
      taskPrompt: 'Fix the intermittent 500 error on the payment webhook endpoint.',
      budget: 40,
      idealIncludedIds: ['webhook-handler', 'relevant-log-excerpt', 'retry-decision'],
      items: [
        {
          id: 'webhook-handler',
          label: 'webhook-handler.ts',
          description: 'The webhook endpoint handler code — where the fix actually goes',
          category: 'relevant-file',
          cost: 20,
        },
        {
          id: 'full-log-dump',
          label: 'Full Server Log (24h)',
          description: "The entire day's server log — the error is in there somewhere",
          category: 'log-dump',
          cost: 35,
        },
        {
          id: 'relevant-log-excerpt',
          label: 'Error Stack Trace',
          description: 'Just the 500 error and the request that triggered it',
          category: 'log-dump',
          cost: 10,
        },
        {
          id: 'retry-decision',
          label: 'Decision Doc: Webhook Retries',
          description: 'Webhook retries use exponential backoff',
          category: 'prior-decision',
          cost: 10,
        },
        {
          id: 'admin-dashboard',
          label: 'AdminDashboardSettings.tsx',
          description: 'The admin dashboard settings page',
          category: 'unrelated-file',
          cost: 15,
        },
      ],
    },
  },
  transfer: {
    prompt:
      'New incident, same tradeoff: a race condition in inventory decrement. The full transaction log has the answer buried in it — does it earn its cost?',
    scenario: {
      taskPrompt: 'Fix a race condition in the inventory decrement when two orders are placed simultaneously.',
      budget: 40,
      idealIncludedIds: ['inventory-service', 'race-excerpt', 'locking-decision'],
      items: [
        {
          id: 'inventory-service',
          label: 'inventory-service.ts',
          description: 'The inventory decrement logic — where the fix actually goes',
          category: 'relevant-file',
          cost: 20,
        },
        {
          id: 'full-transaction-log',
          label: 'Full Transaction Log (7d)',
          description: 'The full database transaction log for the past week',
          category: 'log-dump',
          cost: 35,
        },
        {
          id: 'race-excerpt',
          label: 'Conflicting Transactions Excerpt',
          description: 'Just the two conflicting transactions from the incident window',
          category: 'log-dump',
          cost: 10,
        },
        {
          id: 'locking-decision',
          label: 'Decision Doc: Concurrency Strategy',
          description: 'This service uses optimistic locking, not row locks',
          category: 'prior-decision',
          cost: 10,
        },
        {
          id: 'marketing-site',
          label: 'MarketingHomepage.tsx',
          description: 'The marketing site homepage',
          category: 'unrelated-file',
          cost: 15,
        },
      ],
    },
  },
  explanation:
    "The full log contained the answer, but at 35 units it left no room for the handler file itself — the thing the agent actually needed to edit. A 10-unit excerpt of just the relevant trace did the same job for a third of the cost. More raw context isn't more signal; it can just be more to wade through, and budget it can't spend on what matters.",
}
