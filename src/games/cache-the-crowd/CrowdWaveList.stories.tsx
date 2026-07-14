import type { Meta, StoryObj } from '@storybook/react-vite'
import { CrowdWaveList } from './CrowdWaveList'
import type { CacheRequest } from './domain/cache'

const requests: CacheRequest[] = [
  { id: 'r1', visitorLabel: 'Visitor 1', resourceId: 'ticket', resourceLabel: 'Ticket Page', tick: 0 },
  { id: 'r2', visitorLabel: 'Visitor 2', resourceId: 'poster', resourceLabel: 'Poster Page', tick: 4 },
  { id: 'r3', visitorLabel: 'Visitor 3', resourceId: 'map', resourceLabel: 'Venue Map', tick: 4 },
  { id: 'r4', visitorLabel: 'Visitor 4', resourceId: 'ticket', resourceLabel: 'Ticket Page', tick: 5 },
]

const meta: Meta<typeof CrowdWaveList> = {
  title: 'Games/Cache the Crowd/CrowdWaveList',
  component: CrowdWaveList,
}

export default meta
type Story = StoryObj<typeof CrowdWaveList>

export const Predicting: Story = {
  name: 'Predicting — visitors selectable',
  args: {
    requests,
    interactive: true,
    selectedIds: ['r1'],
  },
}

export const MidWave: Story = {
  name: 'Mid-wave — some visitors still waiting',
  args: {
    requests,
    interactive: false,
    selectedIds: ['r1'],
    visualStateFor: (id) => (id === 'r1' ? 'miss' : id === 'r2' ? 'hit' : 'pending'),
  },
}

export const ThunderingHerd: Story = {
  name: 'Result — mistimed purge causes a thundering herd',
  args: {
    requests,
    interactive: false,
    selectedIds: ['r1', 'r2', 'r3'],
    visualStateFor: (id) => (id === 'r4' ? 'hit' : 'miss'),
  },
}

export const AllHits: Story = {
  name: 'Result — every repeat visit hits the cache',
  args: {
    requests,
    interactive: false,
    selectedIds: [],
    visualStateFor: (id) => (id === 'r1' ? 'miss' : 'hit'),
  },
}
