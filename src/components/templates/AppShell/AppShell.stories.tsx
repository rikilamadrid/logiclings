import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Heading } from '../../atoms/Heading/Heading'
import { Text } from '../../atoms/Text/Text'
import { AppShell } from './AppShell'

const meta: Meta<typeof AppShell> = {
  title: 'Templates/AppShell',
  component: AppShell,
}

export default meta
type Story = StoryObj<typeof AppShell>

export const Default: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            index
            element={
              <>
                <Heading level={1}>Home</Heading>
                <Text tone="muted">Page content renders inside the shell.</Text>
              </>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  ),
}
