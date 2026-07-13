import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './TextField'

const meta = {
  title: 'Molecules/TextField',
  component: TextField,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof TextField>

export const Default: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Password',
    type: 'password',
    hint: 'At least 8 characters.',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'not-an-email',
    error: 'Enter a valid email address.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'you@example.com',
    disabled: true,
  },
}
