import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Heading } from './Heading'

describe('Heading', () => {
  it('renders the correct heading level', () => {
    render(<Heading level={2}>Frontend Track</Heading>)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Frontend Track' }),
    ).toBeInTheDocument()
  })
})
