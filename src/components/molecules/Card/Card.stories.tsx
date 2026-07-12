import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../atoms/Badge/Badge'
import { Heading } from '../../atoms/Heading/Heading'
import { Text } from '../../atoms/Text/Text'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  argTypes: {
    elevation: { control: { type: 'select' }, options: ['flat', 'raised'] },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Raised: Story = {
  args: {
    elevation: 'raised',
    children: (
      <>
        <Badge tone="frontend">Frontend</Badge>
        <Heading level={3}>Event Bubbling</Heading>
        <Text tone="muted" size="sm">
          Pop the bubbles in capture order before they reach the root.
        </Text>
      </>
    ),
  },
}

export const Flat: Story = {
  args: {
    elevation: 'flat',
    children: (
      <>
        <Heading level={3}>Cache the Crowd</Heading>
        <Text tone="muted" size="sm">
          Absorb repeat requests before they hit the backend.
        </Text>
      </>
    ),
  },
}
