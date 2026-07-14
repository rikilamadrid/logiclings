import type { Meta, StoryObj } from '@storybook/react-vite'
import { PackingList } from './PackingList'
import type { ContextItem } from './domain/packaging'

const items: ContextItem[] = [
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
]

const meta: Meta<typeof PackingList> = {
  title: 'Games/Context Packager/PackingList',
  component: PackingList,
}

export default meta
type Story = StoryObj<typeof PackingList>

export const Packing: Story = {
  name: 'Packing — items selectable',
  args: {
    items,
    interactive: true,
    packedIds: ['checkout-service'],
  },
}

export const MidReveal: Story = {
  name: 'Mid-reveal — some items still packing',
  args: {
    items,
    interactive: false,
    packedIds: ['checkout-service', 'discount-spec'],
    visualStateFor: (id) => (id === 'checkout-service' ? 'good' : id === 'discount-spec' ? 'pending' : 'excluded'),
  },
}

export const CorrectResult: Story = {
  name: 'Result — exactly the essential items packed',
  args: {
    items,
    interactive: false,
    packedIds: ['checkout-service', 'discount-spec'],
    visualStateFor: (id) => (id === 'checkout-service' || id === 'discount-spec' ? 'good' : 'excluded'),
  },
}

export const MissedAndDiluted: Story = {
  name: 'Result — an essential item missed and a distractor packed',
  args: {
    items,
    interactive: false,
    packedIds: ['onboarding-flow'],
    visualStateFor: (id) => {
      if (id === 'onboarding-flow') return 'extraneous'
      if (id === 'checkout-service' || id === 'discount-spec') return 'missing'
      return 'excluded'
    },
  },
}
