import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  it('renders its children', () => {
    render(
      <Container>
        <p>Mobile-first content</p>
      </Container>,
    )

    expect(screen.getByText('Mobile-first content')).toBeInTheDocument()
  })
})
