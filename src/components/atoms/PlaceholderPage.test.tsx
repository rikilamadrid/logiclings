import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlaceholderPage } from './PlaceholderPage'

describe('PlaceholderPage', () => {
  it('renders the title and description', () => {
    render(<PlaceholderPage title="Home" description="Welcome back." />)

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByText('Welcome back.')).toBeInTheDocument()
  })
})
