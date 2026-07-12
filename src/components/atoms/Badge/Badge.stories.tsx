import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: [
        'neutral',
        'success',
        'warning',
        'danger',
        'frontend',
        'backend',
        'apis',
        'databases',
        'algorithms',
        'system-design',
        'networking',
        'security',
        'devops',
        'ai-fundamentals',
        'agentic-coding',
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Neutral: Story = {
  args: { tone: 'neutral', children: 'New' },
}

export const Success: Story = {
  args: { tone: 'success', children: 'Mastered' },
}

export const Warning: Story = {
  args: { tone: 'warning', children: 'Needs review' },
}

export const Danger: Story = {
  args: { tone: 'danger', children: 'Failed attempt' },
}

export const TrackAccents: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge tone="frontend">Frontend</Badge>
      <Badge tone="backend">Backend</Badge>
      <Badge tone="apis">APIs</Badge>
      <Badge tone="databases">Databases</Badge>
      <Badge tone="algorithms">Algorithms</Badge>
      <Badge tone="system-design">System Design</Badge>
      <Badge tone="networking">Networking</Badge>
      <Badge tone="security">Security</Badge>
      <Badge tone="devops">DevOps</Badge>
      <Badge tone="ai-fundamentals">AI Fundamentals</Badge>
      <Badge tone="agentic-coding">Agentic Coding</Badge>
    </div>
  ),
}
